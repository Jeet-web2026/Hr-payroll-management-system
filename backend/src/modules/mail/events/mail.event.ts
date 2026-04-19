export class WelcomeMailEvent {
  constructor(
    public readonly to: string,
    public readonly name: string,
    public readonly otp: number | null,
    public readonly otpExpiry: Date | null,
  ) {}
}

export class ResetPasswordMailEvent {
  constructor(
    public readonly to: string,
    public readonly token: string,
  ) {}
}
