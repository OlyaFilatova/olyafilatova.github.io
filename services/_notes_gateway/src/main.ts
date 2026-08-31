import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { AppModule } from './app.module.js';

const routes = {
  issue: process.env.ISSUES_SERVICE_URL,
  note: process.env.NOTES_SERVICE_URL,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const express = app.getHttpAdapter().getInstance();

  for (const [name, target] of Object.entries(routes)) {
    express.use(
      `/api/${name}`,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${name}`]: `/${name}`,
        },
      }),
    );
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
