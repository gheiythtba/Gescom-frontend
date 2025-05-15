import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonDeTransfertComponent } from './bon-de-transfert/bon-de-transfert.component';  
import { ListeArticleComponent } from './liste-article/liste-article.component';
import { SeuilComponent } from './seuil/seuil.component';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { StockComponent } from './stock.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { DetailArticleComponent } from '../Reusable-component/detail-article.component';
import { ArticleCreateDisplayComponent } from './article-create-display/article-create-display.component';
import { CreateNewTransferComponent } from './bon-de-transfert/create-new-transfer/create-new-transfer.component';
import { TransferDetailsComponent } from './bon-de-transfert/view/view.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
     { path:'',component:StockComponent},
     {path:'ArticleListe',component:ListeArticleComponent},
     {path:'ArticleAdd',component:ArticleCreateDisplayComponent},
     {path:'ArticleListe/view',component:DetailArticleComponent},
     {path:'BonDeTransfert',component:BonDeTransfertComponent},
     {path:'BonDeTransfert/add',component:CreateNewTransferComponent},
     {path:'BonDeTransfert/view/:id',component:TransferDetailsComponent},
     {path:'Seuil',component:SeuilComponent},
     {path:'StockManagement',component:StockManagementComponent} ,
     { path: 'StockManagement/entrepot/:id', component: StockDetailsComponent }

 
 
       ])],
  
  exports: [RouterModule]
})
export class StockRoutingModule { }
