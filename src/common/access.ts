import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/common/const';
import { DBResponse } from './types';

export const accessCheck = (data?: string): DBResponse => {
  const response = new DBResponse();
  response.code = 401;
  if (data) {
    const checkedData = data.replace('Bearer ', '');
    try {
      console.log(checkedData);
      jwt.verify(checkedData, JWT_SECRET_KEY);
      response.code = 200;
    } catch (err) {
      console.log(err);
    }
  }
  return response;
};
