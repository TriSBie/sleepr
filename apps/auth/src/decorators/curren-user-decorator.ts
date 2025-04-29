import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../users/models/users.schema";

const getCurrentUser = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest()?.user as UserDocument; // Return the user object from the request
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
