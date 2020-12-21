import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Axis } from 'highcharts';

@Component({
  selector: 'app-linear-graph',
  templateUrl: './linear-graph.component.html',
  styleUrls: ['./linear-graph.component.css']
})

export class LinearGraphComponent {

  public options = {
    tooltip: {
      enabled: false
    },
    plotOptions: {
      series: {
          states: {
              hover: {
                  enabled: false
              }
          },
          dataLabels: {
            enabled: true
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
       categories: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
       labels: {
         style: {
           fontSize: '13px'
         }
       }
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
    series: [{
       name: 'כמות אנשים',
       data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }]
 };

  constructor(private sharedService: SharedService, private route: ActivatedRoute) {
  }
}
