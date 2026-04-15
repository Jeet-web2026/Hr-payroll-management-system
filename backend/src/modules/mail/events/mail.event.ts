export class WelcomeMailEvent {
  constructor(
    public readonly to: string,
    public readonly name: string,
    public readonly otp: number,
    public readonly otpExpiry: Date,
  ) {}
}

export class ResetPasswordMailEvent {
  constructor(
    public readonly to: string,
    public readonly token: string,
  ) {}
}
