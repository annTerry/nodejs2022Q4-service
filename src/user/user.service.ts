import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { User, ClearUser, DBResponse } from '../common/types';

@Injectable()
export class UserService {
  constructor(private db: DataBase) {}

  async create(user: CreateUserDto): Promise<DBResponse> {
    const response = new DBResponse();
    const validate =
      stringAndExist(user.login) && stringAndExist(user.password);
    if (!validate) {
      response.code = 400;
      return response;
    }
    const newUser = new User();
    newUser.password = user.password;
    newUser.login = user.login;
    newUser.id = newUUID();
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();
    this.db.setUser(newUser);
    response.code = 200;
    response.data = this.db.getClearUser(newUser.id);
    return response;
  }

  getAllUsers(): ClearUser[] {
    return this.db.allUsers();
  }

  getUser(id: string): DBResponse {
    const response = new DBResponse();
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

  removeUser(id: string): DBResponse {
    const response = this.getUser(id);
    if (!response.data) return response;
    this.db.removeUser(id);
    return response;
  }

  async changePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<DBResponse> {
    let response = new DBResponse();
    const validData =
      stringAndExist(updatePasswordDto.newPassword) &&
      stringAndExist(updatePasswordDto.oldPassword);
    if (!validData) {
      response.code = 400;
      response.message = 'Wrong data';
      return response;
    }
    response = this.getUser(id);
    if (!response.data) return response;
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
    response.data = this.db.getClearUser(id);
    return response;
  }
}
