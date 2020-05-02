import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//this will need to change when I deploy
const baseUrl = 'http://localhost:8080/api/books';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(private http: HttpClient){ }

  getRead(){
    return this.http.get(`${baseUrl}/Read`);
  }

  getNotRead(){
    return this.http.get(`${baseUrl}/NotRead`);
  }

  get(id) {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data){
    return this.http.post(baseUrl,data);
  }

  update(id, data){
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id){
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(){
    return this.http.delete(baseUrl);
  }

  findByTitle(title){
    return this.http.get(`${baseUrl}?title=${title}`);
  }
}