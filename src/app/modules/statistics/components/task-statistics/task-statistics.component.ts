import { Component, OnInit } from '@angular/core';
import { chart } from 'highcharts';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-task-statistics',
  templateUrl: './task-statistics.component.html',
  styleUrls: ['./task-statistics.component.css']
})
export class TaskStatisticsComponent implements OnInit {
  isUserCanWrite: boolean;
  graphs = [
      {value: 'Sum', viewValue: 'כמות אנשים'},
      {value: 'ServiceSum', viewValue: 'כמות אנשים לפי סוגי שירות'},
      {value: 'RankSum', viewValue: 'כמות אנשים לפי תקנים'},
      {value: 'UnitSum', viewValue: 'כמות אנשים ביחידות'},
      {value: 'UnitServiceSum', viewValue: 'כמות אנשים ביחידות לפי סוגי שירות'},
      {value: 'UnitRankSum', viewValue: 'כמות אנשים ביחידות לפי תקנים'}
    ];
  selectedGraph = this.graphs[0].value;
  graphType = "bar";

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.isUserCanWrite = this.userService.isUserCanWrite;
    if (!this.isUserCanWrite) {
      window.location.href = '/';
    }
  }

  onChange(chartType:string){
      //TODO get data from server and insert to options as series
    ["Sum", "ServiceSum", "RankSum"].includes(chartType) ? this.graphType ="bar" : this.graphType = "pie";
  }
}
