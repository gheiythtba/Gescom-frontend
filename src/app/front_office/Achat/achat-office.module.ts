import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonEntreeComponent } from './Bon-de-entre/bon-dentree.component';
import { GoodsReceiptComponent } from './Bon-de-entre/add-invoice.component';
import { SupplierOrderDialogComponent } from './supplier-order-dialog.component';
import { SupplierComponent } from './commande-view/commande-view.component';




const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([
     {path:'BonDentree',component:BonEntreeComponent} ,
     {path:'BonDentree/add',component:GoodsReceiptComponent} ,
     {path:'BonDentree/passe',component:SupplierOrderDialogComponent} ,
      {path:'Commande',component:SupplierComponent} ,


     




 
 
       ])],
  
  exports: [RouterModule]
})
export class AchatRoutingModule { }
