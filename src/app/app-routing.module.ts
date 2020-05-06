import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { BooksCollectionComponent } from './books-collection/books-collection.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { AddBookComponent } from './add-book/add-book.component';
import { CallbackComponent } from './callback/callback.component';
import { AuthGuard } from './shared/services/auth.guard';

const appRoutes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent },
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'books', component: BooksCollectionComponent},
  // Will need to come back and make this the same level as the other Api's
  {path: 'books/addBook', component: AddBookComponent,
  canActivate: [
    AuthGuard
  ]
  },
  {path: 'books/:id', component: BookDetailsComponent,
  canActivate: [
    AuthGuard
  ]
  },
  { path: 'callback',
  component: CallbackComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
