import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT;

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Covid 19 Angola API')
    .setDescription(
      'Get data from covid-19 in Angola and your vaccination certificate',
    )
    .setVersion('1.0.0')
    .setExternalDoc('Github Repo', '')
    .addBearerAuth({
      type: 'http',
      in: '/auth/google',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`);
  });
}

bootstrap();
