// Master list of all possible error messages that a service can have, expand as needed
type ServiceError = 'INTERNAL_ERROR' | 'NOT_FOUND';

// This utility allows us to use ServiceError as a list of all possible output values
// while making subtypes that only have some of the values which is then enforced by TypeScript
type ServiceErrorSubtype<T extends ServiceError> = T;

export { type ServiceErrorSubtype };
