import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RapportsComponent } from './rapports.component';

const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([

         { path:'',component:RapportsComponent},
    
       ])],
  
  exports: [RouterModule]
})
export class RapportRoutingModule { }
