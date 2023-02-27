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
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ClearUser } from 'src/common/types';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Res() res: Response): Promise<string> {
    res.status(HttpStatus.OK).send(await this.userService.getAllUsers());
    return '';
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<string> {
    const dbResponse = await this.userService.getUser(id);
    const resData = dbResponse.data as ClearUser;
    if (!resData || !resData.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
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
  ) {
    const result = await this.userService.changePassword(id, updatePasswordDto);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  async delUserById(@Param('id') id: string) {
    const result = await this.userService.removeUser(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
