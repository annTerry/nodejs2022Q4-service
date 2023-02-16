import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/const';
import { AppDataSource } from './db/db.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  AppDataSource.initialize()
    .then(() => {
      console.log('DB connected!');
    })
    .catch((error) => {
      console.log(JSON.stringify(AppDataSource.options));
      console.log(error);
    });
}
bootstrap();
