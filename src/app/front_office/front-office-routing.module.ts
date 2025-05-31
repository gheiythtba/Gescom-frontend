import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'Stock', loadChildren: () => import('./stock/stock.module').then(m => m.StockModule)},
  { path: 'User', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: 'Sale', loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule)},
  { path: 'Dashboards', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'Rapports', loadChildren: () => import('./rapports/rapport.module').then(m => m.RapportModule)},
  { path: 'Achat', loadChildren: () => import('./Achat/achat.module').then(m => m.AchatModule)},






];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
