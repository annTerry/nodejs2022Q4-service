import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AppDataSource } from './db/db.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    AppDataSource.initialize()
      .then(() => {
        res.status(HttpStatus.OK).send('DB connected');
      })
      .catch((error) => {
        res.status(404).send('DB error');
        console.log(JSON.stringify(AppDataSource.options));
        console.log(error);
      });
  }
}
