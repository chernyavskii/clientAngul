import {Component} from '@angular/core';
import 'rxjs/add/operator/filter';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  static API_URL = 'http://localhost:8081';
}
