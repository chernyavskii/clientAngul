import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../models/User';

@Component({
  selector: 'app-destroy-form',
  templateUrl: './destroy-form.component.html',
  styleUrls: ['./destroy-form.component.css']
})
export class DestroyFormComponent implements OnInit {

  @Input()
  user = new User();

  constructor() { }

  ngOnInit() {
  }

}
