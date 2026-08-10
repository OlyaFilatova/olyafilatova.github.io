import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type UserConfig } from "vite";

const staticFiles = [
  ["extension/manifest.json", "dist/manifest.json"],
  ["extension/content/website.css", "dist/content/website.css"],
];

function copyStaticExtensionFiles() {
  return {
    name: "copy-static-extension-files",
    closeBundle() {
      for (const [from, to] of staticFiles) {
        const target = resolve(to);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(resolve(from), target);
      }
    }
  };
}

type BuildConfig = {
  input: string;
  fileName?: string;
  emptyOutDir: boolean;
  html?: boolean;
};

const buildsByMode: Record<string, BuildConfig> = {
  background: {
    input: "extension/background/service-worker.ts",
    fileName: "background/service-worker.js",
    emptyOutDir: true
  },

  content: {
    input: "extension/content/content.tsx",
    fileName: "content/content.js",
    emptyOutDir: false
  },

  ui: {
    // React entry
    input: "extension/side_panel/index.html",
    emptyOutDir: false,
    html: true
  }
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const build = buildsByMode[mode] ?? buildsByMode.background;

  return {
    define: {
      'import.meta': 'process',
      API_URL: `\"${env.VITE_GATEWAY}\"`,
    },
    plugins: [
      react(),
      ...(mode === "background" ? [copyStaticExtensionFiles()] : [])
    ],

    build: build.html
      ? createHtmlBuild(build.input, build.emptyOutDir)
      : createSingleEntryBuild(
          build.input,
          build.fileName!,
          build.emptyOutDir
        )
  } satisfies UserConfig;
});

function createSingleEntryBuild(
  input: string,
  fileName: string,
  emptyOutDir: boolean
): UserConfig["build"] {
  return {
    outDir: "dist",
    emptyOutDir,
    rollupOptions: {
      input,
      output: {
        entryFileNames: fileName,
        inlineDynamicImports: true
      }
    }
  };
}

function createHtmlBuild(
  input: string,
  emptyOutDir: boolean
): UserConfig["build"] {
  return {
    outDir: "dist",
    emptyOutDir,
    rollupOptions: {
      input: resolve(input)
    }
  };
}
