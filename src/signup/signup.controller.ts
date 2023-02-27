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
import { SignupService } from './signup.service';

@Controller('auth/signup')
export class SignupController {
  constructor(private signupService: SignupService) {}

  @Post() async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const dbResponse = await this.signupService.create(createUserDto);
    if (dbResponse.code === 400)
      throw new HttpException('Data missing', dbResponse.code);
    res.status(HttpStatus.CREATED).send(dbResponse.data);
  }
}
