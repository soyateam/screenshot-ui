import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.css']
})
export class TreemapComponent implements OnInit {

  public tasks: any;
  public forceOpTasks: any;
  public buildForceTasks: any;
  public wrapTasks: any;

  constructor(public dialogRef: MatDialogRef<TreemapComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.tasks = data;
  }


  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
