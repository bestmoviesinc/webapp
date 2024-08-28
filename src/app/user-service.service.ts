import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {

  username: string;
  userId: number;
  firstName: string;
  lastName: string;
  age: number;
  profession: string;

  
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://bestapi.eba-gggbd6bt.eu-north-1.elasticbeanstalk.com/users'; // Base URL for the Spring Boot API

  constructor(private http: HttpClient) { }

  // Sign up a new user
  signup(user: any): Observable<any> {
    const url = `${this.apiUrl}/signup`;
    return this.http.post<any>(url, user)
      .pipe(
        catchError(this.handleError<any>('signup'))
      );
  }

  // Sign in an existing user
  signin(credentials: {username: string, password: string}): Observable<any> {
    const url = `${this.apiUrl}/signin`;
    return this.http.post<any>(url, credentials)
      .pipe(
        catchError(this.handleError<any>('signin'))
      );
  }

  // Get currently logged-in user from local storage
  getLoggedInUser(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('loggedInUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;

  }

  isUserLoggedIn(): boolean {
    
    return this.getLoggedInUser() !== null;
  }

  // Get user by ID (for viewing profiles)
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Get user error:', error);
          throw error;
        })
      );
  }


  // Update user details
  updateUser(userId: number, user: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<any>(url, user)
      .pipe(
        catchError(this.handleError<any>('updateUser'))
      );
  }

  // Delete a user by ID
  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError<any>('deleteUser'))
      );
  }

  // Handle any errors that occur during HTTP requests
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      return of(result as T);
    };
  }
}