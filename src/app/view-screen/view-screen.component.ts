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
  errorImg: string;
  forceOpTasks: any;
  buildForceTasks: any;
  wrapTasks: any;
  widthTasks: any;
  dateFilters: any;
  unitFilters: any;
  finishedLoading = false;
  isError = false;
  fullSize: any;
  loadingValue = 0;
  interval;

  DEFAULT_FILTERS: any = {
    'זמן נוכחי': 'זמן נוכחי',
    'כל היחידות': 'כל היחידות',
  };

  selectedDateFilter: any;
  selectedUnitFilter: any;

  constructor(private dialog: MatDialog,
              private sharedService: SharedService) { }

  async ngOnInit() {
    try {
      const fullView = await this.sharedService.getView().toPromise();
      const recvDateFilters = await this.sharedService.getDateFilters().toPromise();  
      const recvUnitNamesFilters = await this.sharedService.getUnitNamesFilters().toPromise(); 
      this.dateFilters = ['זמן נוכחי', ...recvDateFilters];
      this.unitFilters = [{ name: 'כל היחידות', kartoffelID: this.DEFAULT_FILTERS['כל היחידות'] }, ...recvUnitNamesFilters];    
      this.selectedDateFilter = this.DEFAULT_FILTERS['זמן נוכחי'];
      this.selectedUnitFilter = this.DEFAULT_FILTERS['כל היחידות'];
      this.initViewValues(fullView);
      this.finishedLoading = true;
    } catch (err) {
      this.isError = true;
      this.errorImg = '/assets/500_error.png'
    }
  }

  taskStatistics(givenTask: any) {
    const dialogRef = this.dialog.open(DashboardComponent, {
      width: '1300px',
      height: '881px',
      data: {
        task: givenTask,
        date: this.selectedDateFilter === this.DEFAULT_FILTERS['זמן נוכחי'] ? null : this.selectedDateFilter,
        unit: this.selectedUnitFilter === this.DEFAULT_FILTERS['כל היחידות'] ? null : this.selectedUnitFilter
      }
    });
  }

  initViewValues(viewResults: any) {    
    this.fullSize = viewResults.fullSize;
    this.forceOpTasks = viewResults[taskKeys.opForce];
    this.buildForceTasks = viewResults[taskKeys.buildForce];
    this.wrapTasks = viewResults[taskKeys.wrap];
    this.widthTasks = viewResults[taskKeys.width];
    this.forceOpTasks = this.sortTasks(this.forceOpTasks, true);
    this.buildForceTasks = this.sortTasks(this.buildForceTasks, true);
    this.wrapTasks = this.sortTasks(this.wrapTasks, false);
    this.widthTasks = this.sortTasks(this.widthTasks, false);
  }

  sortTasks(tasks, isSubChildren) {
    tasks.children;

    tasks.children.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    if (isSubChildren) {
      for (let currChildrenIndex = 0; currChildrenIndex < tasks.children.length; currChildrenIndex++) {
        tasks.children[currChildrenIndex].children.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      }
    }

    return tasks;
  }

  async getViewValues() {
    const dateFilter = this.selectedDateFilter === this.DEFAULT_FILTERS['זמן נוכחי'] ? null : this.selectedDateFilter;
    const unitFilter = this.selectedUnitFilter === this.DEFAULT_FILTERS['כל היחידות'] ? null : this.selectedUnitFilter;

    return await this.sharedService.getView(dateFilter, unitFilter).toPromise();
  }

  async changeDateFilter() {
    this.finishedLoading = false;
    this.initViewValues(await this.getViewValues());
    this.finishedLoading = true;
  }

  async changeUnitFilter() {
    this.finishedLoading = false;
    this.initViewValues(await this.getViewValues());
    this.finishedLoading = true;
  }

}
