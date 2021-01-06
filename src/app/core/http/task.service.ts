import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksUrl = `${environment.api}/task`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET tasks by type from the server */
  getTasks(type): Observable<any> {
    return this.http.get(`${this.tasksUrl}/type/${type ? 'BuildForce' : 'OperativeForce'}`, this.httpOptions)
      .pipe(
        tap(_ => this),
        catchError(this.handleError<any>('getTasks', []))
      );
  }

  /** GET tasks by parent id. Return `undefined` when id not found */
  getTasksByParentId(id: string): Observable<any> {
    const url = `${this.tasksUrl}/parent/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(tasks => tasks),
        tap(t => this),
        catchError(this.handleError<any>(`getTasksByParentId id=${id}`))
      );
  }

  /** GET task by id. Will 404 if id not found */
  getTask(id: string): Observable<any> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this),
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

  updateTask(task): Observable<any> {
    // console.log(task);
    return this.http.put<any>(this.tasksUrl, { task }, this.httpOptions).pipe(
      tap((updatedTask: any) => this.log(`Updated task w/ id=${updatedTask.id}`)),
      catchError(this.handleError<any>('updateTask'))
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
