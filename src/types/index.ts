// Generic SaaS boilerplate types

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
