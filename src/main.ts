import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, CLEAN_DB } from './common/const';
import { AppDataSource } from './db/db.config';
import { Favorites, Track, Album, Artist } from './db/db.entities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  AppDataSource.initialize()
    .then(async () => {
      if (CLEAN_DB) {
        const repositoryF = AppDataSource.getRepository(Favorites);
        await repositoryF.query(`TRUNCATE Favorites RESTART IDENTITY CASCADE;`);
        const repositoryT = AppDataSource.getRepository(Track);
        await repositoryT.query(`TRUNCATE Track RESTART IDENTITY CASCADE;`);
        const repositoryAr = AppDataSource.getRepository(Artist);
        await repositoryAr.query(`TRUNCATE Artist RESTART IDENTITY CASCADE;`);
        const repositoryAl = AppDataSource.getRepository(Album);
        await repositoryAl.query(`TRUNCATE Album RESTART IDENTITY CASCADE;`);
      }
      console.log('DB connected!');
    })
    .catch((error) => {
      console.log(JSON.stringify(AppDataSource.options));
      console.log(error);
    });
}
bootstrap();
