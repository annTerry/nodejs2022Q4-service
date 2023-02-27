import { Injectable } from '@nestjs/common';
import { DBResponse } from 'src/common/types';
import { stringAndExist } from 'src/common/utility';
import { RefreshDto } from 'src/dto/user.dto';

@Injectable()
export class RefreshService {
  async check(token: RefreshDto): Promise<DBResponse> {
    const response = new DBResponse();
    if (!stringAndExist(token.refreshToken)) response.code = 401;
    else response.code = 200;
    return response;
  }
}
