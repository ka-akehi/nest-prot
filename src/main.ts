import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 許可するオリジンを環境変数にカンマ区切りで指定
  // ただし、設定しないまたは空の場合は'self'のみ許可
  const frameAncestors = process.env.FRAME_ANCESTORS?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.use(
    helmet({
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'frame-ancestors': frameAncestors?.length
            ? frameAncestors
            : ["'self'"],
        },
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
