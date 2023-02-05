import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UserDto,
  ClearUserDto,
  ResponseUser,
} from '../dto/user.dto';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist } from '../common/utility';

@Injectable()
export class UserService {
  private readonly users: { [id: string]: UserDto } = {};

  create(user: CreateUserDto): number {
    const validate =
      stringAndExist(user.login) && stringAndExist(user.password);
    if (!validate) return 400;
    const newUser = new UserDto();
    newUser.password = user.password;
    newUser.login = user.login;
    newUser.id = newUUID();
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();
    this.users[newUser.id] = newUser;
    return 200;
  }

  getAllUsers(): UserDto[] {
    return Object.values(this.users);
  }

  getUser(id: string): ResponseUser {
    const response = new ResponseUser();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const user = this.users[id];
    if (!user) {
      response.code = 404;
      response.message = `User with id ${id} not found`;
      return response;
    }
    response.code = 200;
    const clearUser = new ClearUserDto();
    [
      clearUser.id,
      clearUser.login,
      clearUser.version,
      clearUser.updatedAt,
      clearUser.createdAt,
    ] = [user.id, user.login, user.version, user.updatedAt, user.createdAt];
    response.user = clearUser;
    return response;
  }
}
