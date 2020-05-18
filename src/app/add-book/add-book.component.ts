import { Component, OnInit } from '@angular/core';
import { BookService } from '../shared/services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  book = {
    title: '',
    author: '',
    description: '',
    read: false
  };

  submitted = false;

  constructor(private tutorialService: BookService) { }

  ngOnInit(): void {
  }

  saveBook(){
    const data = {
      title: this.book.title,
      author: this.book.author,
      description: this.book.description,
      read: this.book.read
    };

    this.tutorialService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        }
      );
  }

  newBook(){
    this.submitted = false;
    this.book = {
      title: '',
      author: '',
      description: '',
      read: false
    };
  }

}
