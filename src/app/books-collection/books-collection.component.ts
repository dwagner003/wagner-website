import { Component, OnInit } from '@angular/core';
import { BookService } from '../shared/services/book.service'

@Component({
  selector: 'app-books-collection',
  templateUrl: './books-collection.component.html',
  styleUrls: ['./books-collection.component.css']
})
export class BooksCollectionComponent implements OnInit {
  books;
  constructor(
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.books = this.bookService.returnBooks();
  }

}
