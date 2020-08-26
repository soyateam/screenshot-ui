import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTaskDialogComponent } from 'src/app/modules/tasks/components/sub-task-dialog/sub-task-dialog.component';
import { SharedService } from 'src/app/core/http/shared.service';
import { SnackBarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  selectedGroup;
  constructor(public dialogRef: MatDialogRef<SubTaskDialogComponent>,
              private sharedService: SharedService,
              private snackBarService: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit(): void {
  }
  close(): void {
    this.dialogRef.close();
  }

  addGroup(group) {
    const newGroup = {name: group.name, id: group.kartoffelID};
    const found = this.data.task.groups.find(item => group.kartoffelID === item.id);
    if (!found) {
      this.sharedService.assignGroup({taskId: this.data.task._id, group: newGroup, isCountGrow: true}).subscribe((result) => {
       if (result) {
          this.data.task.groups.push(newGroup);
          this.snackBarService.open('קבוצה שויכה בהצלחה', 'סגור');
       }
      });
    }
  }

  removeGroup(group) {
    const found = this.data.task.groups.find(item => group.id === item.id);
    if (found) {
      this.sharedService.assignGroup({taskId: this.data.task._id, group, isCountGrow: false}).subscribe((result) => {
        if (result) {
          this.data.task.groups = this.data.task.groups.filter((item) => item.id !== group.id);
          this.snackBarService.open('קבוצה נמחקה בהצלחה', 'סגור');
        }
      });
    }
  }
}
