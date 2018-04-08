import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {
  private agentsURL = 'http://localhost:8081/agents/';

  constructor(private http: HttpClient) { }

  getUsername(): string {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.name;
  }

  /*getUser(): Promise<any>  {
    let username = this.getUsername();
    return new Promise((resolve, reject) => {
      this.http
        .get(this.usersURL)
        .toPromise()
        .then(result => {
          console.log(JSON.stringify(result));
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    });
  }*/
}
