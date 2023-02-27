import { Injectable } from '@nestjs/common';
import { DBResponse } from 'src/common/types';
import { DataBase } from 'src/db/db.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SignupService {
  constructor(private db: DataBase, private userService: UserService) {}
  async create(user: CreateUserDto): Promise<DBResponse> {
    return await this.userService.create(user);
  }
}
