import { User } from "@app/common/models";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const getCurrentUser = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest()?.user as User; // Return the user object from the request
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
