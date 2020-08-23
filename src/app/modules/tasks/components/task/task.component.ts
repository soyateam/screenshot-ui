import { Component, OnInit } from '@angular/core';
import { SubTaskDialogComponent } from '../sub-task-dialog/sub-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../core/http/task.service';
import { GroupDialogComponent } from 'src/app/modules/group/components/group-dialog/group-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  parentTaskId;
  parentTask = {name:'', type:''};
  tasks = [];

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService) { 
    this.route.paramMap
    .subscribe( (pathParams) => {
      this.parentTaskId = pathParams.get('id');
        this.taskService.getTasksByParentId(this.parentTaskId).subscribe(tasks => this.tasks = tasks? tasks.tasks: [])
    })
  }

  ngOnInit(): void {
    this.taskService.getTask(this.parentTaskId).subscribe(parentTask => this.parentTask = parentTask)
    // const id = this.route.snapshot.paramMap.get('id');
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
        task = {...task, subTasksCount:0}
         this.tasks = [...this.tasks, task]
      })
      console.log(result)
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe(() => {
      this.tasks = this.tasks.filter(task => task._id !== taskToDelete._id);
    })
  }

  openGroupDialog(task): void {
    console.log(task)
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '30%',
      data: {task}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    if(result != undefined && result.name != ''){

    }
    });
  }
}
