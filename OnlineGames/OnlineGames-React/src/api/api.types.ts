export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;