import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose() id: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() role: string;
  @Expose() status: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}