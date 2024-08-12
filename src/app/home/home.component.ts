import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MovieService, Movie } from '../movie.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  nowPlayingMovies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadNowPlayingMovies();
  }

  loadNowPlayingMovies(): void {
    this.movieService.getNowPlayingMovies().subscribe({
      next:(movies) => {
        this.nowPlayingMovies = movies;
        console.log('Now Playing Movies:', this.nowPlayingMovies);
      },
      error:(error: any) => {
        console.error('Failed to load now playing movies', error);
      }
  });
  }

  onCardClick(id: number): void {
    this.router.navigate(['/movie', id]);
  }
}
