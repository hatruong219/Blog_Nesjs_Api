import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
  .setTitle('My Blog')
  .setDescription('The Blog API description')
  .setVersion('1.0')
  .addTag('blogs')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (error) => new BadRequestException(error)
    })
  );
  app.useGlobalFilters(new BadRequestExceptionFilter());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
