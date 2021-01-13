import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTaskDialogComponent } from 'src/app/modules/tasks/components/sub-task-dialog/sub-task-dialog.component';
import { SharedService } from 'src/app/core/http/shared.service';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { HierarchyService } from 'src/app/core/http/hierarchy.service';
import { TaskService } from 'src/app/core/http/task.service';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  selectedGroup;
  isAssigning: boolean;
  isLoading: boolean;

  constructor(public dialogRef: MatDialogRef<SubTaskDialogComponent>,
              private sharedService: SharedService,
              private snackBarService: SnackBarService,
              private hierarchyService: HierarchyService,
              private taskService: TaskService,
              @Inject(MAT_DIALOG_DATA) public data) {
    }

  ngOnInit(): void {
  }
  close(): void {
    this.dialogRef.close();
  }

  /**
   * 
   * @param group 
   */
  async addGroup(group) {
    this.isAssigning = true;

    const result = await this.sharedService.assignGroups(group.kartoffelID, this.data.task._id, true).toPromise();

    if (result) {
      this.data.task.groups.push({ name: group.name, id: group.kartoffelID, isClicked: true });
    }
    
    this.isAssigning = false;
    /*
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
          if (result) {
            this.data.task.groups.push({ name: currGroup.name, id: currGroup.id, isClicked: false });
          } else {
            this.isAssigning = false;
          }
        } catch (err) {
          this.isAssigning = false;
          this.snackBarService.open(err.message, 'סגור');
        }
      }
    }

    const newGroup = {name: group.name, id: group.kartoffelID, isClicked: true};
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
          this.isAssigning = false;
          this.data.task.groups.push(newGroup);
          this.snackBarService.open('קבוצה שויכה בהצלחה', 'סגור');
        } else {
          this.isAssigning = false;
        }
      } catch (err) {
        this.isAssigning = false;
        this.snackBarService.open(err.message, 'סגור');
      }
    } else {
      for (let currGroupIndex = 0; currGroupIndex < this.data.task.groups.length; currGroupIndex++) {
        if (this.data.task.groups[currGroupIndex].id === group.kartoffelID) {
          if (!this.data.task.groups[currGroupIndex].isClicked) {
            this.data.task.groups[currGroupIndex].isClicked = true;
            await this.taskService.updateTask(this.data.task, this.data.task.groups[currGroupIndex].id).toPromise();
          }
          break;
        }
      }
    }*/
  }

  async getAllAncestorsData(ancestors) {
    const allAncestors = [];
    for (const ancestorId of ancestors) {
      const group = await this.hierarchyService.getGroup(ancestorId).toPromise()
      allAncestors.push(group);
    }

    return allAncestors;
  }

  toggleLoading(isLoading):void {
    this.isLoading = isLoading;
  }

  async removeGroup(group) {
    this.isAssigning = true;

    const result = this.sharedService.assignGroups(group.kartoffelID, this.data.task._id, false).toPromise();

    if (result) {
      this.data.task.groups = result;
    }

    this.isAssigning = false;
    // // Get all the groups data
    // const selectedGroup = await this.hierarchyService.getGroup(group.id).toPromise();
    // // Remove the aman ancestor from the groups
    // if (selectedGroup.ancestors) selectedGroup.ancestors.splice(selectedGroup.ancestors.length - 1, 1);

    // const allGroupChildrens = await this.hierarchyService.getAllGroupsByParentId(group.id).toPromise();
    
    // if (selectedGroup) {
    //   const originalGroupsLength = this.data.task.groups.length;
      
    //   // Remove all the children of the specified group.
    //   for (const groupToRemoved of allGroupChildrens) {
    //     const found = this.data.task.groups.find(item => groupToRemoved.kartoffelID === item.id);
    //     if (found) {
    //       await this.removeGroupFromTask(groupToRemoved);
    //     }
    //   }

    //   // Remove the group itself.
    //   await this.removeGroupFromTask(selectedGroup);

    //   // Remove the needed ancestors of the group.
      
    //   let isAncestorChildEmpty;

    //   for (let currAncestorIndex = 0; currAncestorIndex < selectedGroup.ancestors.length; currAncestorIndex++) {
    //     isAncestorChildEmpty = true;

    //     const currAncestorGroup = await this.hierarchyService.getGroup(selectedGroup.ancestors[currAncestorIndex]).toPromise();
        
    //     for (let currChildIndex = 0; currChildIndex < currAncestorGroup.children.length; currChildIndex++) {
    //         for (let currTaskGroupIndex = 0; currTaskGroupIndex < this.data.task.groups.length; currTaskGroupIndex++) {
    //           if (this.data.task.groups[currTaskGroupIndex].id === currAncestorGroup.children[currChildIndex]) {
    //             isAncestorChildEmpty = false;
    //             break;
    //           }
    //         }
    //     }

    //     if (isAncestorChildEmpty) {
    //       const found = this.data.task.groups.find(item => currAncestorGroup.kartoffelID === item.id);
    //       if (found) {
    //         await this.removeGroupFromTask(currAncestorGroup);
    //       }
    //     }
    //   }

    //   // Checks if the removed operation was successful 
    //   if (originalGroupsLength > this.data.task.groups.length) {
    //     this.isAssigning = false;
    //     this.snackBarService.open('הקבוצה וכל הקבוצות המשויכות אליה נמחקו בהצלחה', 'סגור');
    //   }
    // }
  }

  // async removeGroupFromTask(group) {
  //   try {
  //     const res = await this.sharedService.assignGroup({
  //       taskId: this.data.task._id,
  //       group: { name: group.name, id: group.kartoffelID },
  //       isCountGrow: false,
  //     }).toPromise();

  //     if (!res) {
  //       throw new Error('המשימה לא קיימת!');
  //     }

  //     // Remove the current group from the data tasks
  //     this.data.task.groups = this.data.task.groups.filter((item) => item.id !== group.kartoffelID);
  //   } catch (err) {
  //     this.snackBarService.open(err.message, 'סגור');
  //   }
  // }
}
