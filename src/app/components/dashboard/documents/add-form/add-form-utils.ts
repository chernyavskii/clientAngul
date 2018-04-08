import {FormArray, FormControl, Validators} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class AddFormUtils {
  static resetValidationOfProducts(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValidators(Validators.nullValidator);
      array.controls[i].get('measure').setValidators(Validators.nullValidator);
      array.controls[i].get('number').setValidators(Validators.nullValidator);
      array.controls[i].get('price').setValidators(Validators.nullValidator);
      array.controls[i].get('note').setValidators(Validators.nullValidator);
      array.controls[i].get('packageNumber').setValidators(Validators.nullValidator);
      array.controls[i].get('weight').setValidators(Validators.nullValidator);
    }
  }

  static resetValidationOfWorks(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValidators(Validators.nullValidator);
      array.controls[i].get('price').setValidators(Validators.nullValidator);
    }
  }

  static addValidationOfProducts(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValidators(Validators.required);
      array.controls[i].get('measure').setValidators(Validators.required);
      array.controls[i].get('number').setValidators(Validators.required);
      array.controls[i].get('price').setValidators(Validators.required);
      array.controls[i].get('note').setValidators(Validators.required);
    }
  }

  static addValidationOfWorks(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValidators(Validators.required);
      array.controls[i].get('price').setValidators(Validators.required);
    }
  }

  static resetValuesOfProducts(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValue('');
      array.controls[i].get('measure').setValue('');
      array.controls[i].get('number').setValue('');
      array.controls[i].get('price').setValue('');
      array.controls[i].get('note').setValue('');
    }
  }

  static resetValuesOfWorks(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      array.controls[i].get('name').setValue('');
      array.controls[i].get('price').setValue('');
    }
  }

  static resetValidation(array1: FormArray, array2: FormArray) {
    this.resetValidationOfProducts(array1);
    this.resetValidationOfWorks(array2);
  }

  static resetValues(array1: FormArray, array2: FormArray) {
    this.resetValuesOfProducts(array1);
    this.resetValuesOfWorks(array2);
  }

  static clearAllItems(array: FormArray) {
    while (array.length !== 1) {
      array.removeAt(0);
    }
  }

  static resetDriverInformation(control: FormControl) {
    control.setValue('');
    control.setValidators(Validators.nullValidator);
  }
}
