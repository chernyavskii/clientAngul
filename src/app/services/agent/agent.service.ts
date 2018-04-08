import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Cookie} from 'ng2-cookies';
import {Agent} from '../../models/Agent';
import {FormArray} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AgentService {
  constructor(private http: HttpClient) {
  }

  getAllAgents(): Promise<any> {
    const url = 'http://localhost:8081/agents/';
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  /*getAllAgents(): Observable<any> {
    const url = 'http://localhost:8081/agents/';
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});

     return this.http.get(url, {headers: headers});

  }*/

  getAgentById(id: number): Promise<any> {
    const url = 'http://localhost:8081/agents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.get(url, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  addAgent(agent: Agent): Promise<any> {
    const url = 'http://localhost:8081/agents/';
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.post(url, agent, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateAgent(id: number, agent: Agent): Promise<any> {
    const url = 'http://localhost:8081/agents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.put(url, agent, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateAllAgents(array: FormArray): Promise<any> {
    const promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(this.updateAgent(array[i].id, array[i]));
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

  deleteAgent(id: number): Promise<any> {
    const url = 'http://localhost:8081/agents/' + id;
    const headers = new HttpHeaders({Authorization: Cookie.get('token'), 'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      this.http.delete(url, {headers: headers}).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  deleteAllAgents(array: any) {
    const promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(this.deleteAgent(array[i].id));
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
}
