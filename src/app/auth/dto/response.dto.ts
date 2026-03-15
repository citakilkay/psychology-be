export class LoginResponseDto {
  accessToken: string;
  expireInHours: number;
  userId: string;
}

export class RefreshTokenResponseDto {
  accessToken: string;
  expireInHours: number;
  userId: string;
}
