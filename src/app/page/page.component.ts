import { Component, OnInit} from '@angular/core';
import { ContentService } from '../shared/services/content.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  page;
  
  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(){
    const pageUrl = this.route.snapshot.data['page'];
    let pageData =  this.contentService.pages[pageUrl];
    this.page = pageData;
  }
}
