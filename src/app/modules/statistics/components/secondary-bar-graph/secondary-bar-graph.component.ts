import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-secondary-bar-graph',
  templateUrl: './secondary-bar-graph.component.html',
  styleUrls: ['./secondary-bar-graph.component.css']
})
export class SecondaryBarGraphComponent implements OnInit, OnChanges {
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

  public titleTexts = ['תת קבוצות מתוך - ', 'תת משימות מתוך - '];
  public yAxisTexts = ['כמות משימות', 'כמות אנשים'];
  public options: any = {
    lang: {
      noData: 'לא קיימים נתונים להצגת הגרף'
    },
    chart: {
        type: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0)',
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
            text: 'כמות אנשים'
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
        }
    },
    series: []
};

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
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
    let taskId;

    if (!!this.getFromDashboard) {
      this.options.yAxis.title.text = (this.onUnitTaskCount ? this.yAxisTexts[0] : this.yAxisTexts[1]);
      if (this.name && this.id) {
        this.options.title.text = (this.onUnitTaskCount ? this.titleTexts[0] : this.titleTexts[1]) + this.name;
        taskId = this.id;
      } else {
        this.options.title.text = '';
      }
    } else {
      taskId = this.route.snapshot.paramMap.get('id');
    }

    // tslint:disable-next-line: max-line-length
    this.sharedService.getStats(taskId, this.graphType, !!this.getFromDashboard, (this.onUnitTaskCount ? this.parentGroupId : null)).subscribe((result) => {
        this.createChart(result);
    });
  }

  createChart(data) {
    let categoryNames = [];

    if (!!this.getFromDashboard) {
      for (const currCategory of data.categories) {
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
