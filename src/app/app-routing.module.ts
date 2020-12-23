import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterTasksComponent } from './modules/tasks/components/master-tasks/master-tasks.component';
import { TaskComponent } from './modules/tasks/components/task/task.component';
import { TaskStatisticsComponent } from './modules/statistics/components/task-statistics/task-statistics.component';
import { DashboardComponent } from './modules/statistics/dashboard/dashboard.component';
import { ViewScreenComponent } from './view-screen/view-screen.component';

const routes: Routes = [  { path: 'task/:id', component: TaskComponent },
                          { path: 'statistics/:id/:name', component: TaskStatisticsComponent },
                          /*{ path: 'dashboard/:id/:name', component: ViewScreenComponent},*/
                          { path: 'dashboard', component: ViewScreenComponent},
                          { path: '**', redirectTo: '/dashboard' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
