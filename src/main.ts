import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS ni yoqish (Frontend uchun)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URL
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // ✅ MUHIM - Bu yoqilgan bo'lishi kerak
      transformOptions: {
        enableImplicitConversion: true, // ✅ Qo'shimcha yoqish
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');
  console.log("join: ",join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  ;

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Server ishga tushdi: http://localhost:${port}`);
  console.log(`📚 API: http://localhost:${port}/api`);
  console.log(`🖼 Rasmlarga kirish: http://localhost:${port}/uploads/filename.jpg`);
}

bootstrap();
