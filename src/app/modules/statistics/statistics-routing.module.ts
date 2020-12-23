import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskStatisticsComponent } from './components/task-statistics/task-statistics.component';

const routes: Routes = [ { path: 'statistics/:id/:name', component: TaskStatisticsComponent } ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
