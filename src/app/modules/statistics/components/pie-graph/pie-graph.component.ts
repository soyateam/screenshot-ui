import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Axis } from 'highcharts';

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.css']
})
export class PieGraphComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('graphType') graphType: string;
  // tslint:disable-next-line: no-input-rename
  @Input('id') id: string;
  // tslint:disable-next-line: no-input-rename
  @Input('name') name: string;
  // tslint:disable-next-line: no-input-rename
  @Input('getFromDashboard') getFromDashboard: boolean;
  // tslint:disable-next-line: no-input-rename
  @Input('dateFilter') dateFilter: string;

  private drilldownTooltip = {
    headerFormat: '<table>',
    pointFormat: '<tr><td>{point.hierarchy}</td></tr><tr><td><b>{point.total:.1f}</b></td><td>מתוך</td><td><b>{point.y:.1f}</b></td></tr>',
    footerFormat: '</table>',
    useHTML: true
  };

  public options: any = {
    lang: {
      drillUpText: `<  חזור ליחידות`
    },
    chart: {
        type: 'pie',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        style: {
          fontFamily: 'arial'
        }
    },
    title: {
        text: ''
    },
    subtitle: {
        // text: 'חיתוך לפי כמות אנשים ביחידות'
    },
    tooltip: {
      useHTML: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<span>{point.name}</span><br><span>({point.percentage:.1f}%)</span>',
                useHTML: true
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
                        `pie-chart-${(new Date().toLocaleString())
                          .replace(/,/g, '-')
                          .replace(/\//g, '-')
                          .replace(/ /g, '')}`;
                      this.downloadXLS();
                  }
              }, {
                  text: 'CSV ייצא ל',
                  onclick() {
                      this.options.exporting.filename =
                        `pie-chart-${(new Date().toLocaleString())
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
                return 'קבוצות';
            } else {
                return item.name !== 'כמות אנשים לפי יחידה' ? `כמות אנשים ב${item.name}` : item.name;
            }
        }
      },
    },
    series: [{
      tooltip: {
        headerFormat: '<table>',
        // pointFormat: '<tr><td>ביחידה</td><td><b>{point.fullSize:.1f}</b></td><td>מתוך</td><td><b>{point.y:.1f}</b></td></tr>',
        // tslint:disable-next-line: object-literal-shorthand
        pointFormatter: function() {
          return `<tr><td>מתוך סך היחידה</td><td><b>${((this.y / this.fullSize) * 100).toFixed(2)}%</b></td></tr>`;
        },
        footerFormat: '</table>',
        useHTML: true
      },
      name: 'כמות אנשים לפי יחידה',
      colorByPoint: true,
      data: []
    }],
    drilldown: {
        series: []
    }
  };

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
    if (!!this.getFromDashboard) {
      this.options.title.text = 'הפעלת כוח';
    } else {
      this.options.title.text = this.route.snapshot.paramMap.get('name');
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let taskId;
    if (!!this.getFromDashboard && this.name && this.id) {
      this.options.title.text = this.name;
      taskId = this.id;
    } else {
      taskId = this.route.snapshot.paramMap.get('id');
    }
    this.sharedService.getStats(taskId, this.graphType, null, null, null, this.dateFilter).subscribe((result) => {
        this.createChart(result);
    });
  }

  createChart(data) {
    const updatedSeries = this.options.series;
    updatedSeries[0].data = data.mainSeries;

    const updatedDrilldownSeries = [];

    for (const drilldownData of data.drilldownSeries) {
      updatedDrilldownSeries.push({ ...drilldownData, tooltip: this.drilldownTooltip });
    }

    this.options = {
      ...this.options,
      /*drilldown: { series: updatedDrilldownSeries },*/
      series: updatedSeries
    };
  }
}
