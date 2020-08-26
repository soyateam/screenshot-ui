import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../../../core/http/task.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-master-tasks',
  templateUrl: './master-tasks.component.html',
  styleUrls: ['./master-tasks.component.css']
})
export class MasterTasksComponent implements OnInit {
  selectedView = 0;
  masterTasks = [];
  isUserCanWrite: boolean;

  constructor(public dialog: MatDialog, private taskService: TaskService,
              private userService: UserService) { }

  ngOnInit() {
    this.isUserCanWrite = this.userService.isUserCanWrite;
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks(this.selectedView)
    .subscribe(tasks => {
      if (tasks) {
        this.masterTasks = tasks;
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      height: '270px',
      data: {name: '', viewGroup: this.selectedView}
    });

    dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined && result.name !== '') {
      this.taskService.addTask({task: {type: result.viewGroup ? 'BuildForce' : 'OperativeForce', name: result.name}})
      .subscribe(task => {
        if (task) {
          const newTask = {...task, subTasksCount: 0};
          this.masterTasks = [...this.masterTasks, newTask];
        }
      });
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe(() => {
      this.masterTasks = this.masterTasks.filter(task => task._id !== taskToDelete._id);
    });

  }

  onChange(event): void {
    this.getTasks();
  }

}
