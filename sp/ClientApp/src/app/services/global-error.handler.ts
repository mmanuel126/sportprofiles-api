
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorLogService } from '../services/error-log.service'
import { RouterModule, Router } from '@angular/router';
import { NGXLogger, LoggerConfig } from 'ngx-logger';// **** for logger


@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    _globalFunctionService: any;
    constructor(private logger: NGXLogger, private errorLogService: ErrorLogService, private inj: Injector) {
        super();
        this._globalFunctionService = inj.get(ErrorLogService);
    }

    handleError(error) {
        // let errorType = this._globalFunctionService.logError(error);
        // this.logger.error(error.message, error.stack);
        // const router = this.inj.get(Router);
        // router.navigate(['/errors'], { queryParams: { errType: errorType } });
    }
}



