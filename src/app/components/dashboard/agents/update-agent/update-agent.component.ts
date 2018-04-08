import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Agent} from '../../../../models/Agent';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {AgentService} from '../../../../services/agent/agent.service';

@Component({
  selector: 'app-update-agent',
  templateUrl: './update-agent.component.html',
  styleUrls: ['./update-agent.component.css']
})
export class UpdateAgentComponent implements OnChanges {

  @Input()
  agents: Agent[] = [];
  @Output() onVoted = new EventEmitter<Agent[]>();

  updateAgentForm: FormGroup;
  onLoad = false;
  changes: SimpleChanges;

  constructor(private fb: FormBuilder,
              private agentService: AgentService) {
    this.updateAgentForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  pushItem() {
    for (let i = 0; i < this.agents.length; i++) {
      this.items.push(this.fb.group({
        id: this.agents[i].id,
        firstName: this.agents[i].firstName,
        middleName: this.agents[i].middleName,
        lastName: this.agents[i].lastName,
        address: this.agents[i].address,
        bank: this.agents[i].bank,
        bik: this.agents[i].bik,
        ks: this.agents[i].ks,
        organization: this.agents[i].organization,
        phone: this.agents[i].phone,
        position: this.agents[i].position,
        unp: this.agents[i].unp,
        rs: this.agents[i].rs,
      }));
    }
  }

  checkIdCurrent(id: number): boolean {
    for (let i = 0; i < this.changes.agents.previousValue.length; i++) {
      if (id === this.changes.agents.previousValue[i].id) {
        return true;
      }
    }
    return false;
  }

  checkIdPrevious(id: number): boolean {
    for (let i = 0; i < this.changes.agents.currentValue.length; i++) {
      if (id === this.changes.agents.currentValue[i].id) {
        return true;
      }
    }
    return false;
  }

  removeItem(array: FormArray) {
    for (let i = 0; i < array.length; i++) {
      if (this.changes.agents.currentValue[i].id !== array.at(i).value.id) {
        array.removeAt(i);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changes = changes;
    if (changes.agents.firstChange) {
      this.pushItem();
    } else {
      if (changes.agents.currentValue.length > changes.agents.previousValue.length) {
        for (let i = 0; i < changes.agents.currentValue.length; i++) {
          const result = this.checkIdCurrent(changes.agents.currentValue[i].id);
          if (!result) {
            this.removeItem(this.items);
            this.items.push(this.fb.group({
              id: changes.agents.currentValue[i].id,
              firstName: changes.agents.currentValue[i].firstName,
              middleName: changes.agents.currentValue[i].middleName,
              lastName: changes.agents.currentValue[i].lastName,
              address: changes.agents.currentValue[i].address,
              bank: changes.agents.currentValue[i].bank,
              bik: changes.agents.currentValue[i].bik,
              ks: changes.agents.currentValue[i].ks,
              organization: changes.agents.currentValue[i].organization,
              phone: changes.agents.currentValue[i].phone,
              position: changes.agents.currentValue[i].position,
              unp: changes.agents.currentValue[i].unp,
              rs: changes.agents.currentValue[i].rs,
            }));
          }
        }
      } else {
        for (let i = 0; i < changes.agents.previousValue.length; i++) {
          const result = this.checkIdPrevious(changes.agents.previousValue[i].id);
          if (!result) {
            for (let k = 0; k < this.items.length; k++) {
              if (this.items.at(k).value.id === changes.agents.previousValue[i].id) {
                this.items.removeAt(k);
              }
            }
          } else {
            for (let k = 0; k < this.items.length; k++) {
              if (this.items.at(k).value.id === changes.agents.previousValue[i].id) {
                this.items.removeAt(k);
              }
            }
          }
        }
        this.pushItem();
      }
    }
  }

  get items(): FormArray {
    return this.updateAgentForm.get('items') as FormArray;
  }

  updateAgent(formValue: FormGroup) {
    this.onLoad = true;
    const updateAgent: Agent = {
      id: null,
      firstName: formValue.value.firstName,
      middleName: formValue.value.middleName,
      lastName: formValue.value.lastName,
      address: formValue.value.address,
      bank: formValue.value.bank,
      bik: formValue.value.bik,
      ks: formValue.value.ks,
      organization: formValue.value.organization,
      phone: formValue.value.phone,
      position: formValue.value.position,
      unp: formValue.value.unp,
      rs: formValue.value.rs,
    };
    this.agentService.updateAgent(formValue.value.id, updateAgent)
      .then(data => {
        const array: Agent[] = [formValue.value];
        this.onVoted.emit(array);
        this.onLoad = false;
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateAllAgents() {
    this.onLoad = true;
    this.agentService.updateAllAgents(this.items.value)
      .then(data => {
        this.onVoted.emit(this.items.value);
        this.onLoad = false;
      })
      .catch(err => {
        console.log(err);
      });
  }

  closeWindow(i: number) {
    this.items.removeAt(i);
    this.onVoted.emit(this.items.value);
  }
}
