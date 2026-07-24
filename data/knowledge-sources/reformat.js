#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";

async function main() {
  const entries = await fs.readdir(".");

  const jsonFiles = entries.filter((file) =>
    file.toLowerCase().endsWith(".json")
  );

  for (const file of jsonFiles) {
    const folderName = path.basename(file, ".json");

    try {
      // Read and parse JSON
      const raw = await fs.readFile(file, "utf8");
      const obj = JSON.parse(raw);

      // Create output folder
      await fs.mkdir(folderName, { recursive: true });

      // Split into meta and content
      const meta = {};
      let content = null;

      for (const [key, value] of Object.entries(obj)) {
        if (key === "thoughts") {
          content = value;
        } else {
          meta[key] = value;
        }
      }

      // Write files
      await fs.writeFile(
        path.join(folderName, "meta.json"),
        JSON.stringify(meta, null, 2),
        "utf8"
      );

      await fs.writeFile(
        path.join(folderName, "content.json"),
        JSON.stringify(content, null, 2),
        "utf8"
      );

      // Remove original file
      await fs.unlink(file);

      console.log(`Processed: ${file}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});