import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-waterings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './waterings.component.html',
  styleUrl: './waterings.component.scss'
})
export class WateringsComponent implements OnInit {

  waterings: any[] = [];
  plants: any[] = [];
  selectedPlantId: string = '';
  showAddForm: boolean = false;
  newWatering: any = { 
    date_watered: '',
    amount_ml: 0,
    notes: ''
  };

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.getPlants();
  }

  getPlants() {
    this.api.getPlants().subscribe(res => {
      this.plants = res as any[];
    });
  }

  getWaterings() {
    if (this.selectedPlantId) {
      this.api.getWateringsByPlantId(this.selectedPlantId).subscribe(res => {
        this.waterings = res as any[];
      });
    } else {
      this.waterings = [];
    }
  }

  submitWatering() {
    if (!this.selectedPlantId) {
      console.error('No plant selected!');
      return;
    }
  
    const wateringWithPlantId = {
      ...this.newWatering,
      plant_id: this.selectedPlantId,
    };
  
    this.api.addWatering(this.selectedPlantId, wateringWithPlantId).subscribe({
      next: (res) => {
        this.waterings.push(res as any);
        this.showAddForm = false; 
        this.newWatering = { date_watered: '', amount_ml: 0, notes: '' };
      },
      error: (error) => {
        console.error('Error adding watering:', error);
      }
    });
  }

  deleteWatering(wateringId: string) {
    this.api.deleteWatering(this.selectedPlantId, wateringId).subscribe({
      next: () => {
        this.waterings = this.waterings.filter(watering => watering.id !== wateringId);
      },
      error: (error) => {
        console.error('Error deleting watering:', error);
      }
    });
  }
}