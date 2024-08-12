import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatToolbarModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  search(query: string) {
    this.router.navigate(['/movielist'], { queryParams: { query } });
  }
}
