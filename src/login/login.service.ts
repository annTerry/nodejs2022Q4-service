import { Injectable } from '@nestjs/common';
import { DBResponse } from 'src/common/types';
import { DataBase } from 'src/db/db.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoginService {
  constructor(private db: DataBase, private userService: UserService) {}
  async check(user: CreateUserDto): Promise<DBResponse> {
    return await this.userService.checkUser(user.login, user.password);
  }
}
