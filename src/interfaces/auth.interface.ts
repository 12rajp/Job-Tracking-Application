export interface RegisterBody {
  user_name: string;
  email: string;
  password: string;
}

export interface VerifyParams {
  token: string;
}

 export interface LoginBody {
  email?: string;
  user_name?: string;
  password: string;
}
