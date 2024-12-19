import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map(data => this.transformData(data)));
    }
    transformData(data: any) {
        if (typeof data == 'object') {
            let { message } = data;
            delete data?.message;
            var resp: GenericResponse = {
                message: message ?? '',
                success: true,
                data : data
            };
        }
        else {
            var resp: GenericResponse = {
                message: data,
                success: false,
            };
        }
        return resp;
    }
}