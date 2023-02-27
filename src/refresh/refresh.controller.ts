import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Token } from 'src/common/types';
import { RefreshDto } from '../dto/user.dto';
import { RefreshService } from './refresh.service';
import { accessCheck } from 'src/common/access';

@Controller('auth/refresh')
export class RefreshController {
  constructor(private signupService: RefreshService) {}

  @Post() async create(
    @Body() token: RefreshDto,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const dbResponse = await this.signupService.check(token);
    if (dbResponse.code === 401)
      throw new HttpException('Data missing', dbResponse.code);
    if (dbResponse.code === 403)
      throw new HttpException('Authorization Failed', dbResponse.code);
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
