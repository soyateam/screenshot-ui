import { MasterTasksComponent } from './components/master-tasks/master-tasks.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './components/task/task.component';

const routes: Routes = [ { path: 'tasks', component: MasterTasksComponent },
                         { path: 'task/:id', component: TaskComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
