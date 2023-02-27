import { Injectable } from '@nestjs/common';
import { DBResponse } from 'src/common/types';
import { stringAndExist } from 'src/common/utility';
import { CreateUserDto, RefreshDto } from 'src/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_REFRESH_KEY } from 'src/common/const';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshService {
  constructor(private userService: UserService) {}
  async check(token: RefreshDto): Promise<DBResponse> {
    const response = new DBResponse();
    if (!stringAndExist(token.refreshToken)) response.code = 401;
    else {
      try {
        console.log(token.refreshToken);
        const decoded = jwt.verify(
          token.refreshToken,
          JWT_SECRET_REFRESH_KEY,
        ) as CreateUserDto;
        response.data = this.userService.getToken({
          login: decoded.login,
          password: decoded.password,
        });
        response.code = 200;
      } catch (err) {
        console.log(err);
        response.code = 403;
      }
    }
    return response;
  }
}
