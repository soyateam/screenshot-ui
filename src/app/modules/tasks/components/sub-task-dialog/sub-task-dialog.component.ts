import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-sub-task-dialog',
  templateUrl: './sub-task-dialog.component.html',
  styleUrls: ['./sub-task-dialog.component.css']
})
export class SubTaskDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SubTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
