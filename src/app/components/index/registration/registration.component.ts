import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {User} from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  isLinear = true;
  step = 0;
  position = 'before';
  user: User = new User();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  hide = true;
  ////
  @Output() newUserEvent = new EventEmitter();
  ////
  constructor(private userService: UserService,
              private router: Router,
              private _formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      username: this.user.username,
      password: this.user.password
    });

    this.secondFormGroup = this._formBuilder.group({
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName
    });

    this.thirdFormGroup = this._formBuilder.group({
      unp: this.user.unp,
      organization: this.user.organization,
      position: this.user.position,
      address: this.user.address,
      rs: this.user.rs,
      ks: this.user.ks,
      bank: this.user.bank,
      bik: this.user.bik,
      phone: this.user.phone,
    });
  }

  registration() {
    const saveUser: User = {
      id: null,
      username: this.firstFormGroup.value.username,
      password: this.firstFormGroup.value.password,
      firstName: this.secondFormGroup.value.firstName,
      middleName: this.secondFormGroup.value.middleName,
      lastName: this.secondFormGroup.value.lastName,
      unp: this.thirdFormGroup.value.unp,
      organization: this.thirdFormGroup.value.organization,
      position: this.thirdFormGroup.value.position,
      address: this.thirdFormGroup.value.address,
      rs: this.thirdFormGroup.value.rs,
      ks: this.thirdFormGroup.value.ks,
      bank: this.thirdFormGroup.value.bank,
      bik: this.thirdFormGroup.value.bik,
      phone: this.thirdFormGroup.value.phone,
    };
    this.userService.registration(saveUser)
      .then(res => {
        if (res) {
          this.snackBar.open('Регистрация прошла успешно', 'Закрыть', {
            duration: 3000
          });
          this.newUserEvent.emit(this.user);
          this.router.navigate(['dashboard']);
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
