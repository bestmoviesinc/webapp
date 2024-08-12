import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MovieService, Movie } from '../movie.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-filmlist',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './filmlist.component.html',
  styleUrl: './filmlist.component.css'
})
export class FilmlistComponent implements OnInit {

  queryType: string = 'popular'; // Default to 'popular'
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to query parameters to react to changes
    this.route.queryParams.subscribe(params => {
      this.queryType = params['query'] || 'popular';
      console.log('Query Type:', this.queryType); // Fallback to 'popular' if no query is provided
      this.loadMovies();
    });
  }


  loadMovies(): void {
    if (this.queryType === 'popular') {
      this.movieService.getPopularMovies().subscribe({
        next:(movies) => {
          this.movies = movies;
          console.log('Popular movies:', this.movies);
        },
        error:(error:any) => {
          console.error('Failed to load popular movies', error);
        }}
    );
    } else if (this.queryType === 'upcoming') {
      this.movieService.getUpcomingMovies().subscribe({
        next:(movies) => {
          this.movies = movies;
          console.log('Upcoming movies:', this.movies);
        },
        error:(error:any) => {
          console.error('Failed to load upcoming movies', error);
        }
    });
    } else if (this.queryType.startsWith('search:')) {
      const searchQuery = this.queryType.split(':')[1];
      this.movieService.searchMovies(searchQuery).subscribe({
        next:(movies) => {
          this.movies = movies;
          console.log('Search results:', this.movies);
        },
        error:(error:any) => {
          console.error('Failed to search movies', error);
        }
       } );
    }
  }

  navigateToFilmScreen(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
  
}
