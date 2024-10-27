import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  // add validatation input
  app.useGlobalPipes(new ValidationPipe());
  const configSwagger = new DocumentBuilder()
  .setTitle("Test API Youtube")
  .setDescription("Danh sách các API về youtube mini")
  .setVersion("1.0")
  .build()

  const swagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("swagger", app, swagger);
  const port = configService.get<number>('PORT')
  await app.listen(port);
}
bootstrap();
