import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import customEvents from 'highcharts-custom-events';

declare var require: any;
const Boost = require('highcharts/modules/boost');

const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const drilldown = require('highcharts/modules/drilldown.src');
// tslint:disable-next-line: variable-name
const HC_exporting = require('highcharts/modules/exporting');
// tslint:disable-next-line: variable-name
const HC_exportData = require('highcharts/modules/export-data');

const theme = {
  colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
   '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
   backgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
      stops: [
         [0, '#2a2a2b'],
         [1, '#3e3e40']
      ]
   },
   style: {
      fontFamily: '\'Unica One\', sans-serif'
   },
   plotBorderColor: '#606063'
  },
  title: {
   style: {
      color: '#E0E0E3',
      textTransform: 'uppercase',
      fontSize: '20px'
   }
  },
  subtitle: {
   style: {
      color: '#E0E0E3',
      textTransform: 'uppercase'
   }
 },
 xAxis: {
   gridLineColor: '#707073',
   labels: {
      style: {
         color: '#E0E0E3'
      }
   },
   lineColor: '#707073',
   minorGridLineColor: '#505053',
   tickColor: '#707073',
   title: {
      style: {
         color: '#A0A0A3'
      }
   }
 },
 yAxis: {
   gridLineColor: '#707073',
   labels: {
      style: {
         color: '#E0E0E3'
      }
   },
   lineColor: '#707073',
   minorGridLineColor: '#505053',
   tickColor: '#707073',
   tickWidth: 1,
   title: {
      style: {
         color: '#A0A0A3'
      }
   }
 },
 tooltip: {
   backgroundColor: 'rgba(0, 0, 0, 0.85)',
   style: {
      color: '#F0F0F0'
   }
 },
 plotOptions: {
   series: {
      dataLabels: {
         color: '#B0B0B3'
      },
      marker: {
         lineColor: '#333'
      }
   },
   boxplot: {
      fillColor: '#505053'
   },
   candlestick: {
      lineColor: 'white'
   },
   errorbar: {
      color: 'white'
   }
 },
 legend: {
   itemStyle: {
      color: '#E0E0E3'
   },
   itemHoverStyle: {
      color: '#FFF'
   },
   itemHiddenStyle: {
      color: '#606063'
   }
 },
 credits: {
   style: {
      color: '#666'
   }
 },
 labels: {
   style: {
      color: '#707073'
   }
 },
 drilldown: {
   activeAxisLabelStyle: {
      color: '#F0F0F3'
   },
   activeDataLabelStyle: {
      color: '#F0F0F3'
   }
 },
 navigation: {
   buttonOptions: {
      symbolStroke: '#DDDDDD',
      theme: {
         fill: '#505053'
      }
   }
 },
 // scroll charts
 rangeSelector: {
   buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
         color: '#CCC'
      },
      states: {
         hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
               color: 'white'
            }
         },
         select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
               color: 'white'
            }
         }
      }
   },
   inputBoxBorderColor: '#505053',
   inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
   },
   labelStyle: {
      color: 'silver'
   }
 },
 navigator: {
   handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
   },
   outlineColor: '#CCC',
   maskFill: 'rgba(255,255,255,0.1)',
   series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
   },
   xAxis: {
      gridLineColor: '#505053'
   }
 },
 scrollbar: {
   barBackgroundColor: '#808083',
   barBorderColor: '#808083',
   buttonArrowColor: '#CCC',
   buttonBackgroundColor: '#606063',
   buttonBorderColor: '#606063',
   rifleColor: '#FFF',
   trackBackgroundColor: '#404043',
   trackBorderColor: '#404043'
 },
 // special colors for some of the
 legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
 background2: '#505053',
 dataLabelsColor: '#B0B0B3',
 textColor: '#C0C0C0',
 contrastTextColor: '#F0F0F3',
 maskColor: 'rgba(255,255,255,0.3)'
 };

customEvents(Highcharts);
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
drilldown(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);

@Component({
   selector: 'app-graph',
   templateUrl: './graph.component.html',
   styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {
   // tslint:disable-next-line: no-input-rename
   @Input('options') options;
   // tslint:disable-next-line: no-input-rename
   @Input('container') container: string;

   constructor() { }

   currGraph;

   ngOnInit() {
      this.options.lang.noData = '';

      // Apply the theme
      // Highcharts.setOptions(theme as any);
      this.currGraph = Highcharts.chart(this.container, this.options);
      if (this.container !== 'linear') {
         this.currGraph.showLoading('...טוען נתונים');
      }
   }

   ngOnChanges(changes: SimpleChanges) {
      switch(this.container) {
         case 'bar':
            this.options.lang.noData = 'לא קיימות תתי משימות עם שיוכים למשימה הנוכחית';
            break;
         case 'pie':
            this.options.lang.noData = 'לא קיימות קבוצות המשוייכות למשימה ';
            break;
         default:
            this.options.lang.noData = 'לא קיימים נתונים להצגת הגרף';
      }
      
      this.currGraph = Highcharts.chart(this.container, this.options);
      this.currGraph.redraw();
      this.currGraph.hideLoading();
   }

  showLoad(event) {
    this.currGraph.showLoading();
  }
}
