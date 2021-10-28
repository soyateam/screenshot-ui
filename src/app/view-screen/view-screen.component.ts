import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../core/http/shared.service';
import { UserService } from '../core/services/user.service';
import { DashboardComponent } from '../modules/statistics/dashboard/dashboard.component';
import { TreemapComponent } from '../modules/statistics/treemap/treemap.component';

const FLAG_IMAGES = ['איראן.jpg', 'סוריה.jpg', 'איוש.jpg', 'לבנון.jpg', 'סוריה.jpg', 'רצע.jpg', 'מצרים.jpg', 'הסדרים.jpg'];

const taskKeys = {
  opForce: 'הפעלת כוח',
  buildForce: 'יכולות',
  wrap: 'מעטפת',
  // width: 'רוחב'
}

@Component({
  selector: 'app-view-screen',
  templateUrl: './view-screen.component.html',
  styleUrls: ['./view-screen.component.css']
})
export class ViewScreenComponent implements OnInit {
  fullAmanName: string = 'כלל אמ״ן';
  defaultParentNew = '5f4cc73b4201366c45b83925'; // amn
  errorImg: string;
  forceOpTasks: any;
  buildForceTasks: any;
  buildForceEmptyTasks: any;
  secondaryLoading = false;
  wrapTasks: any;
  // widthTasks: any;
  dateFilters: any;
  unitFilters: any;
  finishedLoading = false;
  isError = false;
  fullSize: any;
  mainFullSize: any;
  loadingValue = 0;
  interval;

  DEFAULT_FILTERS: any = {
    'זמן נוכחי': 'זמן נוכחי',
    'כל היחידות': 'כל היחידות',
  };

  taskForceOrder = [
    'איראן',
    'סוריה',
    'לבנון',
    'רצ"ע',
    'איו"ש',
    'מצרים',
  ];

  taskForceOrderNoEgypt = [
    'איראן',
    'סוריה',
    'לבנון',
    'רצ"ע',
    'איו"ש',
    'הסדרים',
  ];

  selectedDateFilter: any;
  selectedUnitFilter: any;
  selectedUnitFilterName: any;

  constructor(private dialog: MatDialog,
    private sharedService: SharedService,
    private userService: UserService) { }

  async ngOnInit() {
    try {
      const fullView = await this.sharedService.getView().toPromise();
      const recvDateFilters = await this.sharedService.getDateFilters().toPromise();
      const recvUnitNamesFilters = await this.sharedService.getUnitNamesFilters().toPromise();
      if (recvDateFilters && recvUnitNamesFilters && fullView) {
        this.dateFilters = ['זמן נוכחי', ...recvDateFilters];
        this.unitFilters = [{ name: 'כל היחידות', kartoffelID: this.DEFAULT_FILTERS['כל היחידות'] }, ...recvUnitNamesFilters];
        this.selectedDateFilter = this.DEFAULT_FILTERS['זמן נוכחי'];
        this.selectedUnitFilter = this.DEFAULT_FILTERS['כל היחידות'];
        this.selectedUnitFilterName = 'אמ"ן';
        this.initViewValues(fullView);
        this.finishedLoading = true;
      } else {
        if (!this.userService.expired()) {
          this.isError = true;
          this.errorImg = '/assets/500_error.png';
        }
      }
    } catch (err) {
      console.log(err);
      this.isError = true;
      if (err.indexOf('authorized') === -1 && err.indexOf('expired') === -1) {
        this.errorImg = '/assets/500_error.png'
      }
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
    this.mainFullSize = viewResults.mainFullSize;
    this.forceOpTasks = viewResults[taskKeys.opForce];
    this.buildForceTasks = viewResults[taskKeys.buildForce];
    this.wrapTasks = viewResults[taskKeys.wrap];
    // this.widthTasks = viewResults[taskKeys.width];
    this.forceOpTasks = this.orderForceOpTasks(this.forceOpTasks);
    this.buildForceTasks = this.sortTasks(this.buildForceTasks, true, true);
    this.wrapTasks = this.sortTasks(this.wrapTasks, false);
    this.buildForceEmptyTasks = this.buildForceTasks.children.filter((task) => task.children.length === 0);
    console.log(this.buildForceEmptyTasks);
    // this.widthTasks = this.sortTasks(this.widthTasks, false);

    for (let currIndex = 0; currIndex < this.forceOpTasks.children.length; currIndex++) {
      if (FLAG_IMAGES.indexOf(`${this.forceOpTasks.children[currIndex].name.replace(/[\"\']/g, '')}.jpg`) === -1) {
      } else {
        this.forceOpTasks.children[currIndex].image = `/assets/${this.forceOpTasks.children[currIndex].name.replace(/[\"\']/g, '')}.jpg`;
      }
    }

    for (let currIndex = 0; currIndex < this.forceOpTasks.children.length; currIndex++) {
      for (let currChildIndex = 0; currChildIndex < this.forceOpTasks.children[currIndex].children.length; currChildIndex++) {
        if (this.forceOpTasks.children[currIndex].children[currChildIndex].name === 'אחר') {
          this.forceOpTasks.children[currIndex].children.push(this.forceOpTasks.children[currIndex].children.splice(currChildIndex, 1)[0]);
          break;
        }
      }
    }
  }

  sortTasks(tasks, isSubChildren, sortByChildren = false) {
    tasks.children;

    tasks.children.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    if (sortByChildren) {
      tasks.children.sort((a, b) => (a.children.length > b.children.length) ? -1 : ((a.children.length < b.children.length) ? 1 : 0))
    }

    if (isSubChildren) {
      for (let currChildrenIndex = 0; currChildrenIndex < tasks.children.length; currChildrenIndex++) {
        tasks.children[currChildrenIndex].children.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
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
    this.secondaryLoading = true;
    this.initViewValues(await this.getViewValues());
    this.secondaryLoading = false;
  }

  async changeUnitFilter() {
    this.secondaryLoading = true;
    this.initViewValues(await this.getViewValues());
    if (this.selectedUnitFilter !== 'כל היחידות') {
      this.selectedUnitFilterName = this.unitFilters.find((unit: any) => unit.kartoffelID === this.selectedUnitFilter).name;

    } else {
      this.selectedUnitFilterName = 'אמ"ן';
    }
    this.secondaryLoading = false;
  }

  orderForceOpTasks(tasks: any) {
    let orderedTasks = { ...tasks, children: [] };

    if (tasks.children.find((elem: any) => elem.name === 'מצרים')) {
      for (let name of this.taskForceOrder) {
        for (let task of tasks.children) {
          if (task.name === name) {
            orderedTasks.children.push(task);
            break;
          }
        }
      }
    } else if (tasks.children.find((elem: any) => elem.name === 'הסדרים')) {
      for (let name of this.taskForceOrderNoEgypt) {
        for (let task of tasks.children) {
          if (task.name === name) {
            orderedTasks.children.push(task);
            break;
          }
        }
      }
    } else {
      orderedTasks = this.sortTasks(tasks, true);
    }

    for (let currChildrenIndex = 0; currChildrenIndex < orderedTasks.children.length; currChildrenIndex++) {
      orderedTasks.children[currChildrenIndex].children.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }

    return orderedTasks;
  }

  showTableChart() {
    this.dialog.open(
      TreemapComponent,
      {
        width: '1300px',
        height: '881px',
        data: {
          forceOpTasks: this.forceOpTasks,
          buildForceTasks: this.buildForceTasks,
          wrapTasks: this.wrapTasks,
        }
      }
    );
  }

}
