import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.css']
})
export class PieGraphComponent implements OnInit {
  @Input('graphType') graphType: string;

  private drilldownTooltip = {
    headerFormat: '<table>',
    pointFormat: '<tr><td><b>{point.total:.1f}</b></td><td>מתוך</td><td><b>{point.y:.1f}</b></td></tr>',
    footerFormat: '</table>',
    useHTML: true
  };

  public options: any = {
    lang: {
      drillUpText: `<  חזור ליחידות`
    },
    chart: {
        type: 'pie'
    },
    title: {
        text: 'משימה בלה בלה'
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
        pointFormatter: function () {
          return `<tr><td>מתוך סך היחידה</td><td><b>${Math.round((this.y / this.fullSize) * 100)}%</b></td></tr>`;
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
  }
  
  constructor(private sharedService:SharedService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    const taskId = this.route.snapshot.paramMap.get('id');
    console.log(this.graphType)
    this.sharedService.getStats(taskId, this.graphType).subscribe((result)=>{
        this.createChart(result);
    })
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
