import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/http/task.service';

const PARENT_IDS = [
  { name: 'forceOp', id: '5f4cc74c999432075ebeab2f' },
  { name: 'buildForce', id: '5f4cc9e2999432a15dbeab31'},
  { name: 'Wrap', id: '5f689b32fc60a9ebdcaa7cbb'},
];

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  forceOpTasks;
  buildForceTasks;
  wrapTasks;

  constructor(private taskService: TaskService) { }

  async ngOnInit() {
    this.forceOpTasks = (await this.taskService.getTasksByParentId(PARENT_IDS[0].id).toPromise()).tasks;

    // tslint:disable-next-line: prefer-for-of
    for (let currForceOpTask = 0; currForceOpTask < this.forceOpTasks.length; currForceOpTask++) {
      this.forceOpTasks[currForceOpTask].tasks =
        (await this.taskService.getTasksByParentId(this.forceOpTasks[currForceOpTask]._id).toPromise()).tasks;
    }

    this.buildForceTasks = (await this.taskService.getTasksByParentId(PARENT_IDS[1].id).toPromise()).tasks;

    // tslint:disable-next-line: prefer-for-of
    for (let currBuildTask = 0; currBuildTask < this.buildForceTasks.length; currBuildTask++) {
      this.buildForceTasks[currBuildTask].tasks =
        (await this.taskService.getTasksByParentId(this.buildForceTasks[currBuildTask]._id).toPromise()).tasks;
    }

    this.wrapTasks = (await this.taskService.getTasksByParentId(PARENT_IDS[2].id).toPromise()).tasks;
  }

}
