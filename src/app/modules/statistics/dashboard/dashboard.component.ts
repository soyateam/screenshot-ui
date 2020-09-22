import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  taskTypes = [
    { id: '5f4cc74c999432075ebeab2f', name: 'הפעלת כוח'},
    { id: '5f4cc9e2999432a15dbeab31', name: 'בניין כוח'},
    { id: '5f689b32fc60a9ebdcaa7cbb', name: 'גורמי מעטפת'},
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
    if (window.location.pathname === '/dashboard') {
      // this.router.navigate([`/dashboard/${this.taskTypes[0].id}/${this.taskTypes[0].name}`]);
      // window.location.href = '/dashboard/5f4cc74c999432075ebeab2f/הפעלת%20כוח';
    }
  }

  changeStats(taskType): void {
    this.currStat = taskType;
    this.pieName = taskType.name;
    this.pieId = taskType.id;
    this.mainBarId = taskType.id;
    this.mainBarName = taskType.name;
    this.secondaryBarId = '';
    this.secondaryBarName = '';
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

  oneClickChange(task): void {
    this.secondaryBarId = task.id;
    this.secondaryBarName = task.name;
  }

  dblClickChange(task): void {
    this.mainBarId = task.id;
    this.mainBarName = task.name;
    this.secondaryBarId = '';
    this.secondaryBarName = '';
  }
}
