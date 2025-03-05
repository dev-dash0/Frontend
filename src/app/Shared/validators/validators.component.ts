import { Validators } from '@angular/forms';

export const signupValidators = {
  name: [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
  ],
  email: [Validators.required, Validators.email],
  password: [
    Validators.required,
    Validators.pattern(
      // /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
      // /^(?=.[a-z])(?=.[A-Z])(?=.*\d).+$/
      // /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]+$/
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]+$/

    ),
  ],
};
