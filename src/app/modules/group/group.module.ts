import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupTreeComponent } from './components/group-tree/group-tree.component';
import { MaterialModule } from '../material/material.module';
import { GroupDialogComponent } from './components/group-dialog/group-dialog.component';


@NgModule({
    declarations: [GroupTreeComponent, GroupDialogComponent],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: []
})
export class GroupModule { }