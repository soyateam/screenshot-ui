import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
@Component({
  selector: 'app-master-tasks',
  templateUrl: './master-tasks.component.html',
  styleUrls: ['./master-tasks.component.css']
})
export class MasterTasksComponent implements OnInit {

   masterTasks = [
    {
      name:"אוסטרליה",
      BuildForce: true,
      tasksCount: 2
    },
    {
      name:"יוון",
      BuildForce: true,
      tasksCount: 2
    },
    {
      name:"דרום אפריקה",
      BuildForce: true,
      tasksCount: 2
    },
    
  ]

  task = {
    name:'',
    BuildForce:undefined
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '250px',
      data: this.task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      this.task = {
        name:'',
        BuildForce:undefined
    }
    if(result != undefined && result != ''){
      this.masterTasks = [...this.masterTasks,{
        name:result,
        BuildForce: true,
        tasksCount: 2
      }]}
    });
  }

}
