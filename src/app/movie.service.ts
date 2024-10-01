import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiKey = 'd39a76d9ad8721e2d69f2d0742213cc5'; // Replace with your TMDb API key
  private apiUrl = 'https://api.themoviedb.org/3/movie/';
  private searchUrl = 'https://api.themoviedb.org/3/search/movie';

  constructor(private http: HttpClient) {}

  getNowPlayingMovies(): Observable<Movie[]> {
    return this.http.get<{ results: Movie[] }>(`${this.apiUrl}now_playing?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching now playing movies:', error);
          throw error;
        })
      );
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<{ results: Movie[] }>(`${this.apiUrl}popular?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching now playing movies:', error);
          throw error;
        })
      );
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.http.get<{ results: Movie[] }>(`${this.apiUrl}upcoming?api_key=${this.apiKey}&language=en-US&page=1`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching now playing movies:', error);
          throw error;
        })
      );
  }

  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<{ results: Movie[] }>(`${this.searchUrl}?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error searching movies:', error);
          throw error;
        })
      );
  }

  getMoviebyId(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}${id}?api_key=${this.apiKey}&language=en-US`)
      .pipe(
        catchError(error => {
          console.error('Error fetching movie details:', error);
          throw error;
        })
      );
  }
}