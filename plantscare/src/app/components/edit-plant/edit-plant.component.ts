import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-plant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  providers: [ApiService],
  templateUrl: './edit-plant.component.html',
  styleUrls: ['./edit-plant.component.scss']
})
export class EditPlantComponent implements OnInit {
  plant: any = {};
  plantId: number | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.plantId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.plantId) {
        this.fetchPlantDetails(this.plantId);
    }
}
fetchPlantDetails(id: number): void {
  this.apiService.getPlantById(id.toString()).subscribe({
      next: (data) => {
          console.log('Plant details fetched successfully:', data);
          this.plant = data;
      },
      error: (err) => {
          console.error('Error fetching plant details:', err);
          alert('Failed to load plant details.');
      }
  });
}
  updatePlant(): void {
    if (!this.plantId) {
      alert('Invalid plant ID.');
      return;
    }

    this.apiService.updatePlant(this.plantId.toString(), this.plant).subscribe({
      next: () => {
        alert('Plant updated successfully!');
        this.router.navigate(['/plants']); 
      },
      error: (err) => {
        console.error('Error updating plant:', err);
        alert('Failed to update plant.');
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/plants']);
  }
}