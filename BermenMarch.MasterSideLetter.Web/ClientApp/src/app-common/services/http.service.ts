import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { tap, catchError, map, timeout, flatMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };

    params?: HttpParams | {
        [param: string]: string | string[];
    };
}

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    subject: Subject<any> = new Subject();
    constructor(public http: HttpClient, private messageService: MessageService) { }

    get<T = any>(url: string, options?: HttpOptions): Observable<T> {
        return this.http.get<T>(url, options)
            .pipe(catchError(err => this.handleError(err)));
    }

    put<T = any, R = any>(url: string, input: T, useCache: boolean = false, options?: HttpOptions): Observable<R> {
        return this.http.put<R>(url, input, options)
            .pipe(catchError(err => this.handleError(err)));
    }

    patch<T = any, R = T>(url: string, input: T, options?: HttpOptions): Observable<R> {
        return this.http.patch<R>(url, input, options)
            .pipe(catchError(err => this.handleError(err)));
    }

    post<T = any, R = any>(url: string, input: T, options?: HttpOptions): Observable<R> {
        return this.http.post<R>(url, input, options)
            .pipe(catchError(err => this.handleError(err)));
    }

    del<T = any>(url: string, options?: HttpOptions): Observable<T> {
        return this.http.delete<T>(url, options)
            .pipe(catchError(err => this.handleError(err)));
    }

    private handleError(error: HttpErrorResponse) {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,

            if (error && error.status == 400) {
                errorMsg = 'Bad request, Please correct input data and try again.'
            } else if (error.status == 500) {
                errorMsg = 'Unable to process request at this time due to internal error, Please try again later.'
            } else {
                errorMsg = 'Unknown error occured, Please try again.'
            }

            setTimeout(() => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMsg
                });
            }, 500);
        }

        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }
}
