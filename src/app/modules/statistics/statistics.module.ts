import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GraphComponent } from './components/graph/graph.component';
import { TaskStatisticsComponent } from './components/task-statistics/task-statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
    declarations: [GraphComponent, TaskStatisticsComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        StatisticsRoutingModule
    ],
    exports: [GraphComponent]
})
export class StatisticsModule { }