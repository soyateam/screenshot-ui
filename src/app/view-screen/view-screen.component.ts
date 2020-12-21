import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../core/http/shared.service';
import { DashboardComponent } from '../modules/statistics/dashboard/dashboard.component';

const taskKeys = {
  opForce: 'הפעלת כוח',
  buildForce: 'יכולות',
  wrap: 'מעטפת',
  width: 'רוחב'
}

@Component({
  selector: 'app-view-screen',
  templateUrl: './view-screen.component.html',
  styleUrls: ['./view-screen.component.css']
})
export class ViewScreenComponent implements OnInit {
  defaultParentNew = '5f4cc73b4201366c45b83925'; // amn
  forceOpTasks: any;
  buildForceTasks: any;
  wrapTasks: any;
  widthTasks: any;
  finishedLoading = false;
  fullSize: any;

  constructor(private dialog: MatDialog,
              private sharedService: SharedService) { }

  async ngOnInit() {
    const fullView = await this.sharedService.getView().toPromise();
    
    this.fullSize = fullView.fullSize;
    this.forceOpTasks = fullView[taskKeys.opForce];
    this.buildForceTasks = fullView[taskKeys.buildForce];
    this.wrapTasks = fullView[taskKeys.wrap];
    this.widthTasks = fullView[taskKeys.width];
    this.finishedLoading = true;
  }

  taskStatistics(givenTask: any) {
    const dialogRef = this.dialog.open(DashboardComponent, {
      width: '1300px',
      height: '881px',
      data: {
        task: givenTask
      }
    });
  }

}
