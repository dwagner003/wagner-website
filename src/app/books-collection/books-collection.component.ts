import { Component, OnInit } from '@angular/core';
import { BookService } from '../shared/services/book.service'
import { error } from 'protractor';

@Component({
  selector: 'app-books-collection',
  templateUrl: './books-collection.component.html',
  styleUrls: ['./books-collection.component.css']
})
export class BooksCollectionComponent implements OnInit {

  books: any;
  readBooks: any;
  notReadBooks: any;
  currentBook = null;
  currentIndex = -1;
  title = '';
  
  constructor( private bookService: BookService) { }

  ngOnInit() {
    this.retrieveBooks();
  }

  refreshList(){
    this.retrieveBooks();
    this.currentBook = null;
    this.currentIndex = -1;
  }

  retrieveBooks(){
    this.getNotReadBooks();
    this.getReadBooks();
  }

  setActiveBook(book, index){
    this.currentBook = book;
    this.currentIndex = index;
  }

  removeAllBooks(){
    this.bookService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.retrieveBooks();
        }
      );
  }

  searchTitle(){
    this.bookService.findByTitle(this.title)
      .subscribe(
        data => {
          this.books = data;
          console.log(data);
        }
      ),
      error => {
        console.log(error);
      };
  }

  getReadBooks(){
    this.bookService.getRead()
    .subscribe(
      data => {
        this.readBooks = data;
        console.log(data);
      }
    ),
    error => {
      console.log(error);
    };
  }

  getNotReadBooks(){
    this.bookService.getNotRead()
    .subscribe(
      data => {
        this.notReadBooks = data;
        console.log(data);
      }
    ),
    error => {
      console.log(error);
    };
  }
}
