import { Example } from 'tsoa';

export class LoginDto {
  @Example('somelogintest')
  login!: string;
  @Example('adminPasswordtest')
  password!: string;
}
