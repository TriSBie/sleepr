import { AuthGuard } from "@nestjs/passport";

/**
 * Guards act as middleware in NestJS, allowing you to control access to your routes.
 */
export class LocalAuthGuard extends AuthGuard("local") {
  constructor() {
    super();
  }
}
