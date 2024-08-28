import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMoviesService {

  private apiUrl = 'http://bestapi.eba-gggbd6bt.eu-north-1.elasticbeanstalk.com/users';

  constructor(private http: HttpClient) { }

  getFavoriteMovies(userId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${userId}/favorites`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError<any[]>('getFavoriteMovies', []))
      );
  }

  // Add a favorite movie for a user
  addFavoriteMovie(userId: number, movieId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}/favorites/${movieId}`;
    return this.http.post<any>(url, {})
      .pipe(
        catchError(this.handleError<any>('addFavoriteMovie'))
      );
  }

  deleteFavoriteMovie(userId: number, movieId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}/favorites/${movieId}`;
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError<any>('deleteFavoriteMovie'))
      );
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      return of(result as T);
    };
  }
}
