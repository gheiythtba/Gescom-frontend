import { NgModule } from '@angular/core';

import { SelectCompanyRoutingModule } from './select-company-routing.module';
import { CommonModule } from '@angular/common';

import { SelectCompanyComponent } from './select-company.component';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [],
  imports: [
    SelectCompanyRoutingModule,
    TableModule,
    CommonModule,
    
  ]
})
export class SelectCompanyModule { }
