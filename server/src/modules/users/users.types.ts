export interface RegisterBody {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
