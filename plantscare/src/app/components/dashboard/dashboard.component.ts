import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  statistics: any[] = []; // Variable to store statistics

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics() {
    this.api.getStatistics().subscribe({
      next: (res) => {
        this.statistics = Array.isArray(res) ? res : []; // Ensure res is an array before assignment
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
      }
    });
  }
}