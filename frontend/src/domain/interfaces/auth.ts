export interface IUser {
  username: string;
  email: string;
  role: "admin" | "user";
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IToken {
  access_token: string;
}

export interface ITokenResponce {
  data: IToken;
  error?: any;
}
