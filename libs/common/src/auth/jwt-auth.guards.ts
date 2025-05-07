import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants";
import { UserDto } from "../dto";

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
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
    return this.authClient
      .send<UserDto>("authenticate", {
        Authentication: jwt,
      })
      .pipe(
        tap((response) => {
          // tap operator is used to perform side effects, such as logging or modifying the request object
          context.switchToHttp().getRequest().user = response; // Attach the user to the request object
        }),
        map(() => true), // Map the response to true to allow access
        // using a grateful operator to handle errors
        /**
         * or using catchError((err) => { throw new UnauthorizedException(err)} )
         */
        catchError(() => of(false)), // If an error occurs, return a fallback value of false
      );
  }
}
