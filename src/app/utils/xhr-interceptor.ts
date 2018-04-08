import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user.service';
import {User} from '../models/User';
import {Injectable} from '@angular/core';
import {HttpResponse} from 'selenium-webdriver/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log(req.url);
   /* if (req.url === 'http://localhost:4200/login') {
      console.log('qqq');
    } else {*/
      const xhr = req.clone({
        headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
          .set('Access-Control-Allow-Origin', '*')
          // .set('Access-Control-Allow-Credentials', 'true')
          .set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
          .set('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,' +
            ' Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,' +
            ' Access-Control-Request-Headers')
/*
          .set('Authorization', 'Basic dmFnYWJ1bmQxOnZhZ2FidW5kMQ==')
*/
        /*
          .set('Authorization', this.authService.getTestToken())
*/
        /*
                .set('Authorization', '')
        */
        /*
                .set('Authorization', JSON.stringify(this.cookieService.get('testToken')))
        */

        /*
                .set('Authorization', 'Basic ' + btoa(this.authService.getUsernameTest() + ':' + this.authService.getPasswordTest()))
        */


      });

      return next.handle(xhr);

  }
 /* intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.authService.collectFailedRequest(request);
        }
      }
    });
  }*/
}
