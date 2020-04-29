import { Component, OnInit } from '@angular/core';
import { BookService } from '../shared/services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  currentBook = null;
  message = '';

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.message = '';
    this.getBook(this.route.snapshot.paramMap.get('id'));
  }

  getBook(id) {
    this.bookService.get(id)
      .subscribe(
        data => {
          this.currentBook = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateRead(status) {
    const data = {
      title: this.currentBook.title,
      description: this.currentBook.description,
      read: status
    };

    this.bookService.update(this.currentBook.id, data)
      .subscribe(
        response => {
          this.currentBook.read = status;
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  updateBook() {
    this.bookService.update(this.currentBook.id, this.currentBook)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The book was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteBook() {
    this.bookService.delete(this.currentBook.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/books']);
        },
        error => {
          console.log(error);
        });
  }

}
