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
} from '@nestjs/common';
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
  async create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);
    if (result === 400) throw new HttpException('Data missing', result);
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
