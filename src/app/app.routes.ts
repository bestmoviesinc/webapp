import { Routes } from '@angular/router';
import { UserpageComponent } from './userpage/userpage.component';
import { HomeComponent } from './home/home.component';
import { FilmlistComponent } from './filmlist/filmlist.component';
import { FilmscreenComponent } from './filmscreen/filmscreen.component';

export const routes: Routes = [
    {path: 'user', component: UserpageComponent},
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'movielist', component: FilmlistComponent},
    {path: 'movie/:id', component: FilmscreenComponent}
];
