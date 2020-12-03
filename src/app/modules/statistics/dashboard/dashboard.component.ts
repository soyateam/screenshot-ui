import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TaskService } from 'src/app/core/http/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hierarchy = [];
  taskTypes = [
    { id: '5f4cc74c999432075ebeab2f', name: 'הפעלת כוח', color: 'primary'},
    { id: '5f4cc9e2999432a15dbeab31', name: 'בניין כוח', color: ''},
    { id: '5f689b32fc60a9ebdcaa7cbb', name: 'גורמי מעטפת', color: ''},
  ];

  filterBy = [{id: 'None',  displayName: 'משימות'}, {id: 'UnitTaskCount', displayName: 'יחידות'}];
  statisticsType = [{id: 'Sum', displayName: 'כמות אנשים'},
                    {id: 'ServiceSum', displayName: 'כמות אנשים לפי סוגי שירות'},
                    {id: 'RankSum', displayName: 'כמות אנשים לפי תקנים'}];
  defaultParentId = '5db805a8216dad5ed3b9efbf';
  currentUser;
  pieName = '';
  pieId = '';
  mainBarName = '';
  mainBarId = '';
  secondaryBarName = '';
  secondaryBarId = '';
  selectedFilterBy = '';
  selectedStatisticsType = '';
  currStat = {id: '', name: ''};
  barGraphType = '';
  mainParentGroupId = '5db805a8216dad5ed3b9efbf';
  secondaryParentGroupId = '';
  onUnitTaskCount = false;
  ancestors;
  constructor(private router: Router, private userService: UserService, private taskService: TaskService,
              public dialogRef: MatDialogRef<DashboardComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pieName = data.task.name;
    this.pieId = data.task._id;
    this.mainBarId = data.task._id;
    this.mainBarName = data.task.name;
    this.secondaryParentGroupId = '';
    this.ancestors = data.task.ancestors;

    if (this.ancestors[0] === data.task.parent) {
      this.ancestors.reverse();
    }

    this.taskService.getTask(data.task._id).subscribe(async (parentTask) => {
      this.hierarchy = [];
      let result;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.ancestors.length; i++) {
        result = await this.taskService.getTask(this.ancestors[i]).toPromise();
        if (result) {
          this.hierarchy.push(result);
        }

        result = null;
      }

      this.hierarchy.push(data.task);

      console.log(this.hierarchy);
      });
    }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUser;
    this.barGraphType = this.statisticsType[0].id;
    this.selectedFilterBy = this.filterBy[0].id;
    this.selectedStatisticsType = this.statisticsType[0].id;
    this.onUnitTaskCount = false;
    this.mainParentGroupId = this.defaultParentId;
  }

  changeStats(taskType): void {
    // tslint:disable-next-line: prefer-for-of
    for (let currTaskType = 0; currTaskType < this.taskTypes.length; currTaskType++) {
      if (taskType.id === this.taskTypes[currTaskType].id) {
        this.taskTypes[currTaskType].color = 'primary';
      } else {
        this.taskTypes[currTaskType].color = '';
      }
    }

    this.currStat = taskType;
    this.pieName = taskType.name;
    this.pieId = taskType.id;
    this.mainBarId = taskType.id;
    this.mainBarName = taskType.name;
    if (this.onUnitTaskCount && this.selectedFilterBy === 'UnitTaskCount') {
      this.mainParentGroupId = this.defaultParentId;
      this.secondaryParentGroupId = '';
      this.secondaryBarId = '';
      this.secondaryBarName = '';
    } else {
      this.secondaryBarId = '';
      this.secondaryBarName = '';
      this.secondaryParentGroupId = '';
    }
    // this.secondaryBarId = '';
    // this.secondaryBarName = '';
    // this.secondaryParentGroupId = '';
  }

  setGraphValues(): void {
    if (this.selectedFilterBy === 'UnitTaskCount') {
      this.barGraphType = 'UnitTaskCount';
      this.mainBarId = this.pieId;
      this.mainBarName = this.pieName;
      this.secondaryBarId = this.pieId;
      this.secondaryBarName = '';
      this.secondaryParentGroupId = '';
      this.onUnitTaskCount = true;
    } else {
      // The caused from changing Units to Tasks in the filterBy,
      // So the onUnitTaskCount flag is still on.
      // Need to return to the previous tasks context instead of parentGroupId context.
      if (this.onUnitTaskCount) {
        this.mainBarId = this.pieId;
        this.mainBarName = this.pieName;
        this.mainParentGroupId = this.defaultParentId;
        this.secondaryBarId = '';
        this.secondaryBarName = '';
        this.secondaryParentGroupId = '';
        this.onUnitTaskCount = false;
      }
      this.barGraphType = this.selectedStatisticsType;
    }
  }

  rightClickChange(task): void {
    if (this.selectedFilterBy === 'UnitTaskCount' && this.onUnitTaskCount) {
      this.secondaryParentGroupId = task.id;
      this.secondaryBarId = this.mainBarId;
      this.secondaryBarName = task.name;
    } else {
      this.secondaryBarId = task.id;
      this.secondaryBarName = task.name;
    }
  }

  leftClickChange(task): void {
    if (this.selectedFilterBy === 'UnitTaskCount' && this.onUnitTaskCount) {
      this.mainParentGroupId = task.id;
      this.mainBarName = task.name;
      this.secondaryBarName = '';
      this.secondaryBarId = this.mainBarId;
      this.secondaryParentGroupId = '';
      this.pieId = task.id;
      this.pieName = task.name;
      this.hierarchy.push(task);
    } else {
      this.mainBarId = task.id;
      this.mainBarName = task.name;
      this.secondaryBarId = '';
      this.secondaryBarName = '';
      this.pieId = task.id;
      this.pieName = task.name;
      this.hierarchy.push(task);
    }
  }

  changeHierarchy(taskId, taskName) {
    // tslint:disable-next-line: prefer-for-of
    for (let currHierarchyIndex = 0; currHierarchyIndex < this.hierarchy.length; currHierarchyIndex++) {
      if (this.hierarchy[currHierarchyIndex]._id === taskId) {
        this.hierarchy.splice(currHierarchyIndex + 1);
        console.log(this.hierarchy);
        break;
      }
    }

    this.mainBarId = taskId;
    this.mainBarName = taskName;
    this.pieId = taskId;
    this.pieName = taskName;
    this.secondaryBarId = '';
    this.secondaryBarName = '';
  }

  close() {
    this.dialogRef.close();
  }
}
