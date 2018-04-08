import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../../../models/Document';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {

  @Input()
  document = new Document();

  constructor() {
    console.log('233232');
    console.log(this.document);
  }

  ngOnInit() {
  }

}
