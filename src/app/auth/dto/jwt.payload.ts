export interface JwtPayload {
    username: string,
    id: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload;
}