import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FavoriteMoviesService } from '../favorite-movies.service';
import { MovieService } from '../movie.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
    ],
})
export class UserpageComponent {
  isSignInMode = true;  // Toggle between Sign In and Sign Up
  isSignUpMode = false; // Controls if we're in Sign Up mode
  isUserDetailsMode = false; // Controls if we're in User Details mode
  signinForm: FormGroup;
  signupForm: FormGroup;
  signinError: boolean = false;
  signupError: boolean = false;
  user: any = null;
  favoriteMovies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private favService: FavoriteMoviesService,
    private movieService: MovieService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: [''],
      fullName: ['']
    });

    this.user = this.userService.getLoggedInUser();
    if (this.user) {
      this.isSignInMode = false;
      this.isSignUpMode = false;
      this.isUserDetailsMode = true;
    }
  }
  ngOnInit(): void {
    if(this.user) {
      this.loadFavoriteMovies();
    }
  }
  // Toggle between Sign In and Sign Up forms
  toggleAuthMode(): void {
    this.isSignInMode = !this.isSignInMode;
    this.isSignUpMode = !this.isSignUpMode;
    this.signinError = false;
    this.signupError = false;

  }
// Handle Sign In form submission
onSignInSubmit(): void {
  const credentials = this.signinForm.value;

  this.userService.signin(credentials).subscribe({
    next: (user) => {
      if (user && user.id) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.user = user;
        this.isSignInMode = false;
        this.isUserDetailsMode = true;
        this.loadFavoriteMovies();
      } else {
        this.signinError = true;
      }
    },
    error: (error: any) => {
      console.error('Sign-in error:', error);
      this.signinError = true;
    }
  });
}

// Handle Sign Up form submission
onSignUpSubmit(): void {
  const newUser = this.signupForm.value;

  this.userService.signup(newUser).subscribe({
    next: (response) => {
      if (response && response.id) {
        this.isSignInMode = true;  // Switch to sign-in mode after successful registration
        this.isSignUpMode = false;
      } else {
        this.signupError = true;
      }
    },
    error: (error: any) => {
      console.error('Sign-up error:', error);
      this.signupError = true;
    }
  });
}

// Handle Logout
logout(): void {
  localStorage.removeItem('loggedInUser');
  this.user = null;
  this.favoriteMovies = [];
  this.isSignInMode = true;
  this.isUserDetailsMode = false;
}

private loadFavoriteMovies(): void {
  if (this.user) {
    console.log('Fetching favorite movies for user:', this.user.id);

    this.favService.getFavoriteMovies(this.user.id).subscribe({
      next: (favorites) => {  // 'favorites' is the array of objects with 'movieId'
        console.log('Favorite movies data:', favorites);

        if (favorites && favorites.length > 0) {
          // Extract movieId from each object
          const movieDetailsObservables = favorites.map(favorite => {
            console.log('Processing favorite:', favorite);
            const movieId = favorite.movieId;  // Extract the movieId
            return this.movieService.getMoviebyId(movieId);
          });

          // Fetch all movie details
          forkJoin(movieDetailsObservables).subscribe({
            next: (movies) => {
              console.log('Fetched movie details:', movies);
              this.favoriteMovies = movies;
            },
            error: (error: any) => {
              console.error('Failed to load movie details', error);
            }
          });
        } else {
          console.log('No favorite movies found for this user.');
        }
      },
      error: (error: any) => {
        console.error('Failed to load favorite movies', error);
      }
    });
  }
}

onCardClick(id: number): void {
  this.router.navigate(['/movie', id]);
}

}