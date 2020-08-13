import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterTasksComponent } from './components/master-tasks/master-tasks.component';
import { MaterialModule } from '../material/material.module';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MasterTasksComponent, AddTaskDialogComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule
    ],
    exports: [MasterTasksComponent]
})
export class TaskModule { }