import { Component, OnInit } from '@angular/core';
import { chart } from 'highcharts';

@Component({
  selector: 'app-task-statistics',
  templateUrl: './task-statistics.component.html',
  styleUrls: ['./task-statistics.component.css']
})
export class TaskStatisticsComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
  }

  onChange(chartType:string){
      //TODO get data from server and insert to options as series
      //this.options = chartType == 'bar' ? this.barChartOptions : this.pieChartOptions
    ["Sum", "ServiceSum", "RankSum"].includes(chartType) ? this.graphType ="bar" : this.graphType = "pie";
    console.log(this.graphType)
  }
}
