type ServiceErrorCode = 'UNKNOWN_ERROR' | '';

type ServiceError = {
  code: ServiceErrorCode;
  message: string;
};

export { type ServiceError, type ServiceErrorCode };
