import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceManagementComponent } from '../sale/facture/facture.component';
import { CreateInvoiceComponent } from './facture/create-invoice/create-invoice.component';
import { DevisComponent } from './devis/devis.component';
import { ViewInvoiceComponent } from './facture/view-invoice/view-invoice.component';
import { ViewDevisComponent } from './devis/view-devis/view-devis.component';
import { BonDeLivraisonComponent } from './bon-de-livraison/bon-de-livraison.component';
import { CreateDevisComponent } from './devis/create-devis/create-devis.component';

const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([
     {path:'facture',component:InvoiceManagementComponent} ,
     {path:'devis',component:DevisComponent} ,
     {path:'devis/add',component:CreateDevisComponent} ,
     {path:'livraison',component:BonDeLivraisonComponent} ,
     {path:'devis/view',component:ViewDevisComponent} ,
     {path:'facture/add',component:CreateInvoiceComponent} ,
     {path:'facture/view',component:ViewInvoiceComponent} ,



     




 
 
       ])],
  
  exports: [RouterModule]
})
export class SaleRoutingModule { }
