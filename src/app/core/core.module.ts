import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { LoaderInterceptor } from './intercptors/loader.iterceptor';
import { AuthInterceptor } from './intercptors/auth.iterceptor';
import { ErrorHandlerInterceptor } from './intercptors/error-handler.intreceptor';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
       {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
       /*  {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
        }*/
    ]
})
export class CoreModule { }
