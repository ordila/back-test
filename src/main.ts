import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use((req, res, next) => {
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);
    next();
  });

  app.enableCors({
    origin: [
      'https://localhost:3000',
      'https://back-test-production-9b83.up.railway.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3005);
}
bootstrap();
