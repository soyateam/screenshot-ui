import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTaskDialogComponent } from 'src/app/modules/tasks/components/sub-task-dialog/sub-task-dialog.component';
import { SharedService } from 'src/app/core/http/shared.service';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { HierarchyService } from 'src/app/core/http/hierarchy.service';

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
              private hierarchyService: HierarchyService,
              @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit(): void {
  }
  close(): void {
    this.dialogRef.close();
  }

  async addGroup(group) {
    // Get all the group's children
    const allGroupChildrens = await this.hierarchyService.getAllGroupsByParentId(group.kartoffelID).toPromise();
    const filterdGroupChildren = allGroupChildrens.map((child) => {
      return {
        id: child.kartoffelID,
        name: child.name 
      }
    });

    // Unifies the ancestors and children of the selected group    
    const allRelatedGroups = [ ...group.groupsAssignAbove, ...filterdGroupChildren ];

    // Add all the above ancestors and children of the group 
    for (const currGroup of allRelatedGroups) {
      const foundGroup = this.data.task.groups.find(item => currGroup.id === item.id);
      if (!foundGroup) {
        try {
          const result = await this.sharedService.assignGroup({
            taskId: this.data.task._id,
            group: { name: currGroup.name, id: currGroup.id },
            isClicked: false,
            isCountGrow: true,
          }).toPromise();
        } catch (err) {
          this.snackBarService.open(err.message, 'סגור');
        }
      }
    }

    const newGroup = {name: group.name, id: group.kartoffelID};
    const found = this.data.task.groups.find(item => group.kartoffelID === item.id);
    if (!found) {
      try {
        const result = await this.sharedService.assignGroup({
          taskId: this.data.task._id,
          group: newGroup,
          isClicked: true,
          isCountGrow: true
        }).toPromise();

        if (result) {
          this.data.task.groups.push(newGroup);
          this.snackBarService.open('קבוצה שויכה בהצלחה', 'סגור');
        }
      } catch (err) {
        this.snackBarService.open(err.message, 'סגור');
      }
    }
  }

  removeGroup(group) {
    const found = this.data.task.groups.find(item => group.id === item.id);
    if (found) {
      this.sharedService.assignGroup({
        taskId: this.data.task._id,
        group: { name: group.name, id: group.id },
        isCountGrow: false,
      }).subscribe((result) => {
        if (result) {
          this.data.task.groups = this.data.task.groups.filter((item) => item.id !== group.id);
          this.snackBarService.open('קבוצה נמחקה בהצלחה', 'סגור');
        }
      });
    }
  }
}
