import { Component, OnInit } from '@angular/core';
import { SubTaskDialogComponent } from '../sub-task-dialog/sub-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../core/http/task.service';
import { GroupDialogComponent } from 'src/app/modules/group/components/group-dialog/group-dialog.component';
import { UserService } from '../../../../core/services/user.service';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { SnackBarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  parentTaskId;
  ancestors;
  ancestorsDetails = [];
  parentTask;
  tasks;
  isUserCanWrite: boolean;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService,
              private userService: UserService, private snackBarService: SnackBarService) {
    this.route.paramMap.subscribe( (pathParams) => {
      this.parentTaskId = pathParams.get('id');

      this.taskService.getTask(this.parentTaskId).subscribe(async (parentTask) => {
        this.ancestorsDetails = [];
        this.parentTask = parentTask;
        this.parentTask.ancestors.reverse();
        let data;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.parentTask.ancestors.length; i++) {
          data = await this.taskService.getTask(this.parentTask.ancestors[i]).toPromise();
          if (data) {
            this.ancestorsDetails.push(data);
          }

          data = null;
        }
      });

      this.taskService.getTasksByParentId(this.parentTaskId).subscribe(tasks => this.tasks = tasks ? tasks.tasks : []);
    });
  }

  ngOnInit(): void {
    this.isUserCanWrite = this.userService.isUserCanWrite;
    // this.taskService.getTask(this.parentTaskId).subscribe(parentTask => this.parentTask = parentTask);
    // const id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * Add subtask
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(SubTaskDialogComponent, {
      width: '400px',
      height: '280px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result !== undefined && result.name !== '') {
      this.taskService.addTask({task: {
          parent: this.parentTaskId,
          type: this.parentTask.type,
          name: result.name,
          description: result.description
        }
        })
      .subscribe(task => {
        if (task) {
          const newTask = {...task, subTasksCount: 0};
          this.tasks = [...this.tasks, newTask];
          this.snackBarService.open('המשימה הִתְוָוסְּפָה בהצלחה', 'סגור');
        }
      });
    }
    });
  }

  deleteTask(taskToDelete): void {
    this.taskService.deleteTask(taskToDelete).subscribe((data) => {
      if (data) {
        this.tasks = this.tasks.filter(task => task._id !== taskToDelete._id);
        this.snackBarService.open('המשימה נמחקה בהצלחה', 'סגור');
      }
    });
  }

  async editTask(task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '400px',
      height: '280px',
      data: {
        task
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result && result.name) {
      const updatedTask = await this.taskService.updateTask(result).toPromise();

      if (updatedTask) {
        for (const currTaskIndex in this.tasks) {
          if (updatedTask._id === this.tasks[currTaskIndex]._id) {
            this.tasks[currTaskIndex] = updatedTask;
            this.snackBarService.open('המשימה עודכנה בהצלחה', 'סגור');
          }
        }
      }
    }
  }

  openGroupDialog(task): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '1000px',
      height: '660px',
      data: {task}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result !== undefined && result.name !== '') {

      }
    });
  }
}
