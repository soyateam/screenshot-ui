import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GraphComponent } from './components/graph/graph.component';


@NgModule({
    declarations: [GraphComponent],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [GraphComponent]
})
export class StatisticsModule { }