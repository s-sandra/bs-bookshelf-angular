import { Routes, RouterModule } from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LoginComponent } from './login/login.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  { path: 'search', component: SearchbarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'bookshelf', component: BookshelfComponent, canLoad: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(appRoutes);
