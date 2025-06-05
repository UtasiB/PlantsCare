import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Plant } from '../../interfaces/plant';
import { HttpClientModule } from '@angular/common/http';
import { Router ,RouterModule } from '@angular/router';

@Component({
  selector: 'app-plants',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ApiService],
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.scss'
})
export class PlantsComponent implements OnInit {

  newPlant: any = {
    name: '',
    species: '',
    water_interval_days: 0
  };
  showAddForm: boolean = false;
  plants:Plant[] = [];
  
  constructor(
    private api:ApiService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getPlants();
  }

  getPlants(){
    this.api.getPlants().subscribe(res => {
      this.plants = res as Plant[];
    })
  }
  addPlant(newPlant: any) {
    this.api.addPlant(newPlant).subscribe({
      next: (res) => {
        this.plants.push(res as any);
      },
      error: (error) => {
        console.error('Error adding plant:', error);
      }
    });
  }
  
  deletePlant(plantId: string) {
    this.api.deletePlant(plantId).subscribe({
      next: () => {
        this.plants = this.plants.filter(plant => plant.id !== plantId);
      },
      error: (error) => {
        console.error('Error deleting plant:', error);
      }
    });
  }

  
  navigateToEditForm(plantId: string) {
    console.log('Navigating to edit form with plantId:', plantId);
    this.router.navigate(['/edit-plant', plantId]);
}
}
