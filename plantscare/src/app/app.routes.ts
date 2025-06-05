import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlantsComponent } from './components/plants/plants.component';
import { WateringsComponent } from './components/waterings/waterings.component';
import { EditPlantComponent } from './components/edit-plant/edit-plant.component';
export const routes: Routes = [
    {
        path: 'waterings',
        component: WateringsComponent,
    }
    ,
    {
        path: 'plants',
        component: PlantsComponent,
    }
    ,
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'edit-plant/:id', 
        component: EditPlantComponent 
    }
    
];
