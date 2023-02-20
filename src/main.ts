import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/const';
import { AppDataSource } from './db/db.config';
import { Favorites } from './db/db.entities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  AppDataSource.initialize()
    .then(() => {
      console.log('DB connected!');
      const repository = AppDataSource.getRepository(Favorites);
      repository.query(`TRUNCATE Favorites`);
    })
    .catch((error) => {
      console.log(JSON.stringify(AppDataSource.options));
      console.log(error);
    });
}
bootstrap();
