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

  async getAllAncestorsData(ancestors) {
    const allAncestors = [];
    for (const ancestorId of ancestors) {
      const group = await this.hierarchyService.getGroup(ancestorId).toPromise()
      allAncestors.push(group);
    }

    return allAncestors;
  }

  async removeGroup(group) {
    // Get all the groups data
    const selectedGroup = await this.hierarchyService.getGroup(group.id).toPromise();
    // Remove the aman ancestor from the groups
    if (selectedGroup.ancestors) selectedGroup.ancestors.splice(selectedGroup.ancestors - 1, 1);

    const allGroupAncestors = selectedGroup.ancestors.length ? await this.getAllAncestorsData(selectedGroup.ancestors) : [];
    const allGroupChildrens = await this.hierarchyService.getAllGroupsByParentId(group.id).toPromise();
    
    if (selectedGroup) {
      const originalGroupsLength = this.data.task.groups.length,
            allGroupsToRemoved = [selectedGroup, ...allGroupAncestors, ...allGroupChildrens];
      
      for (const groupToRemoved of allGroupsToRemoved) {
        try {
          const res = await this.sharedService.assignGroup({
            taskId: this.data.task._id,
            group: { name: groupToRemoved.name, id: groupToRemoved.kartoffelID },
            isCountGrow: false,
          }).toPromise();

          if (!res) {
            throw new Error('המשימה לא קיימת!');
          }
  
          // Remove the current group from the data tasks
          this.data.task.groups = this.data.task.groups.filter((item) => item.id !== groupToRemoved.kartoffelID);
        } catch (err) {
          this.snackBarService.open(err.message, 'סגור');
        }
      }

      // Checks if the removed operation was successful 
      if (originalGroupsLength > this.data.task.groups.length) {
        this.snackBarService.open('הקבוצה וכל הקבוצות המשויכות אליה נמחקו בהצלחה', 'סגור');
      }
    }
  }
}
