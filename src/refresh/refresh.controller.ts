import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RefreshDto } from '../dto/user.dto';
import { RefreshService } from './refresh.service';

@Controller('auth/login')
export class LoginController {
  constructor(private signupService: RefreshService) {}

  @Post() async create(@Body() token: RefreshDto, @Res() res: Response) {
    const dbResponse = await this.signupService.check(token);
    if (dbResponse.code === 401)
      throw new HttpException('Data missing', dbResponse.code);
    res.status(HttpStatus.CREATED).send(dbResponse.data);
  }
}
