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
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  userService = new UserService();

  @Get()
  getAllUsers(): string {
    return JSON.stringify(this.userService.getAllUsers());
  }
  @Get(':id')
  getUserById(@Param('id') id: string): string {
    const dbResponse = this.userService.getUser(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const dbResponse = await this.userService.create(createUserDto);
    if (dbResponse.code === 400)
      throw new HttpException('Data missing', dbResponse.code);
    console.log(dbResponse);
    res.status(HttpStatus.CREATED).send(dbResponse.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const result = this.userService.changePassword(id, updatePasswordDto);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.userService.removeUser(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
