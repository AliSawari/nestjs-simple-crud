import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const minLength = value.length >= 8;
          const hasUppercase = /[A-Z]/.test(value);
          const hasLowercase = /[a-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSpecialChar = /[!@#$%^&*]/.test(value);

          return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
        },
      },
    });
  };
}