import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Axis } from 'highcharts';

const GRAPH_TYPE = 'Timeline';

@Component({
  selector: 'app-linear-graph',
  templateUrl: './linear-graph.component.html',
  styleUrls: ['./linear-graph.component.css']
})

export class LinearGraphComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('unitFilter') unitFilter: string;
  // tslint:disable-next-line: no-input-rename
  @Input('id') id: string;

  public options = {
    tooltip: {
     // enabled: false
    },
    plotOptions: {
      series: {
        states: {
          hover: {
           // enabled: false
          }
        },
        dataLabels: {
          // enabled: true
        }
      }
    },
    lang: {
      noData: 'boom'
    },
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'arial'
      }
    },
    title: {
      text: 'כמות אנשים לפי חודש'
    },
    xAxis: {
      categories: [] as any,
    },
    legend: {
      itemStyle: {
        fontSize: '14px'
      },
    },
    yAxis: {
      title: {
        text: 'כמות אנשים'
      },
    },
    series: [] as any
  };

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // console.log(this.graphType)
  }
  async ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: max-line-length
    const result = await this.sharedService.getStats(this.id, GRAPH_TYPE, null, null, this.unitFilter).toPromise();

    if (result) {
      this.createChart(result);
    }
  }

  createChart(data) {

    console.log(data);

    let categoryNames;

    categoryNames = data.categories;

    this.options =
    {
      ...this.options,
      xAxis: { categories: categoryNames },
      series: [{
        name: 'test',
        data: data.series,
        tooltip: {
          headerFormat: '<table>',
          // pointFormat: '<tr><td>ביחידה</td><td><b>{point.fullSize:.1f}</b></td><td>מתוך</td><td><b>{point.y:.1f}</b></td></tr>',
          // tslint:disable-next-line: object-literal-shorthand
          pointFormatter: function() {
            return `<span style="direction:rtl;"><b>${this.y.toFixed(2)} <span style="color: rgb(124, 181, 236); font-weight: bold;">:כמות אנשים</span></b></span>`;
          },
          footerFormat: '</table>',
          useHTML: true
        },
      }]
    }
  }
}
