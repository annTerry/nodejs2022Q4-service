export class CreateUserDto {
  login: string;
  password: string;
}

export class UserDto {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class ClearUserDto {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class ResponseUser {
  code: number;
  message: string;
  user: ClearUserDto;
}
