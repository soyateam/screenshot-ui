import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import customEvents from 'highcharts-custom-events';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const drilldown = require('highcharts/modules/drilldown.src');

customEvents(Highcharts);
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
export class GraphComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('options') options: any;
  // tslint:disable-next-line: no-input-rename
  @Input('container') container: string;

  constructor() { }

  currGraph;

  ngOnInit() {
    this.options.lang.noData = '';
    this.currGraph = Highcharts.chart(this.container, this.options);
    this.currGraph.showLoading('...טוען נתונים');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.options.lang.noData = 'לא קיימים נתונים להצגת הגרף';
    this.currGraph = Highcharts.chart(this.container, this.options);
    this.currGraph.redraw();
    this.currGraph.hideLoading();
  }

  showLoad(event) {
    this.currGraph.showLoading();
  }
}
