import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HierarchyService {

  private groupsUrl = 'http://localhost:3001/group';

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
        tap(t => {
          const outcome = t ? `fetched` : `did not find`;
          this.log(`${outcome} groups id=${id}`);
        }),
        catchError(this.handleError<any>(`getGroupsByParentId id=${id}`))
      );
  }

  /** GET group by id. Will 404 if id not found */
  getGroup(id: string): Observable<any> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched group id=${id}`)),
      catchError(this.handleError<any>(`getGroup id=${id}`))
    );
  }

  /** POST: Assign Group to Task */
  assignGroup(group: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3001/shared/assign`, group, this.httpOptions).pipe(
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
