import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';

import { BonDeTransfertComponent } from './bon-de-transfert/bon-de-transfert.component';  
import { ListeArticleComponent } from './liste-article/liste-article.component';
import { SeuilComponent } from './seuil/seuil.component';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { StockComponent } from './stock.component';
import { TableModule } from 'primeng/table';  
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'; // <-- Add this
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';





@NgModule({
  declarations: [
    StockComponent,


  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    TableModule,
    FormsModule,
    CardModule,
    DropdownModule
    
  ]
})
export class StockModule { }
