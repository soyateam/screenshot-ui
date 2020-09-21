import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../../../core/http/task.service';
import { UserService } from '../../../../core/services/user.service';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { SnackBarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-master-tasks',
  templateUrl: './master-tasks.component.html',
  styleUrls: ['./master-tasks.component.css']
})
export class MasterTasksComponent implements OnInit {
  selectedView = 0;
  masterTasks;
  isUserCanWrite: boolean;

  constructor(public dialog: MatDialog, private taskService: TaskService,
              private userService: UserService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.isUserCanWrite = this.userService.isUserCanWrite;
    if (window.location.pathname === '/tasks') {
       window.location.href = '/task/5f4cc73b4201366c45b83925';
    }
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

  async editTask(task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '400px',
      height: '210px',
      data: {
        task
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result && result.name) {
      const updatedTask = await this.taskService.updateTask(result).toPromise();

      if (updatedTask) {
        for (const currTaskIndex in this.masterTasks) {
          if (updatedTask._id === this.masterTasks[currTaskIndex]._id) {
            if (task.type !== updatedTask.type) {
              this.masterTasks.splice(currTaskIndex as any, 1);
            } else {
              this.masterTasks[currTaskIndex] = updatedTask;
            }

            this.snackBarService.open('המשימה עודכנה בהצלחה', 'סגור');
            break;
          }
        }
      }
    }
  }

  /**
   * Add master-task
   */
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
          let displayView;

          this.selectedView === 0 ? displayView = 'OperativeForce' : displayView = 'BuildForce';

          if (newTask.type === displayView) {
            this.masterTasks = [...this.masterTasks, newTask];
            this.snackBarService.open('המשימה הִתְוָוסְּפָה בהצלחה', 'סגור');
          }
        }
      });
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe((data) => {
      if (data) {
        this.masterTasks = this.masterTasks.filter(task => task._id !== taskToDelete._id);
        this.snackBarService.open('המשימה נמחקה בהצלחה', 'סגור');
      }
    });

  }

  onChange(event): void {
    this.getTasks();
  }

}
