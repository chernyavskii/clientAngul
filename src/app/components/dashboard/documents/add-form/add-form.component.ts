import {AfterViewInit, Component, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AgentService} from '../../../../services/agent/agent.service';
import {User} from '../../../../models/User';
import {typeOfDocument} from '../../../../data/data';
import {units} from '../../../../data/data';
import {Agent} from '../../../../models/Agent';
import {AddFormUtils} from './add-form-utils';
import {Product} from '../../../../models/Product';
import {DocumentService} from '../../../../services/document/document.service';
import {DriverService} from '../../../../services/driver/driver.service';
import {Driver} from '../../../../models/Driver';
import {MatButton, MatSnackBar, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent {

  @Input()
  user = new User();

  typeOfDocument = typeOfDocument;
  units = units;
  allAgents: Agent[] = [];
  allDrivers: Driver[] = [];

  index_: number;
  document_id: number;
  elementOfType: any;

  firstStepGroup: FormGroup;
  secondStepGroup: FormGroup;
  thirdStepGroup: FormGroup;

  createdDocument = {id: null, name: '', type: '', date: ''};
  pageurl: Uint8Array;

  onLoad = false;
  visibleDocument = false;
  disableButton = false;
  newAgentProp = false;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private agentService: AgentService,
              private documentService: DocumentService,
              private driverService: DriverService) {
    this.disableButton = false;

    this.driverService.getAllDrivers()
      .then(data => {
        for (const driver of data) {
          this.allDrivers.push(driver);
        }
      });

    this.agentService.getAllAgents()
      .then(data => {
        for (const agent of data) {
          this.allAgents.push(agent);
        }
      })
      .catch(err => {
        console.log(err);
      });


    this.firstStepGroup = this.fb.group({
      documentName: ['', Validators.required],
      typeOfDocument: ['', Validators.required],
      elementOfType: ['', Validators.required]
    });

    this.secondStepGroup = this.fb.group({
      driverId: '',
      agentId: ['', Validators.required],
      products: this.fb.array([(
        this.fb.group({
            name: '',
            measure: '',
            number: '',
            price: '',
            packageNumber: '',
            weight: '',
            note: ''
          }
        ))]
      ),
      works: this.fb.array([(
        this.fb.group({
          name: '',
          price: ''
        })
      )])
    });

    this.thirdStepGroup = this.fb.group({
      successButton: ['', Validators.required]
    });

  }


  get products(): FormArray {
    return this.secondStepGroup.get('products') as FormArray;
  }

  get agentId(): FormControl {
    return this.secondStepGroup.get('agentId') as FormControl;
  }

  get works(): FormArray {
    return this.secondStepGroup.get('works') as FormArray;
  }

  get driverId(): FormControl {
    return this.secondStepGroup.get('driverId') as FormControl;
  }

  get successButton(): FormControl {
    return this.secondStepGroup.get('successButton') as FormControl;
  }

  removeItemById(i: number, array: FormArray) {
    array.removeAt(i);
  }

  searchTypeById() {
    this.newAgentProp = false;
    this.firstStepGroup.get('elementOfType').setValue('');
    const nameControl = this.firstStepGroup.get('typeOfDocument');
    this.index_ = nameControl.value;
    const elementOfArray = this.typeOfDocument.find(i => i.id == nameControl.value);
    this.elementOfType = elementOfArray;
  }

  searchElementOfTypeById() {
    this.newAgentProp = false;
    this.agentId.setValue('');
    this.visibleDocument = false;
    this.pageurl = null;
    this.thirdStepGroup.controls.successButton.setValidators(Validators.required);

    AddFormUtils.resetDriverInformation(this.driverId);

    AddFormUtils.clearAllItems(this.products);
    AddFormUtils.clearAllItems(this.works);

    AddFormUtils.resetValidation(this.products, this.works);
    AddFormUtils.resetValues(this.products, this.works);

    for (let i = 0; i < this.products.length; i++) {
      this.products.controls[i].get('packageNumber').setValue('');
      this.products.controls[i].get('weight').setValue('');
    }

    const nameControl = this.firstStepGroup.get('elementOfType');
    this.document_id = nameControl.value.id;
    switch (this.document_id) {
      case 1:
        AddFormUtils.resetValuesOfProducts(this.products);
        AddFormUtils.addValidationOfProducts(this.products);

        this.driverId.setValidators(Validators.required);
        this.driverId.setValue('');

        for (let i = 0; i < this.products.length; i++) {
          this.products.controls[i].get('packageNumber').setValue('');
          this.products.controls[i].get('weight').setValue('');

          this.products.controls[i].get('packageNumber').setValidators(Validators.required);
          this.products.controls[i].get('weight').setValidators(Validators.required);
        }
        break;
      case 2:
        AddFormUtils.resetDriverInformation(this.driverId);

        AddFormUtils.resetValuesOfProducts(this.products);
        AddFormUtils.addValidationOfProducts(this.products);
        break;
      case 3:
        AddFormUtils.resetDriverInformation(this.driverId);

        AddFormUtils.resetValuesOfWorks(this.works);
        AddFormUtils.addValidationOfWorks(this.works);
        break;
      case 4:
        AddFormUtils.resetDriverInformation(this.driverId);

        AddFormUtils.resetValuesOfProducts(this.products);
        AddFormUtils.addValidationOfProducts(this.products);
        break;
      default:
        alert('Problems');
    }
  }

  addProduct() {
    switch (this.document_id) {
      case 1:
        this.products.push(this.fb.group({
            name: ['', Validators.required],
            measure: ['', Validators.required],
            number: ['', Validators.required],
            price: ['', Validators.required],
            packageNumber: ['', Validators.required],
            weight: ['', Validators.required],
            note: ['', Validators.required]
          }
        ));
        break;
      case 2:
        this.products.push(this.fb.group({
            name: ['', Validators.required],
            measure: ['', Validators.required],
            number: ['', Validators.required],
            price: ['', Validators.required],
            packageNumber: ['', Validators.nullValidator],
            weight: ['', Validators.nullValidator],
            note: ['', Validators.required]
          }
        ));
        break;
      case 4:
        this.products.push(this.fb.group({
            name: ['', Validators.required],
            measure: ['', Validators.required],
            number: ['', Validators.required],
            price: ['', Validators.required],
            packageNumber: ['', Validators.nullValidator],
            weight: ['', Validators.nullValidator],
            note: ['', Validators.required]
          }
        ));
        break;
      default:
        alert('Problems');
    }
  }

  addWork() {
    this.works.push(this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    }));
  }

  addNewDocument() {
    this.newAgentProp = false;
    this.disableButton = true;
    this.thirdStepGroup.controls.successButton.setValidators(Validators.required);
    this.thirdStepGroup.get('successButton').setValue('setValue');

    switch (this.document_id) {
      case 1:
        this.documentService.addDocumentTTN(this.firstStepGroup.value.documentName, this.agentId.value, this.driverId.value, this.products.value)
          .then(data => {
            if (data) {
              this.createdDocument = data;
              this.showDocumentInPdf();
            }
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 2:
        const saveArrayOfProducts: Product[] = [];
        for (let i = 0; i < this.secondStepGroup.value.products.length; i++) {
          const product = new Product();
          product.name = this.secondStepGroup.value.products[i].name;
          product.measure = this.secondStepGroup.value.products[i].measure;
          product.number = this.secondStepGroup.value.products[i].number;
          product.price = this.secondStepGroup.value.products[i].price;
          product.note = this.secondStepGroup.value.products[i].note;

          saveArrayOfProducts.push(product);
        }
        this.documentService.addDocumentTN(this.firstStepGroup.value.documentName, this.agentId.value, saveArrayOfProducts)
          .then(data => {
            if (data) {
              this.createdDocument = data;
              this.showDocumentInPdf();
            }
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 3:
        this.documentService.addDocumentASPR(this.firstStepGroup.value.documentName, this.agentId.value, this.works.value)
          .then(data => {
            if (data) {
              this.createdDocument = data;
              this.showDocumentInPdf();
            }
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case 4:
        this.documentService.addDocumentTN(this.firstStepGroup.value.documentName, this.agentId.value, this.products.value)
          .then(data => {
            if (data) {
              this.createdDocument = data;
              this.showDocumentInPdf();
            }
          });
        break;
      default:
        alert('Problems');
    }

    const disableSuccessButton0 = this.firstStepGroup.valueChanges.subscribe(data => {
      if (data) {
        this.thirdStepGroup.controls.successButton.setValidators(Validators.required);
        this.thirdStepGroup.get('successButton').setValue('');
        this.visibleDocument = false;
        this.pageurl = null;
        this.disableButton = false;
      }
      disableSuccessButton1.unsubscribe();
    });

    const disableSuccessButton1 = this.secondStepGroup.valueChanges.subscribe(data => {
      if (data) {
        this.thirdStepGroup.controls.successButton.setValidators(Validators.required);
        this.thirdStepGroup.get('successButton').setValue('');
        this.visibleDocument = false;
        this.pageurl = null;
        this.disableButton = false;
      }
      disableSuccessButton1.unsubscribe();
    });
  }

  downloadDocumentInPdf() {
    this.onLoad = true;
    this.documentService.getDocumentByIdInPDF(this.createdDocument.id, this.createdDocument.name, this.createdDocument.type)
      .then(data => {
        if (data) {
          this.onLoad = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  downloadDocumentInExcel() {
    this.onLoad = true;
    this.documentService.getDocumentByIdInExcel(this.createdDocument.id, this.createdDocument.name, this.createdDocument.type)
      .then(data => {
        if (data) {
          this.onLoad = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  printDocument() {
    this.onLoad = true;
    this.documentService.printDocument(this.createdDocument.id, this.createdDocument.name, this.createdDocument.type)
      .then(data => {
        if (data) {
          this.onLoad = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  showDocumentInPdf() {
    this.onLoad = true;
    this.documentService.showDocumentInPdf(this.createdDocument.id, this.createdDocument.name, this.createdDocument.type)
      .then(res => {
        this.pageurl = res;
        this.onLoad = false;
        this.visibleDocument = true;

        this.snackBar.open('Файл успешно создан', 'Закрыть', {
          duration: 3000
        });

      })
      .catch(err => err.toString());
  }

  deleteDocument() {
    this.onLoad = true;
    this.documentService.deleteDocument(this.createdDocument.id)
      .then(data => {
        if (data) {
          this.onLoad = false;
          this.visibleDocument = false;
          this.disableButton = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  addNewAgent(event: any) {
    this.newAgentProp = true;
  }

  newAgentFromDocuments(event: any) {
    const result = typeof event;
    if (result == 'boolean') {
      this.newAgentProp = false;
    } else {
      this.allAgents.push(event);
    }
  }

}
