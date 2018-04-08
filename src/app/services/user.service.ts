import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';
import {Router} from '@angular/router';
import {Cookie} from 'ng2-cookies';
import {AuthService} from './auth/auth.service';
import {AppComponent} from '../app.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

@Injectable()
export class UserService {
  private loginURL = 'http://localhost:8081/login';
  private usersURL = 'http://localhost:8081/users/';
  private resourceURL = 'http://localhost:8081/';
  private agentsURL = 'http://localhost:8081/agents/';


  checkAuth = false;

  isLoggedIn = false;
  redirectUrl: string;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  /*findById(id): Promise<any> {
    id = this.authService.getUserId();
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.usersURL}/${id}`)
        .toPromise()
        .then(result => {
          console.log(result);
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }*/
  login(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(user.username + ':' + user.password),
        'X-Requested-With': 'XMLHttpRequest'
 /*       'Access-Control-Allow-Origin': '*',
        /!*   'Access-Control-Allow-Credentials': 'true',*!/
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,' +
        ' Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,' +
        ' Access-Control-Request-Headers'*/
      });
      this.http
        .get(AppComponent.API_URL + '/login', {headers: headers}) //// withCredentials: true
        .toPromise()
        .then(result => {
          Cookie.set('token', 'Basic ' + btoa(user.username + ':' + user.password));
          localStorage.setItem('currentUser', JSON.stringify(result));
          resolve(result);
        })
        .catch(error => {
          console.log(JSON.stringify(error));
        });
    });
  }


  updateById(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
      this.http
        .put(`${this.usersURL}${user.id}`, user, {headers: headers})
        .toPromise()
        .then(result => {
          localStorage.clear();
          localStorage.setItem('currentUser', JSON.stringify(result));
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }


  registration(user: User): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,' +
      ' Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,' +
      ' Access-Control-Request-Headers'
    });

    return new Promise((resolve, reject) => {
      this.http
        .post(AppComponent.API_URL + '/registration', user, {headers: headers})
        .toPromise()
        .then(result => {
          localStorage.setItem('currentUser', JSON.stringify(result));
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }

  testFindAll(): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,' +
      ' Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,' +
      ' Access-Control-Request-Headers',
      /*
            'Authorization': 'Basic dmFnYWJ1bmQxOnZhZ2FidW5kMQ=='
      */
    });
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
  }

  changePassword(passwordCredentials: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
      this.http
        .put(`${this.usersURL}` + '/password', passwordCredentials, {headers: headers})
        .toPromise()
        .then(result => {
          localStorage.clear();
          localStorage.setItem('currentUser', JSON.stringify(result));
          Cookie.delete('token');
          const userObject: User = <User>result;
          Cookie.set('token', 'Basic ' + btoa(userObject.username + ':' + passwordCredentials.newPassword));
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }

}
