import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';

let oneClickHandle;
let dblClickHandle;
let categoryIds;
let currChart;
let getFromDashboardReal;

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})



export class BarGraphComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-output-native
  @Output() oneClick: EventEmitter<any> = new EventEmitter();
  @Output() dblClick: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input('graphType') graphType: string;
  // tslint:disable-next-line: no-input-rename
  @Input('id') id: string;
  // tslint:disable-next-line: no-input-rename
  @Input('name') name: string;
  // tslint:disable-next-line: no-input-rename
  @Input('getFromDashboard') getFromDashboard: boolean;

  public options: any = {
    lang: {
      noData: 'לא קיימים נתונים להצגת הגרף'
    },
    chart: {
        type: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        events: {
          load() {
            this.hideLoading();
          }
        }
    },
    title: {
        text: 'משימה בלה בלה'
    },
    subtitle: {},
    xAxis: {
        categories: [],
        crosshair: true
    },
    legend: {
      // tslint:disable-next-line: object-literal-shorthand
      labelFormatter: function() {
          const sum = this.yData.reduce((pv, cv) => pv + cv, 0);
          return '(' + Math.floor(sum) + ') ' + this.name;
      }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'מספר אנשים'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click() {
                if (!!getFromDashboardReal) {
                  currChart = this.series.chart;
                  currChart.showLoading('...טוען נתונים');
                  dblClickHandle.emit({name: this.category, id: categoryIds[this.x]});
                }
              },
              contextmenu(e) {
                if (!!getFromDashboardReal) {
                  // tslint:disable-next-line: prefer-for-of
                  for (let currChildIndex = 0; currChildIndex < this.series.xAxis.labelGroup.element.children.length; currChildIndex++) {
                    this.series.xAxis.labelGroup.element.children[currChildIndex].style.cssText =
                    'color: rgb(102,102,102); cursor: default; font-size: 11px; fill: rgb(102, 102, 102);';
                    // this.series.xAxis.labelGroup.element.children[this.x].style[4] = 'nothing';
                  }
                  // this.series.xAxis.labelGroup.element.children[this.x].style.fontWeight = 'bold';
                  this.series.xAxis.labelGroup.element.children[this.x].style.cssText =
                    'color: rgb(0,0,0); cursor: default; font-size: 11px; fill: rgb(0, 0, 0); font-weight: bold; text-decoration: overline';
                  oneClickHandle.emit({name: this.category, id: categoryIds[this.x]});
                  e.preventDefault();
                }
              }
            }
          }
        }
    },
    series: []
};

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
    oneClickHandle = this.oneClick;
    dblClickHandle = this.dblClick;

    if (!!this.getFromDashboard) {
      this.options.title.text = 'הפעלת כוח';
    } else {
      this.options.title.text = this.route.snapshot.paramMap.get('name');
    }
   }

  ngOnInit(): void {
    // console.log(this.graphType)
  }
  ngOnChanges(changes: SimpleChanges) {
    getFromDashboardReal = this.getFromDashboard;
    let taskId;

    if (!!this.getFromDashboard && this.name && this.id) {
      this.options.title.text = this.name;
      taskId = this.id;
    } else {
      taskId = this.route.snapshot.paramMap.get('id');
    }

    this.sharedService.getStats(taskId, this.graphType, !!this.getFromDashboard).subscribe((result) => {
        if (currChart) {
          currChart.hideLoading();
        }

        this.createChart(result);
    });
  }

  createChart(data) {

    let categoryNames = [];

    if (!!this.getFromDashboard) {
      categoryIds = [];

      for (const currCategory of data.categories) {
        categoryIds.push(currCategory.id);
        categoryNames.push(currCategory.name);
      }
    } else {
      categoryNames = data.categories;
    }

    this.options = {...this.options,
         xAxis: {categories: categoryNames},
         series: data.series
        };
  }
}
