import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🔓 CORS hamma joyga ochiq
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // ✅ MUHIM
      transformOptions: {
        enableImplicitConversion: true, // ✅ Qo'shimcha
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Statik fayllar uchun uploads papkasi
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server ishga tushdi: http://localhost:${port}`);
  console.log(`📚 API: http://localhost:${port}/api`);
  console.log(`🖼 Rasmlarga kirish: http://localhost:${port}/uploads/filename.jpg`);
}

bootstrap();
