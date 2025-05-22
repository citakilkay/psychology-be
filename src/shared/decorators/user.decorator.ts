import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithUser, ReqUser } from "src/app/auth/dto";

export const GetUser = createParamDecorator(
    (property: keyof ReqUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user as ReqUser;

        return property ? user?.[property] : user;
    },
);
