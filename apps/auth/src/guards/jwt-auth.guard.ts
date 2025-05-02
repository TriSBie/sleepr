import { AuthGuard } from "@nestjs/passport";

/**
 * Guards act as middleware in NestJS, allowing you to control access to your routes.
 */
export class JwtAuthGuards extends AuthGuard("jwt") {
  constructor() {
    super();
  }
}
