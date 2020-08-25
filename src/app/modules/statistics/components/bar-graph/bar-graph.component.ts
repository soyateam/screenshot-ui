import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/core/http/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements OnInit {
  @Input('graphType') graphType: string;
  public options: any = {
    chart: {
        type: 'column'
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
    	labelFormatter: function() {
        let sum = this.yData.reduce(function(pv, cv) { return pv + cv; }, 0);
        return '('+ Math.floor(sum) + ') ' + this.name;   
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
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
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
}

  constructor(private sharedService:SharedService, private route: ActivatedRoute) {
    this.options.title.text = this.route.snapshot.paramMap.get('name');
   }

  ngOnInit(): void {
    //console.log(this.graphType)
  }
  ngOnChanges(changes: SimpleChanges) {
    const taskId = this.route.snapshot.paramMap.get('id');
    this.sharedService.getStats(taskId, this.graphType).subscribe((result)=>{
        this.createChart(result);
    })
  }

  createChart(data){
    this.options = {...this.options,
         xAxis:{categories:data.categories},
         series: data.series
        }
  }
}
