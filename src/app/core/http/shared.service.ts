import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sharedUrl = `${environment.api}/shared`;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** GET stats by type. Will 404 if id not found */
  getStats(taskId: string, stats: string): Observable<any> {
    const url = `${this.sharedUrl}/stats/?taskId=${taskId}&stats=${stats}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched stats id=${taskId}`)),
      catchError(this.handleError<any>(`getStats id=${taskId}`))
    );
  }

  /** POST: Assign Group to Task */
  assignGroup(group: any): Observable<any> {
    return this.http.put<any>(`${this.sharedUrl}/assign`, group, this.httpOptions).pipe(
      tap((newTask: any) => this.log(`added group to task w/ id=${newTask._id}`)),
      catchError(this.handleError<any>('addGroupToTask'))
    );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
