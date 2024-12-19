import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
 
@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode =
            exception.constraint && exception.constraint.startsWith('UQ')
                ? HttpStatus.CONFLICT
                : exception.status?exception.status:HttpStatus.INTERNAL_SERVER_ERROR;
        // log exception
        const resp:GenericResponse={
            success : false,
            message : exception?.message
        }
        if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR){
            resp.exception = exception?.stack;
        }
        response.status(statusCode).json(resp);
    }
}