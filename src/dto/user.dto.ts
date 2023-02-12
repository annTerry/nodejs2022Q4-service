export class CreateUserDto {
  login: string;
  password: string;
}

export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
