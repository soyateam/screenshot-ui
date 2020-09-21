import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.css']
})
export class PieGraphComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('graphType') graphType: string;

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
        backgroundColor: '#F5F5F5',
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
      name: 'יחידות',
      colorByPoint: true,
      data: []
    }],
    drilldown: {
        series: []
    }
  };

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
    this.options.title.text = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    const taskId = this.route.snapshot.paramMap.get('id');
    console.log(taskId);
    console.log(this.graphType);
    this.sharedService.getStats(taskId, this.graphType).subscribe((result) => {
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
    console.log(updatedSeries);
    console.log(updatedDrilldownSeries);
    this.options = {
      ...this.options,
      drilldown: { series: updatedDrilldownSeries },
      series: updatedSeries
    };
  }
}
