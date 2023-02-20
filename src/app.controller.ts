import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AppDataSource } from './db/db.config';

@Controller()
export class AppController {
  baseConnected = false;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    this.appService.getHello();
    if (AppDataSource.isInitialized)
      res.status(HttpStatus.OK).send('DB connected');
    else res.status(HttpStatus.NOT_IMPLEMENTED).send('DB was not connect');
  }
}
