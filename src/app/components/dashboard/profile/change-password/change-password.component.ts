import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../models/User';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input()
  user = new User();
  changePasswordGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  ngOnInit() {
    this.changePasswordGroup = this.fb.group({
      current_password: ['', Validators.required],
      passwords: this.fb.group({
        newPassword: ['', Validators.required],
        repeat_new_password: ['', Validators.required]
      }, {validator: this.areEqual})
    });

  }

  areEqual(control: FormControl): ValidationErrors | null {
    const keys: string[] = Object.keys(control.value);
    for (const i in keys) {
      if (i !== '0' && control.value[keys[+i - 1]] !== control.value[keys[i]]) {
        return {areEqual: true};
      }
    }
  }

  updatePassword() {
    const passObject = {
      newPassword: this.changePasswordGroup.value.passwords.newPassword,
      oldPassword: this.changePasswordGroup.value.current_password
    };
    this.userService.changePassword(passObject)
      .then(data => {
        if (data) {
          this.snackBar.open('Пароль успешно изменён', 'Закрыть', {
            duration: 3000
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

