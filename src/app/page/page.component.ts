import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  page = {
    title: 'Home',
    subtitle: 'WelcomeHome!',
    content: 'Some Home Content.',
    image: 'assets/testImage01.jpg'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
