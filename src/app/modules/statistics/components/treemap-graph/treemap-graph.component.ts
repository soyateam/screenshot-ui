import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { Axis, seriesType } from 'highcharts';

@Component({
  selector: 'app-treemap-graph',
  templateUrl: './treemap-graph.component.html',
  styleUrls: ['./treemap-graph.component.css']
})
export class TreemapGraphComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('taskId') taskId: string;
  @Input('tasks') tasks: any;

  emptyData: boolean = true;

  public TREEMAP_GROUPS = {
    forceOpTasks: {
      id: 'forceOpTasks',
      name: 'הפעלת כוח',
      color: '#4173c8',
    },
    buildForceTasks: {
      id: 'buildForceTasks',
      name: 'בניין כוח',
      color: '#f8862e',
    },
    wrapTasks: {
      id: 'wrapTasks',
      name: 'מעטפת',
      color: '#ffbb00',
    }
  }

  public options: any = {
    lang: {
      noData: 'לא קיימות משימות עם שיוכים'
    },
    chart: {
      height: '800px',
      type: 'treemap',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      events: {
        load() {
          this.hideLoading();
        }
      },
      style: {
        fontFamily: 'arial',
      }
    },
    title: {
      text: 'פילוח כ״א אמ״ן',
      align: 'center',
      useHTML: true,
      style: {
        direction: 'rtl',
        fontSize: '26px'
      }
    },
    subtitle: {},
    legend: {
      // tslint:disable-next-line: object-literal-shorthand
      labelFormatter: function () {
        console.log(this);
        if (!this.id) {
          return null;
        }

        let sum = 0;
        for (let index = 0; index < this.series.data.length; index++) {
          if (this.series.data[index].parent === this.id &&
              this.series.data[index].value) {
            sum += this.series.data[index].value;
          }
        }

        return '(' + Math.floor(sum) + ') ' + this.name;
      },
      itemStyle: {
        fontSize: '14px'
      },
    },
    tooltip: {
      headerFormat: '<div style="font-size:12px; font-weight:bold; text-align:center;">{point.key}</div><table style="direction:rtl; text-align:center;">',
      pointFormat: '<tr><td style="color:{series.color};padding:0;font-weight:bold; font-size:12px;"></td>' +
        '<td style="padding:0"><b>{point.value:.2f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      },
    },
    exporting: {
      enabled: false
    },
    // exporting: {
    //   buttons: {
    //     contextButton: {
    //       enabled: true,
    //       menuItems: [{
    //         text: 'ייצא לאקסל',
    //         onclick() {
    //           this.options.exporting.filename =
    //             `treemap-chart-${(new Date().toLocaleString())
    //               .replace(/,/g, '-')
    //               .replace(/\//g, '-')
    //               .replace(/ /g, '')}`;
    //           this.downloadXLS();
    //         }
    //       }, {
    //         text: 'CSV ייצא ל',
    //         onclick() {
    //           this.options.exporting.filename =
    //             `treemap-chart-${(new Date().toLocaleString())
    //               .replace(/,/g, '-')
    //               .replace(/\//g, '-')
    //               .replace(/ /g, '')}`;
    //           this.downloadCSV();
    //         }
    //       }]
    //     }
    //   },
    //   csv: {
    //     columnHeaderFormatter(item, key) {
    //       if (!item || item instanceof Axis) {
    //         return 'משימות';
    //       } else {
    //         return item.name;
    //       }
    //     }
    //   },
    // },
    series: [{
      type: "treemap",
      layoutAlgorithm: 'stripes',
      alternateStartingDirection: true,
      // showInLegend: true,
      // legendType: 'point',
      levels: [
        {
          level: 1,
          layoutAlgorithm: 'squarified',
          allowOverlap: false,
          dataLabels: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            style: {
              fontFamily: 'arial',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }
          },
        },
        {
          level: 2,
          layoutAlgorithm: 'squarified',
          allowOverlap: false,
          dataLabels: {
            enabled: true,
            style: {
              fontFamily: 'arial',
              fontSize: '14px'
            }
          },
        }
      ],
      data: []
    }]
  };

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.createChart();
  }

  formatTasksToChart() {
    let data: any = [...Object.values(this.TREEMAP_GROUPS)];
    let hasAtLeastOne = false;

    for (let taskType of Object.keys(this.TREEMAP_GROUPS)) {
      let currentTasksChildren = this.tasks[taskType].children;

      for (let index = 0; index < currentTasksChildren.length; index++) {
        data.push(
          {
            parent: taskType,
            name: currentTasksChildren[index].name,
            value: currentTasksChildren[index].value,
          }
        );
        hasAtLeastOne = hasAtLeastOne || currentTasksChildren[index].value !== 0;
      }
    }

    if (Object.values(this.TREEMAP_GROUPS).length === data.length || !hasAtLeastOne) {
      return null;
    }

    return data;
  }

  createChart() {

    // const exampleData = [{
    //   id: 'A',
    //   name: 'הפעלת כוח',
    //   color: "#4173c8",
    // }, {
    //   id: 'B',
    //   name: 'בניין כוח',
    //   color: "#f8862e",
    // }, {
    //   id: 'O',
    //   name: 'מעטפת',
    //   color: '#ffbb00',
    // }, {
    //   name: 'Anne',
    //   parent: 'A',
    //   value: 5
    // }, {
    //   name: 'Rick',
    //   parent: 'A',
    //   value: 3
    // }, {
    //   name: 'Peter',
    //   parent: 'A',
    //   value: 4
    // }, {
    //   name: 'Anne',
    //   parent: 'B',
    //   value: 4
    // }, {
    //   name: 'Rick',
    //   parent: 'B',
    //   value: 10
    // }, {
    //   name: 'Peter',
    //   parent: 'B',
    //   value: 1
    // }, {
    //   name: 'Anne',
    //   parent: 'O',
    //   value: 1
    // }, {
    //   name: 'Rick',
    //   parent: 'O',
    //   value: 3
    // }, {
    //   name: 'Peter',
    //   parent: 'O',
    //   value: 3
    // }];

    const data = this.formatTasksToChart();

    if (!data) {
      this.emptyData = true;
    } else {
      this.emptyData = false;
      this.options = {
        ...this.options,
        series: [{ ...this.options.series[0], data }]
      }
    }    
  }
}
