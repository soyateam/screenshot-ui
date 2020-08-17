import { Component, OnInit } from '@angular/core';
import { SubTaskDialogComponent } from '../sub-task-dialog/sub-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../core/http/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  parentTaskId;
  parentTask;
  tasks = [];

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService) { 
    this.route.paramMap
    .subscribe( (pathParams) => {
      this.parentTaskId = pathParams.get('id');
        console.log(this.parentTaskId);
        this.taskService.getTasksByParentId(this.parentTaskId).subscribe(tasks => this.tasks = tasks? tasks.tasks: [])
    })
  }

  ngOnInit(): void {
    this.taskService.getTask(this.parentTaskId).subscribe(parentTask => this.parentTask = parentTask)
    // const id = this.route.snapshot.paramMap.get('id');
    // console.log(id);
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
      this.taskService.addTask({task:{
          parent: this.parentTaskId,
          type: this.parentTask.type,
          name: result.name,
          description: result.description
        }
        })
      .subscribe(task => {
        console.log(task);
         this.tasks = [...this.tasks, task]
      })
      console.log(result)
    }
    });
  }
  a(){
    this.ngOnInit();
  }
  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe(() => {
      this.tasks = this.tasks.filter(task => task._id !== taskToDelete._id);
    })
  }
}
