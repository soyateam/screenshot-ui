import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTaskDialogComponent } from 'src/app/modules/tasks/components/sub-task-dialog/sub-task-dialog.component';
import { Group } from 'src/app/shared/models/group.model';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  selectedGroup = new Set();
  constructor(public dialogRef: MatDialogRef<SubTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  addGroup(group){
    this.data.groups.add(group)
  }

  removeGroup(group){
    this.data.groups.delete(group)
  }
}
