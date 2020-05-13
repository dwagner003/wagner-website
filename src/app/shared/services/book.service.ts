import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService} from '../services/auth.service';
import { environment } from './../../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(private http: HttpClient, private authService: AuthService){ }

  getRead(){
    return this.http.get(`${baseUrl}/Read`);
  }

  getNotRead(){
    return this.http.get(`${baseUrl}/NotRead`);
  }

  get(id) {
    return this.http.get(`${baseUrl}/${id}`,{
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
    });
  }

  create(data){
    return this.http.post(baseUrl,data,{
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
    });
  }

  update(id, data){
    return this.http.put(`${baseUrl}/${id}`, data,{
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
    });
  }

  delete(id){
    return this.http.delete(`${baseUrl}/${id}`,{
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
    });
  }

  deleteAll(){
    return this.http.delete(baseUrl,{
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.accessToken}`)
    });
  }

  findByTitle(title){
    return this.http.get(`${baseUrl}?title=${title}`);
  }
}