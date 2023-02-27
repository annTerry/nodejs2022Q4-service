import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { User, ClearUser, DBResponse, Token } from '../common/types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY, TOKEN_EXPIRE_TIME } from 'src/common/const';

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
    await this.db.setUser(newUser);
    response.code = 200;
    response.data = await this.db.getClearUser(newUser.id);
    return response;
  }

  async getAllUsers(): Promise<ClearUser[]> {
    return this.db.allUsers();
  }

  async getUser(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const user = await this.db.getUser(id);
    if (!user || !user.id) {
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

  async removeUser(id: string): Promise<DBResponse> {
    const response = await this.getUser(id);
    if (response.code !== 200) return response;
    await this.db.removeUser(id);
    return response;
  }

  async checkUser(login: string, password: string): Promise<DBResponse> {
    const response = new DBResponse();
    const validData = stringAndExist(login) && stringAndExist(password);
    if (!validData) {
      response.code = 400;
      response.message = 'Wrong data';
      return response;
    }
    const user = await this.db.getUserByPassword(login, password);
    if (user && user.id) {
      response.code = 200;
      response.data = new Token();
      response.data.token = jwt.sign(
        { login: login, password: password },
        JWT_SECRET_KEY,
        { expiresIn: TOKEN_EXPIRE_TIME },
      );
    } else {
      response.code = 403;
      response.message = 'Wrong Login or Password';
    }
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
    response = await this.getUser(id);
    if (!response.data) return response;
    const user = await this.db.getUser(id);
    const salt = bcrypt.genSaltSync(+this.db.saltRounds);
    const hashPass = await bcrypt.hash(updatePasswordDto.oldPassword, salt);
    if (user.id && user.password !== hashPass) {
      response.code = 403;
      response.message = 'Old password is wrong';
      return response;
    }
    user.password = updatePasswordDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    await this.db.setUser(user);
    response.data = await this.db.getClearUser(id);
    return response;
  }
}
