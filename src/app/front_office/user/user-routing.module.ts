import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeManagementComponent } from './Employe-management/employe-management.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { ViewUserComponent } from './Employe-management/Employe-display/employe-display.component';
import { UserEditComponent } from './Employe-management/Employe-edit/employe-edit.component';
import { ClientManagementComponent } from './client-management/client-management.component';
import { SupplierManagementComponent } from './supplier-management/supplier-management.component';
import { InvoiceManagementComponent } from '../sale/facture/facture.component';

const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([
     {path:'',component:EmployeeManagementComponent} ,
     {path:'add',component:UserCreateComponent} ,
     {path:'view/:id',component:ViewUserComponent} ,
     {path:'edit/:id',component:UserEditComponent} ,
     {path:'client',component:ClientManagementComponent} ,
     {path:'supplier',component:SupplierManagementComponent} ,

     




 
 
       ])],
  
  exports: [RouterModule]
})
export class UserRoutingModule { }
