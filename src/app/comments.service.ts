import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Comment {

  movieId: number;
  userId: number;
  comment: string;
  
}export interface CommentWithUsername extends Comment {
  username?: string;  // Optional property for username
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private commentsUrl = 'http://bestapi.eba-gggbd6bt.eu-north-1.elasticbeanstalk.com/comments'; // Example backend URL

  constructor(private http: HttpClient) {}

  // Fetch comments for a specific movie
  getCommentsForMovie(movieId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}/movie/${movieId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching comments:', error);
          throw error;
        })
      );
  }

  // Add a new comment to a movie
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentsUrl, comment)
      .pipe(
        catchError(error => {
          console.error('Error adding comment:', error);
          throw error;
        })
      );
  }
}
