export interface JwtPayload {
    username: string,
    id: string
}

export interface CustomRequest extends Request {
    user: JwtPayload;
}