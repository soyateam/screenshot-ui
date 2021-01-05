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
      headerFormat: '<div style="font-size:12px; font-weight:bold; text-align:center;">{point.key}</div><table style="direction:rtl; text-align:center;">',
      pointFormat:  '<tr><td style="color:{series.color};padding:0;font-weight:bold; font-size:12px;">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    lang: {
      noData: ''
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
    series: [] as any,
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
        name: 'כמות אנשים',
        data: data.series,
        tooltip: {
        },
      }]
    }
  }
}
