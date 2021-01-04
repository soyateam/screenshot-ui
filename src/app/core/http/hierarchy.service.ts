import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HierarchyService {

  private groupsUrl = `${environment.api}/group`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET group by parent id. Return `undefined` when id not found */
  getGroupsByParentId(id: any): Observable<any> {
    const url = `${this.groupsUrl}/parent/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(groups => groups),
        tap(t => this),
        catchError(this.handleError<any>(`getGroupsByParentId id=${id}`))
      );
  }

  /** GET group by id. Will 404 if id not found */
  getGroup(id: string): Observable<any> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this),
      catchError(this.handleError<any>(`getGroup id=${id}`))
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
    // console.log(message);
  }
}
