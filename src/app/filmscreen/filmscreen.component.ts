import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MovieService, Movie } from '../movie.service';
import { FavoriteMoviesService } from '../favorite-movies.service';
import { CommentsService, Comment } from '../comments.service';
import { UserServiceService,User } from '../user-service.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CommentWithUser {
  movieId: number;
  userId: number;
  comment: string;
  username?: string;
}

@Component({
  selector: 'app-filmscreen',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './filmscreen.component.html',
  styleUrl: './filmscreen.component.css'
})
export class FilmscreenComponent implements OnInit {
  commentsWithUserDetails: CommentWithUser[] = [];
  
  fullStars: number = 0;
  hasHalfStar: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];  // A fixed array to represent the 5-star rating system
  userIsLoggedIn: boolean= false;
  movie: Movie | undefined;
  user: any = {};
  comments: Comment[] = [];
  commentForm: FormGroup;

  

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private movieService: MovieService, private favoriteService: FavoriteMoviesService,private commentsService: CommentsService,private userService: UserServiceService) {
    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Capture the movie ID from the route parameters
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (movieId) {
      this.loadMovieDetails(movieId);
      this.loadComments(movieId);
      this.loadCurrentUser();
      
    }
    this.userIsLoggedIn = this.userService.isUserLoggedIn();
    
    
  }

  loadMovieDetails(movieId: number): void {
    this.movieService.getMoviebyId(movieId).subscribe({
      next:(movie) => {
        this.movie = movie;
        this.calculateStarRating(movie.vote_average);
       
      },
      error:(error:any) => {
        console.error('Failed to load movie details', error);
      }
  });
  }

  calculateStarRating(vote_average: number): void {
    const starRating = vote_average / 2;
    this.fullStars = Math.floor(starRating);
    this.hasHalfStar = (starRating - this.fullStars) >= 0.5;

  }

  private loadComments(movieId: number): void {
    if (this.user) {
      
  
      this.commentsService.getCommentsForMovie(movieId).subscribe({
        next: (comments: CommentWithUser[]) => {
          
  
          if (comments && comments.length > 0) {
            // Create an array of observables for fetching user details
            const userDetailsObservables = comments.map(comment => {
              const userId = comment.userId;  // Extract userId from each comment
              return this.userService.getUserById(userId).pipe(
                map((user: User) => {
                  return { ...comment, username: user.username };  // Attach the username to the comment
                })
              );
            });
  
            // Use forkJoin to wait for all user details to be fetched
            forkJoin(userDetailsObservables).subscribe({
              next: (commentsWithUserDetails) => {
                
                this.commentsWithUserDetails = commentsWithUserDetails;  // Store enriched comments
              },
              error: (error: any) => {
                console.error('Failed to load user details for comments', error);
              }
            });
          } else {
            console.log('No comments found for this movie.');
          }
        },
        error: (error: any) => {
          console.error('Failed to load comments', error);
        }
      });
    }
  }

  addComment(): void {
    if (this.movie && this.user) {
      const newComment: Comment = {
        movieId: this.movie.id,
        userId: this.user.id,
        comment: this.commentForm.value.text
      };

      this.commentsService.addComment(newComment).subscribe({
        next:(comment) => {
          this.comments.push(comment); // Add the new comment to the list
          this.commentForm.reset();    // Reset the form
          console.log('Comment added:', comment);
        },
        error: (error:any) => {
          console.error('Failed to add comment', error);
        }
    });
  }}

  loadCurrentUser(): void {
    const storedUser = this.userService.getLoggedInUser();
    if (storedUser) {
      this.user = storedUser;
      console.log('Current user loaded:', this.user);
      this.userIsLoggedIn = true;
    } else {
      console.log('No user is currently logged in.');
      this.userIsLoggedIn = false;
    }
  }

  addMovieToFavorites(): void {
    if (this.movie && this.user) {
      this.favoriteService.addFavoriteMovie(this.user.id,this.movie.id).subscribe({
        next:() => {
          console.log(`${this.movie?.title} has been added to your favorites!`);
          alert(`${this.movie?.title} has been added to your favorites!`);
        },
        error:(error:any) => {
          console.error('Failed to add movie to favorites', error);
          alert('Failed to add movie to favorites. Please try again.');
        }
    });
    }
  }
}
