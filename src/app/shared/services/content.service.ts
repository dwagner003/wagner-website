import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ContentService {
  pages: Object = {
    'home': {title: 'Home', subtitle: 'Welcome Home!', content: 'Some home content.', image: 'assets/ProfilePic.jpg'},
    'about': {title: 'About', subtitle: 'About Us', content: 'Some content about us.', image: 'assets/testImage03.jpeg'},
    'contact': {title: 'Contact', subtitle: 'Contact Us', content: 'How to contact us.', image: 'assets/testImage04.jpeg'}
  };
}
