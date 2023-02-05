import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
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
    if (!dbResponse.user) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.user);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);
    if (result === 400) throw new HttpException('Data missing', result);
  }
}
