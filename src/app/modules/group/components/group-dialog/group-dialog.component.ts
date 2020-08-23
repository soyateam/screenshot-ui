import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTaskDialogComponent } from 'src/app/modules/tasks/components/sub-task-dialog/sub-task-dialog.component';
import { Group } from 'src/app/shared/models/group.model';
import { HierarchyService } from 'src/app/core/http/hierarchy.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.css']
})
export class GroupDialogComponent implements OnInit {
  selectedGroup;
  constructor(public dialogRef: MatDialogRef<SubTaskDialogComponent>,private hierarchyService: HierarchyService,
    @Inject(MAT_DIALOG_DATA) public data) { 
      //this.selectedGroup = this.data.groups; 
    }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  addGroup(group){
    let newGroup = {name: group.name, id:group.kartoffelID};
    let found = this.data.task.groups.find(item => group.kartoffelID == item.id);
    if(!found){
      this.hierarchyService.assignGroup({taskId: this.data.task._id, group:newGroup, isCountGrow:true}).subscribe(()=>{
        this.data.task.groups.push(newGroup);
      })
    }
  }

  removeGroup(group){
    let found = this.data.task.groups.find(item => group.id == item.id);
    if(found){
      this.hierarchyService.assignGroup({taskId: this.data.task._id, group:group, isCountGrow:false}).subscribe((result)=>{
        if(!result.error) 
          this.data.task.groups = this.data.task.groups.filter((item) => item.id !== group.id);
      })
    }
  }
}
