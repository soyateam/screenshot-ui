import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../../../core/http/task.service';

@Component({
  selector: 'app-master-tasks',
  templateUrl: './master-tasks.component.html',
  styleUrls: ['./master-tasks.component.css']
})
export class MasterTasksComponent implements OnInit {
  selectedView = 0;
  masterTasks = [];

  constructor(public dialog: MatDialog, private taskService: TaskService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void{
    this.taskService.getTasks(this.selectedView)
    .subscribe(tasks => {
      this.masterTasks = tasks
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '30%',
      height:'30%',
      data: {name: '',viewGroup: this.selectedView}
    });

    dialogRef.afterClosed().subscribe(result => {
    if(result != undefined && result.name != ''){
      this.taskService.addTask({task:{type: result.viewGroup ?'BuildForce' : 'OperativeForce', name: result.name}})
      .subscribe(task => {
        console.log(task);
         this.masterTasks = [...this.masterTasks, task]
      })
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe(() => {
      this.masterTasks = this.masterTasks.filter(task => task._id !== taskToDelete._id);
    })
   
  }

  onChange(event):void{
    this.getTasks();
  }

}
