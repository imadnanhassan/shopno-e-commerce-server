export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AdminLoginInput {
  identifier: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  profilePic?: string;
}
