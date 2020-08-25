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


@NgModule({
    declarations: [GraphComponent, TaskStatisticsComponent, PieGraphComponent, BarGraphComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        StatisticsRoutingModule
    ],
    exports: [GraphComponent]
})
export class StatisticsModule { }