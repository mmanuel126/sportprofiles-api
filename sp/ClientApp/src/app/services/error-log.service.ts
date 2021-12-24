
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NGXLogger, LoggerConfig } from 'ngx-logger';// **** for logger
import { CommonService } from '../services/common.service';
import { LogModel } from '../models/logmodel.model';

@Injectable()
export class ErrorLogService {
    private name: String = 'ErrorLogService';

    constructor(private logger: NGXLogger, private commonSvc: CommonService) { };

    async logError(error: any) {
        console.log(error.message); console.log(error.stack);
        await this.commonSvc.logError(error.message, error.stack.toString());

        if (error instanceof HttpErrorResponse) {
            this.logger.error(error.message);
            console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
            return "http";
        }
        else if (error instanceof TypeError) {
            // this.logger.error(error.message);
            // console.error('There was a Type error.', error.message);
            // return "type";
        }
        else if (error instanceof Error) {
            this.logger.error(error.message, error);
            console.error('There was a general error.', error.message);
            return "general";
        }
        else {
            this.logger.error(error.message, error);
            console.error('Nobody threw an error but something happened!', error);
            return "dontKnow";
        }
    }
}

