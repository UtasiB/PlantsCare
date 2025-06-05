import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  private apiUrl = 'http://localhost:3000/api';


  getPlants() {
    return this.http.get(`${this.apiUrl}/plants`);
  }
  getPlantById(id: string) {
    return this.http.get(`${this.apiUrl}/plants/${id}`, { responseType: 'json' });
  }
  updatePlant(id: string, plant: any) {
    return this.http.patch(`${this.apiUrl}/plants/${id}`, plant);
}
  addPlant(plant: any) {
    return this.http.post(`${this.apiUrl}/plants`, plant)
  }
  deletePlant(id: string) {
    return this.http.delete(`${this.apiUrl}/plants/${id}`)
  }
  getWateringsByPlantId(plantId: string) {
    return this.http.get(`${this.apiUrl}/plants/${plantId}/waterings`)
  }
  addWatering(plantId: string, watering: any) {
    return this.http.post(`${this.apiUrl}/waterings`, watering)
  }
  deleteWatering(plantId: string, wateringId: string) {
    return this.http.delete(`${this.apiUrl}/waterings/${wateringId}`)
  }
  getStatistics() {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
