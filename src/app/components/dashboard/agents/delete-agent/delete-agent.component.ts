import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Agent} from '../../../../models/Agent';
import {AgentService} from '../../../../services/agent/agent.service';

@Component({
  selector: 'app-delete-agent',
  templateUrl: './delete-agent.component.html',
  styleUrls: ['./delete-agent.component.css']
})
export class DeleteAgentComponent implements OnChanges {
  @Input()
  agents: Agent[] = [];

  @Output() deleteArray = new EventEmitter<any>();

  constructor(private agentService: AgentService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log('ll');
    console.log(this.agents);
    if (changes.agents) {
      this.agentService.deleteAllAgents(this.agents)
        .then(data => {
          this.deleteArray.emit(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
