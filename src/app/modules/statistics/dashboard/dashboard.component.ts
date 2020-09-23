import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.barGraphType = this.statisticsType[0].id;
    this.currStat = this.taskTypes[0];
    this.selectedFilterBy = this.filterBy[0].id;
    this.selectedStatisticsType = this.statisticsType[0].id;
    this.pieName = this.currStat.name;
    this.pieId = this.currStat.id;
    this.mainBarId = this.currStat.id;
    this.mainBarName = this.currStat.name;
    this.hierarchy.push({ id: this.mainBarId, name: this.mainBarName });
  }

  changeStats(taskType): void {
    this.hierarchy = [];

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
    this.secondaryBarId = '';
    this.secondaryBarName = '';
    this.hierarchy.push({ id: taskType.id, name: taskType.name });
  }

  setGraphValues(): void {
    if (this.selectedFilterBy === 'UnitTaskCount') {
      this.barGraphType = 'UnitTaskCount';
      this.secondaryBarId = '';
      this.secondaryBarName = '';
    } else {
      this.barGraphType = this.selectedStatisticsType;
    }
  }

  rightClickChange(task): void {
    this.secondaryBarId = task.id;
    this.secondaryBarName = task.name;
  }

  leftClickChange(task): void {
    this.mainBarId = task.id;
    this.mainBarName = task.name;
    this.secondaryBarId = '';
    this.secondaryBarName = '';
    this.hierarchy.push({ id: task.id, name: task.name });
  }

  changeHierarchy(taskId) {
    this.secondaryBarId = '';
    this.secondaryBarName = '';

    const newHierarchy = [];

    // tslint:disable-next-line: prefer-for-of
    for (let currTaskIndex = 0; currTaskIndex < this.hierarchy.length; currTaskIndex++) {
      newHierarchy.push(this.hierarchy[currTaskIndex]);

      if (taskId === this.hierarchy[currTaskIndex].id) {
        this.mainBarId = this.hierarchy[currTaskIndex].id;
        this.mainBarName = this.hierarchy[currTaskIndex].name;
        break;
      }
    }

    this.hierarchy = newHierarchy;
  }
}
