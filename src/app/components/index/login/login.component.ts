import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {username: '', password: ''};
  returnURL: string;

  hide = true;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }


  ngOnInit() {
    this.returnURL = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.userService.login(this.model)
      .then(data => {
        this.snackBar.open('Вход успешно выполнен', 'Закрыть', {
          duration: 3000
        });
        this.router.navigate(['dashboard']);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
