import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './modules/swagger/swagger.config';
import { json, urlencoded } from 'express';
import { ErrorFilter } from './filters/exception.filter';
import { QueryFailedFilter } from './filters/query.filter';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin:'*',
    credentials: true,
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(rateLimit({
    windowMs: 1000, // 1 sec
    max: 30, // limit each IP to 30 requests per windowMs
  }));

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new ErrorFilter(reflector),
    new QueryFailedFilter(reflector),
    new BadRequestExceptionFilter(reflector)
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist:true, forbidNonWhitelisted:true   }));


  setupSwagger(app);

  await app.listen(process.env.PORT);
  console.log(`Server is running on port 8080`);
}
bootstrap();
