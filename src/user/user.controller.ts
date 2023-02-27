import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  HttpException,
  HttpCode,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClearUser } from 'src/common/types';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { UserService } from './user.service';
import { accessCheck } from 'src/common/access';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    res.status(HttpStatus.OK).send(await this.userService.getAllUsers());
    return '';
  }
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const dbResponse = await this.userService.getUser(id);
    const resData = dbResponse.data as ClearUser;
    if (!resData || !resData.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const dbResponse = await this.userService.create(createUserDto);
    if (dbResponse.code === 400)
      throw new HttpException('Data missing', dbResponse.code);
    res.status(HttpStatus.CREATED).send(dbResponse.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.userService.changePassword(id, updatePasswordDto);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  async delUserById(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.userService.removeUser(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
