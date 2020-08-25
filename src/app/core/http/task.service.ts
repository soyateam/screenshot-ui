import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksUrl = 'http://localhost:3001/task';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET tasks by type from the server */
  getTasks(type): Observable<any> {
    return this.http.get(`${this.tasksUrl}/type/${type ? 'BuildForce' : 'OperativeForce'}`, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched tasks')),
        catchError(this.handleError<any>('getTasks', []))
      );
  }

  /** GET tasks by parent id. Return `undefined` when id not found */
  getTasksByParentId(id: string): Observable<any> {
    const url = `${this.tasksUrl}/parent/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(tasks => tasks),
        tap(t => {
          const outcome = t ? `fetched` : `did not find`;
          this.log(`${outcome} tasks id=${id}`);
        }),
        catchError(this.handleError<any>(`getTasksByParentId id=${id}`))
      );
  }

  /** GET task by id. Will 404 if id not found */
  getTask(id: string): Observable<any> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched task id=${id}`)),
      catchError(this.handleError<any>(`getTask id=${id}`))
    );
  }

  /** POST: add a new task to the server */
  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.tasksUrl, task, this.httpOptions).pipe(
      tap((newTask: any) => this.log(`added task w/ id=${newTask.id}`)),
      catchError(this.handleError<any>('addTask'))
    );
  }

  /** DELETE: delete the task from the server */
  deleteTask(task: any | number): Observable<any> {
    const id = typeof task === 'number' ? task : task._id;
    const url = `${this.tasksUrl}/${id}`;

    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted task id=${id}`)),
      catchError(this.handleError<any>('deleteTask'))
    );
  }

  // /** PUT: update the task on the server */
  // updateTask(task: any): Observable<any> {
  //   return this.http.put(this.tasksUrl, task, this.httpOptions).pipe(
  //     tap(_ => this.log(`updated task id=${task.id}`)),
  //     catchError(this.handleError<any>('updateTask'))
  //   );
  // }

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
