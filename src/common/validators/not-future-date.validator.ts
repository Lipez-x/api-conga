import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNotFutureDate(validationOptions: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const date = new Date(value);
          const now = new Date();
          return date <= now;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} não pode ser uma data futura`;
        },
      },
    });
  };
}
