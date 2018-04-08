import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as blobUtil from 'blob-util';
import * as FileSaver from 'file-saver';
import {Product} from '../../models/Product';
import {Cookie} from 'ng2-cookies';
import {Work} from '../../models/Work';
import {FormArray} from '@angular/forms';

@Injectable()
export class DocumentService {
  secret = 'TuWH0yE7fRtW47HQ';

  constructor(private http: HttpClient) {
  }

  getAllDocuments(): Promise<any> {
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8081/documents/', {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  convertExcelToPdf(filename: string, type: string, file: string): Promise<any> {
    const url = 'https://v2.convertapi.com/' + type + '/to/pdf?Secret=' + this.secret;
    const body = {Parameters: [{Name: 'File', FileValue: {Name: filename + '.' + type, Data: file}}]};
    return new Promise((resolve, reject) => {
      this.http.post(url, body).toPromise()
        .then(data => {
          blobUtil.base64StringToBlob(data['Files'][0].FileData)
            .then(blob => {
              console.log('blo');
              console.log(blob);
              resolve(blob);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  convertExcelToPng(filename: string, type: string, file: string): Promise<any> {
    const url = 'https://v2.convertapi.com/' + type + '/to/png?Secret=' + this.secret;
    const body = {Parameters: [{Name: 'File', FileValue: {Name: filename + '.' + type, Data: file}}]};
    return new Promise((resolve, reject) => {
      this.http.post(url, body).toPromise()
        .then(data => {
          resolve(data['Files'][0].FileData);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getDocumentByIdInPDF(id: number, filename: string, type: string): Promise<any> {
    const url = 'http://localhost:8081/documents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers, responseType: 'blob'}).toPromise()
        .then(response => {
          blobUtil.blobToBase64String(response)
            .then(base64String => {
              this.convertExcelToPdf(filename, type, base64String)
                .then(blob => {
                  FileSaver.saveAs(new Blob([blob]), filename + '.pdf');
                  resolve('success');
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDocumentByIdInExcel(id: number, filename: string, type: string): Promise<any> {
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8081/documents/' + id, {headers: headers, responseType: 'blob'}).toPromise()
        .then(response => {
          FileSaver.saveAs(new Blob([response]), filename + '.' + type);
          resolve('success');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  showDocumentInPdf(id: number, filename: string, type: string): Promise<Uint8Array> {
    const url = 'http://localhost:8081/documents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers, responseType: 'blob'}).toPromise()
        .then(response => {
          blobUtil.blobToBase64String(response)
            .then((base64String) => {
              this.convertExcelToPdf(filename, type, base64String)
                .then(blob => {
                  blobUtil.blobToArrayBuffer(blob)
                    .then(arrayBuff => {
                      resolve(new Uint8Array(arrayBuff));
                    })
                    .catch(error => {
                      reject(error);
                    });
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  showDocumentInPng(id: number, filename: string, type: string): Promise<Uint8Array> {
    const url = 'http://localhost:8081/documents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers, responseType: 'blob'}).toPromise()
        .then(response => {
          blobUtil.blobToBase64String(response)
            .then((base64String) => {
              this.convertExcelToPng(filename, type, base64String)
                .then(blob => {
                  resolve(blob);
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  showAllDocumentInPng(array: any): Promise<any> {
    const promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(this.showDocumentInPng(array[i].id, array[i].filename, array[i].type));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(data => {
          console.log('222222222');

          console.log(data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  showAllDocumentInPdf(array: any): Promise<any> {
    const promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(this.showDocumentInPdf(array[i].id, array[i].filename, array[i].type));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  printDocument(id: number, filename: string, type: string): Promise<any> {
    const url = 'http://localhost:8081/documents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers, responseType: 'blob'}).toPromise()
        .then((response) => {
          blobUtil.blobToBase64String(response)
            .then((base64String) => {
              this.convertExcelToPdf(filename, type, base64String)
                .then(blob => {
                  const blobUrl = URL.createObjectURL(new Blob([blob], {type: 'application/pdf'}));
                  const iframe = document.createElement('iframe');
                  iframe.style.display = 'none';
                  iframe.src = blobUrl;
                  document.body.appendChild(iframe);
                  iframe.contentWindow.print();
                  resolve('success');
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addDocumentTN(documentName: string, agent_id: number, products: Product[]): Promise<any> {
    const url = 'http://localhost:8081/documents/tn';
    const body = {documentName: documentName, agent_id: agent_id, products: products};
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.post(url, body, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addDocumentTTN(documentName: string, agent_id: number, driver_id: number, products: Product[]): Promise<any> {
    const url = 'http://localhost:8081/documents/ttn';
    const body = {documentName: documentName, agent_id: agent_id, driver_id: driver_id, products: products};
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.post(url, body, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addDocumentASPR(documentName: string, agent_id: number, works: Work[]): Promise<any> {
    const url = 'http://localhost:8081/documents/aspr';
    const body = {documentName: documentName, agent_id: agent_id, works: works};
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.post(url, body, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  deleteDocument(id: number): Promise<any> {
    const url = 'http://localhost:8081/documents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.delete(url, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
