import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/shared/models/group.model';
import { HierarchyService } from 'src/app/core/http/hierarchy.service';
import { waitForAsync } from '@angular/core/testing';

export class DynamicFlatNode {
  constructor(public item: Group, public level = 1, public expandable = false,
              public isLoading = false) { }
}

@Injectable({ providedIn: 'root' })
export class DynamicDatabase {

  constructor(private hierarchyService: HierarchyService) {
  }
  dataMap = new Map<string, Group[]>([]);

  rootLevelNodes: Group[] = [{ name: 'aman', kartoffelID: '' }];

  initialData(): DynamicFlatNode[] {
    // this.hierarchyService.getGroupsByParentId('').subscribe((result) => {
    //   console.log(result);
    // })
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  async getChildren(node: Group) {
    if (this.dataMap.has(node.kartoffelID) && !(this.dataMap.get(node.kartoffelID)[0].name === '')) {
      return this.dataMap.get(node.kartoffelID);
    } else {
      try {
        const groups = await this.hierarchyService.getGroupsByParentId(node.kartoffelID).toPromise();
        const editGroups = groups.map((group) => {
          const groupsAssignAbove = [];
          for (let index = 0; index < group.ancestors.length - 2; index += 1) {
            const parentGroup = group.ancestors[index + 1];
            const selectedGroup = group.ancestors[index];
            const fullSelectedGroup = {
              id: selectedGroup,
              name: this.dataMap.get(parentGroup).filter((currGroup) => currGroup.kartoffelID === selectedGroup)[0].name,
            };
            groupsAssignAbove.push(fullSelectedGroup);
          }

          if (group.ancestors.length >= 2) {
            groupsAssignAbove.push({
              id: group.ancestors[group.ancestors.length - 2],
              name: this.dataMap.get('')
                    .filter((currGroup) => currGroup.kartoffelID === group.ancestors[group.ancestors.length - 2])[0].name,
            });
          }

          return { groupsAssignAbove, name: group.name, kartoffelID: group.kartoffelID };
        });
        this.dataMap.set(node.kartoffelID, editGroups);
        groups.forEach(group => {
          if (group.children.length > 0) {
            this.dataMap.set(group.kartoffelID, [{ name: '', kartoffelID: '0' }]);
          }
        });
        return editGroups;
      } catch (err) {
        console.log(err);
      }

    }

  }

  isExpandable(node: Group): boolean {
    return this.dataMap.has(node.kartoffelID);
  }
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  // tslint:disable-next-line: variable-name
  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
              // tslint:disable-next-line: variable-name
              private _database: DynamicDatabase,
              private groupTreeComponent: GroupTreeComponent) { }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  async toggleNode(node: DynamicFlatNode, expand: boolean) {
    this.groupTreeComponent.isLoadEvent.emit(true);
    this.groupTreeComponent.isLoading = true;
    const children = await this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) { // If no children, or cannot find the node, no op
      return;
    }

    if (expand) {
      const nodes = children.map((name) => {
        return new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name));
      });
      this.data.splice(index + 1, 0, ...nodes);
    } else {
      let count = 0;
      for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++, count++) { }
      this.data.splice(index + 1, count);
    }

    // notify the change
    this.dataChange.next(this.data);
    this.groupTreeComponent.isLoading = false;
    this.groupTreeComponent.isLoadEvent.emit(false);
  }
}

@Component({
  selector: 'app-group-tree',
  templateUrl: './group-tree.component.html',
  styleUrls: ['./group-tree.component.css']
})
export class GroupTreeComponent implements OnInit, OnChanges{

  @Input() isGroupClicked;
  public isLoading = false;
  @Output('isLoadEvent') public isLoadEvent = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('clickGroup') clickGroup = new EventEmitter();
  constructor(database: DynamicDatabase) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this);

    this.dataSource.data = database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  ngOnInit() {

  }

  ngOnChanges() {
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  // tslint:disable-next-line: variable-name
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  selectGroup(node) {
    this.clickGroup.emit(node);
  }
}
