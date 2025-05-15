import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectCompanyComponent } from './select-company.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
      { path:'',component:SelectCompanyComponent}
   
   
         ])],
  exports: [RouterModule]
})
export class SelectCompanyRoutingModule { }
