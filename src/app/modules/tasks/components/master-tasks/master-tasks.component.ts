import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-master-tasks',
  templateUrl: './master-tasks.component.html',
  styleUrls: ['./master-tasks.component.css']
})
export class MasterTasksComponent implements OnInit {
  selectedView = 0;
  originalMasterTasks = [
    {
      name:"אוסטרליה",
      viewGroup: 0,
      tasksCount: 2,
      id:1,
    },
    {
      name:"יוון",
      viewGroup: 0,
      tasksCount: 2,
      id:2,
    },
    {
      name:"דרום אפריקה",
      viewGroup: 1,
      tasksCount: 2,
      id:3,
    },
  ]
  masterTasks = [...this.originalMasterTasks];

  constructor(public dialog: MatDialog) {
    this.masterTasks = [...this.originalMasterTasks];
   }

  ngOnInit(): void {
    this.masterTasks = this.originalMasterTasks.filter(task => task.viewGroup == this.selectedView);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '30%',
      height:'30%',
      data: {name: '',viewGroup: this.selectedView}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    if(result != undefined && result != ''){
      this.originalMasterTasks = [...this.originalMasterTasks,{
        name:result.name,
        viewGroup: result.viewGroup,
        tasksCount: 2,
        id:5
      }]
      this.masterTasks = this.originalMasterTasks.filter(task => task.viewGroup == this.selectedView);
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.originalMasterTasks = this.originalMasterTasks.filter(task => task.id !== taskToDelete.id);
    this.masterTasks = this.originalMasterTasks.filter(task => task.viewGroup == this.selectedView);
  }

  onChange(event):void{
    this.masterTasks = this.originalMasterTasks.filter(task => task.viewGroup == event.value);
  }

}
