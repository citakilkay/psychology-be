import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger: Logger = new Logger(AllExceptionsFilter.name);
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const headers = request.headers.authorization;
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorMessage = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

        const errorResponse: CustomHttpExceptionResponse = {
            statusCode: status,
            message: typeof errorMessage === 'string' ? errorMessage : (errorMessage as any).message,
            error: HttpStatus[status],
            path: request.url,
            method: request.method,
            timeStamp: new Date().toISOString(),
        };

        // Log the error
        this.logError(errorResponse, request, exception)
        response.status(status).json(errorResponse);
    }


    private logError = (errorResponse: CustomHttpExceptionResponse, request: any, exception: unknown): void => {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n ${JSON.stringify(errorResponse)}\n\n
        User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
        ${exception instanceof HttpException ? exception.stack : error}\n\n`;

        this.logger.error(errorLog, exception);
    }
}


interface CustomHttpExceptionResponse {
    statusCode: number
    error: string
    path: string
    method: string
    message: string
    timeStamp: string
}