import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Axis } from 'highcharts';

let oneClickHandle;
let dblClickHandle;
let categoryIds;
let currChart;
let getFromDashboardReal;
let onUnitTaskCountGlobal;

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
  // tslint:disable-next-line: no-input-rename
  @Input('parentGroupId') parentGroupId: string;
  // tslint:disable-next-line: no-input-rename
  @Input('onUnitTaskCount') onUnitTaskCount: boolean;
  // tslint:disable-next-line: no-input-rename
  @Input('dateFilter') dateFilter: string;
  // tslint:disable-next-line: no-input-rename
  @Input('unitFilter') unitFilter: string;


  public titleTexts = ['קבוצות מתוך - ', 'משימות מתוך - '];
  public yAxisTexts = ['כמות משימות', 'כמות אנשים'];
  public options: any = {
    lang: {
      noData: 'לא קיימות תתי משימות עם שיוכים למשימה הנוכחית'
    },
    chart: {
        height: '350px',
        type: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        events: {
          load() {
            this.hideLoading();
          }
        },
        style: {
          fontFamily: 'system-ui'
        }
    },
    title: {
      text: '',
      align: 'center',
      useHTML: true,
      style: {
        direction: 'rtl'
      }
    },
    subtitle: {},
    xAxis: {
        categories: [],
        crosshair: true,
        labels: {
          style: {
            fontSize: '14px'
          }
        }
    },
    legend: {
      // tslint:disable-next-line: object-literal-shorthand
      labelFormatter: function() {
          const sum = this.yData.reduce((pv, cv) => pv + cv, 0);
          return '(' + Math.floor(sum) + ') ' + this.name;
      },
      itemStyle: {
        fontSize: '14px'
      },
    },
    yAxis: {
        min: 0,
        title: {
            text: 'כמות אנשים'
        }
    },
    tooltip: {
        headerFormat: '<div style="font-size:12px; font-weight:bold; text-align:center;">{point.key}</div><table style="direction:rtl; text-align:center;">',
        pointFormat: '<tr><td style="color:{series.color};padding:0;font-weight:bold; font-size:12px;">{series.name}: </td>' +
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
                    'color: rgb(102,102,102); cursor: default; font-size: 13px; fill: rgb(102, 102, 102);';
                    // this.series.xAxis.labelGroup.element.children[this.x].style[4] = 'nothing';
                  }
                  // this.series.xAxis.labelGroup.element.children[this.x].style.fontWeight = 'bold';
                  this.series.xAxis.labelGroup.element.children[this.x].style.cssText =
                    'color: rgb(0,0,0); cursor: default; font-size: 13px; fill: rgb(0, 0, 0); font-weight: bold; text-decoration: overline';
                  oneClickHandle.emit({name: this.category, id: categoryIds[this.x]});
                  e.preventDefault();
                }
              }
            }
          }
        }
    },
    exporting: {
      buttons: {
        contextButton: {
            enabled: true,
            menuItems: [{
                text: 'ייצא לאקסל',
                onclick() {
                    this.options.exporting.filename =
                      `bar-chart-${(new Date().toLocaleString())
                        .replace(/,/g, '-')
                        .replace(/\//g, '-')
                        .replace(/ /g, '')}`;
                    this.downloadXLS();
                }
            }, {
              text: 'CSV ייצא ל',
                onclick() {
                    this.options.exporting.filename =
                      `bar-chart-${(new Date().toLocaleString())
                        .replace(/,/g, '-')
                        .replace(/\//g, '-')
                        .replace(/ /g, '')}`;
                    this.downloadCSV();
                }
            }]
        }
    },
      csv: {
        columnHeaderFormatter(item, key) {
            if (!item || item instanceof Axis) {
                return onUnitTaskCountGlobal ? 'קבוצות' : 'משימות';
            } else {
                return item.name;
            }
        }
      },
    },
    series: []
};

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
    oneClickHandle = this.oneClick;
    dblClickHandle = this.dblClick;
    onUnitTaskCountGlobal = this.onUnitTaskCount;

    if (!!this.getFromDashboard) {
      this.options.title.text = (this.onUnitTaskCount ? this.titleTexts[0] : this.titleTexts[1]) + 'הפעלת כוח';
      this.options.yAxis.title.text = (this.onUnitTaskCount ? this.yAxisTexts[0] : this.yAxisTexts[1]);
    } else {
      this.options.title.text = this.route.snapshot.paramMap.get('name');
    }
   }

  ngOnInit(): void {
    // console.log(this.graphType)
  }
  ngOnChanges(changes: SimpleChanges) {
    onUnitTaskCountGlobal = this.onUnitTaskCount;
    getFromDashboardReal = this.getFromDashboard;
    let taskId;

    if (!!this.getFromDashboard && this.name && this.id) {
      this.options.title.text = (this.onUnitTaskCount ? this.titleTexts[0] : this.titleTexts[1]) + this.name;
      this.options.yAxis.title.text = (this.onUnitTaskCount ? this.yAxisTexts[0] : this.yAxisTexts[1]);
      taskId = this.id;
    } else {
      taskId = this.route.snapshot.paramMap.get('id');
    }

    // tslint:disable-next-line: max-line-length
    this.sharedService.getStats(
      taskId,
      this.graphType,
      !!this.getFromDashboard,
      (this.onUnitTaskCount ? this.parentGroupId : null),
      this.unitFilter,
      this.dateFilter,
    ).subscribe((result) => {
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

    if (data.series) {
      for (let index = 0; index < data.series.length; index++) {
        data.series[index] = { ...data.series[index], dataSorting: { enabled: true } }
      }
    }

    this.options = {...this.options,
         xAxis: {categories: categoryNames,
                 lables: {
                   style: {
                     fontSize: '14px'
                   }
                 }},
         series: data.series
        };
  }
}