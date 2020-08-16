import { Component, OnInit } from '@angular/core';
import { SubTaskDialogComponent } from '../sub-task-dialog/sub-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks = [
    {
      name:"אוסטרליה",
      description: 'yfuj',
      tasksCount: 2,
      id:1,
    },
    {
      name:"יוון",
      description: 'fghfh',
      tasksCount: 2,
      id:2,
    },
    {
      name:"דרום אפריקה",
      description: 'fghgfh',
      tasksCount: 2,
      id:3,
    },
  ]
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(SubTaskDialogComponent, {
      width: '30%',
      height:'30%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    if(result != undefined && result.name != ''){
      this.tasks = [...this.tasks, {
        name:result.name,
        description:result.description,
        id:new Date().getTime(),
        tasksCount:3
      }]
      console.log(result)
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
  }
}
