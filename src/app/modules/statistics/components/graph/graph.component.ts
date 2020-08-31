import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let drilldown = require('highcharts/modules/drilldown.src');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
drilldown(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input('options') options: object;
  @Input('container') container: string;

  constructor() { }

  ngOnInit() {
    Highcharts.chart(this.container, this.options);
  }

  ngOnChanges(changes: SimpleChanges) {
    Highcharts.chart(this.container, this.options).redraw();
  }
}
