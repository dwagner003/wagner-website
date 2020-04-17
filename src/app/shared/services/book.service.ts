import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BookService {
   books = [
    {"title": "Web Dev Trials", "author": "Devin Wagner", "price": 25.66, "type": "Technical"},
  ];

  returnBooks(){
    return this.books;
  }
}