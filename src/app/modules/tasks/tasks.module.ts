import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterTasksComponent } from './components/master-tasks/master-tasks.component';
import { MaterialModule } from '../material/material.module';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './components/task/task.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SubTaskDialogComponent } from './components/sub-task-dialog/sub-task-dialog.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
    declarations: [MasterTasksComponent, AddTaskDialogComponent, TaskComponent, SubTaskDialogComponent, EditTaskDialogComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        AppRoutingModule,
        StatisticsModule
    ],
    exports: [MasterTasksComponent]
})
export class TaskModule { }
