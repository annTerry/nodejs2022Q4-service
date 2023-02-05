import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { User, ClearUser, Response } from '../common/types';

@Injectable()
export class UserService {
  db = new DataBase();

  create(user: CreateUserDto): number {
    const validate =
      stringAndExist(user.login) && stringAndExist(user.password);
    if (!validate) return 400;
    const newUser = new User();
    newUser.password = user.password;
    newUser.login = user.login;
    newUser.id = newUUID();
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();
    this.db.setUser(newUser);
    return 200;
  }

  getAllUsers(): ClearUser[] {
    return this.db.allUsers();
  }

  getUser(id: string): Response {
    const response = new Response();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const user = this.db.getUser(id);
    if (!user) {
      response.code = 404;
      response.message = `User with id ${id} not found`;
      return response;
    }
    response.code = 200;
    const clearUser = new ClearUser();
    [
      clearUser.id,
      clearUser.login,
      clearUser.version,
      clearUser.updatedAt,
      clearUser.createdAt,
    ] = [user.id, user.login, user.version, user.updatedAt, user.createdAt];
    response.data = clearUser;
    return response;
  }

  removeUser(id: string): Response {
    const response = this.getUser(id);
    if (!response.data) return response;
    this.db.removeUser(id);
    return response;
  }

  changePassword(id: string, updatePasswordDto: UpdatePasswordDto): Response {
    const response = this.getUser(id);
    if (!response.data) return response;
    const validData =
      stringAndExist(updatePasswordDto.newPassword) &&
      stringAndExist(updatePasswordDto.oldPassword);
    if (!validData) {
      response.code = 400;
      response.message = 'Wrong data';
      return response;
    }
    const user = this.db.getUser(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      response.code = 403;
      response.message = 'Old password is wrong';
      return response;
    }
    user.password = updatePasswordDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    this.db.setUser(user);
    return response;
  }
}
