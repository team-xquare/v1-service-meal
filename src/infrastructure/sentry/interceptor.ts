import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import * as Sentry from "@sentry/node";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                Sentry.captureException(error);
                return null;
            })
        );
    }
}
