import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GraphComponent } from './components/graph/graph.component';
import { TaskStatisticsComponent } from './components/task-statistics/task-statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { MaterialModule } from '../material/material.module';
import { PieGraphComponent } from './components/pie-graph/pie-graph.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecondaryBarGraphComponent } from './components/secondary-bar-graph/secondary-bar-graph.component';


@NgModule({
    declarations: [GraphComponent, TaskStatisticsComponent, PieGraphComponent, BarGraphComponent, DashboardComponent, SecondaryBarGraphComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        AppRoutingModule,
    ],
    exports: [GraphComponent]
})
export class StatisticsModule { }
