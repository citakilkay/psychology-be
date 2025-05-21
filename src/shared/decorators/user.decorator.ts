import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload, RequestWithUser } from "src/app/auth/dto";

export const GetUser = createParamDecorator(
    (property: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user as JwtPayload;

        return property ? user?.[property] : user;
    },
);
