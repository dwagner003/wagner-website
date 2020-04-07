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
  pageUrl;
  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
  )
  {}

  ngOnInit(){
    this.pageUrl = this.route.snapshot.data['page'];
    if(this.pageUrl != undefined)
    {
    let pageData =  this.contentService.pages[this.pageUrl];
    this.page = pageData;
    }
    else
    {
      this.page = this.contentService.pages['home'];
    }
  }
}
