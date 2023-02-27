import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../dto/user.dto';
import { LoginService } from './login.service';

@Controller('auth/login')
export class LoginController {
  constructor(private signupService: LoginService) {}

  @Post() async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const dbResponse = await this.signupService.check(createUserDto);
    if (dbResponse.code === 400)
      throw new HttpException('Data missing', dbResponse.code);
    res.status(HttpStatus.CREATED).send(dbResponse.data);
  }
}
