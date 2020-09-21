import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  taskTypes = [
    { id: '5f4cc74c999432075ebeab2f', name: 'הפעלת כוח'},
    { id: '5f4cc9e2999432a15dbeab31', name: 'בניין כוח'},
    { id: '5f689b32fc60a9ebdcaa7cbb', name: 'גורמי מעטפת'},
  ];

  constructor() { }

  ngOnInit(): void {
    if (window.location.pathname === '/dashboard') {
      window.location.href = '/dashboard/5f4cc74c999432075ebeab2f/הפעלת%20כוח';
    }
  }

  changeStats(taskType): void {
    window.location.href = `/dashboard/${taskType.id}/${taskType.name}`;
  }

}
