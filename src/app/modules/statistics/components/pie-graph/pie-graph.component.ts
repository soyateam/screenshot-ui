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
  public options: any ={
    chart: {
        type: 'pie'
    },
    title: {
        text: 'משימה בלה בלה'
    },
    subtitle: {
        // text: 'חיתוך לפי כמות אנשים ביחידות'
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [],
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

  createChart(data){
    this.options = {...this.options, 
        drilldown:{series:data.drilldownSeries},
        series: [{data: data.mainSeries}] 
    }
  }
}
