import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants";
import { UserDto } from "../dto";
import { Reflector } from "@nestjs/core";
import { UserDocument } from "../models/users.schema";

@Injectable()
export class JWTAuthGuard implements CanActivate {
  private readonly logger = new Logger(JWTAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  /**
   * This method is called to determine if the request should be allowed through the guard.
   * @param context The execution context containing the request and response objects.
   * @returns A boolean indicating whether the request should be allowed or not.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Implement your JWT authentication logic here
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      return false; // No JWT found, deny access
    }

    // Extract the roles from the request
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    return this.authClient
      .send<UserDto>("authenticate", {
        Authentication: jwt,
      })
      .pipe(
        tap((response: UserDocument) => {
          // tap operator is used to perform side effects, such as logging or modifying the request object
          if (roles) {
            for (const role of roles) {
              if (!response || !(response.roles ?? []).includes(role)) {
                this.logger.error("Unauthorized: Insufficient permissions.");
                throw new UnauthorizedException(
                  "Unauthorized: Insufficient permissions.",
                ); // User does not have the required role
              }
            }
          }
          context.switchToHttp().getRequest().user = response; // Attach the user to the request object
        }),
        map(() => true), // Map the response to true to allow access
        // using a grateful operator to handle errors
        catchError(() => {
          this.logger.error("Unauthorized: Invalid JWT token.");
          return of(false); // If an error occurs, return false to deny access
        }), // If an error occurs, return a fallback value of false
      );
  }
}
