import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Token } from 'src/common/types';
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
    if (dbResponse.code === 403)
      throw new HttpException('Wrong password', dbResponse.code);
    if (dbResponse.code === 200) {
      const data = dbResponse.data as Token;
      console.log(data.accessToken);
      res
        .status(HttpStatus.CREATED)
        .header('authorization', `Bearer ${data.accessToken}`)
        .send(dbResponse.data);
    }
  }
}
