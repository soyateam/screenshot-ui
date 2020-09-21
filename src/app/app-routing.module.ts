import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterTasksComponent } from './modules/tasks/components/master-tasks/master-tasks.component';
import { TaskComponent } from './modules/tasks/components/task/task.component';
import { TaskStatisticsComponent } from './modules/statistics/components/task-statistics/task-statistics.component';
import { DashboardComponent } from './modules/statistics/dashboard/dashboard.component';

const routes: Routes = [ { path: 'task/:id', component: TaskComponent },
                          { path: 'statistics/:id/:name', component: TaskStatisticsComponent },
                          { path: 'dashboard/:id/:name', component: DashboardComponent},
                          { path: 'dashboard', component: DashboardComponent},
                          { path: '**', redirectTo: '/dashboard' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
