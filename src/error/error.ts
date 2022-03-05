import { IsEmail, IsNotEmpty } from 'class-validator';

export class Token {
  @IsNotEmpty()
  token: string;
}

export class Id {
  @IsNotEmpty()
  id: string;
}

export class ActionId {
  @IsNotEmpty()
  actionId: string;
}

export class User {
  @IsNotEmpty()
  uid: string;
}