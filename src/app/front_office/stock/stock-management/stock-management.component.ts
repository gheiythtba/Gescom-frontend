import { Component } from '@angular/core';
import { Entrepot } from '../../../models/entrepot.model';
import { StockItem } from '../../../models/stockItem.model';
import { StockManagementListComponent } from '../../Reusable-component/stock-management-list.component';
import { ButtonModule } from 'primeng/button';
import { CreationDialogComponent, DialogField } from '../../Reusable-component/creation-dialog.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderBarComponent,HeaderButton } from '../../Reusable-component/header-bar.component';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [
    CommonModule,
    StockManagementListComponent,
    ButtonModule,
    CreationDialogComponent,HeaderBarComponent
  ],
  template: `
    <div class="p-4">
      <!-- Header Card -->
      <app-header-bar
        title="Gestion de Stock"
        [buttons]="headerButtons"
        [subtitle]="'Gérez vos entrepôts et votre stock efficacement'"
        (buttonClick)="companyDialog.show()">
      </app-header-bar>

      <app-creation-dialog #companyDialog
        title="Create New Warehouse"
        [fields]="companyFields"
        (submit)="createCompany($event)">
      </app-creation-dialog>

      <app-stock-management-list
        [entrepots]="entrepots"
        [currentStock]="currentStock"
        (entrepotUpdated)="handleUpdate($event)">
      </app-stock-management-list>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
    }
  `]
})
export class StockManagementComponent {

  headerButtons: HeaderButton[] = [
    {
      key: 'add',
      label: 'Ajouter',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF'}
    }
  ];



  entrepots: Entrepot[] = [
    new Entrepot(
      '1X451ODSQ00', 
      'Main Warehouse', 
      'Casablanca',
      undefined,
      undefined,
      new Date('2023-01-15'),
      'assets/Images/warehouse-large.png'
    ),
    new Entrepot(
      '1XFWD1ODSQ2', 
      'Secondary Storage', 
      'Rabat',
      'Retail Distribution',
      'Mohamed Ali',
      new Date('2023-03-20'),
      undefined
    )
  ];
  handleEdit(entrepot: Entrepot) {
    // Open dialog or perform other edit actions
  }
  currentStock: StockItem[] = [
    new StockItem(
      1, 
      'Product A', 
      150, 
      'Electronics',
      '1X451ODSQ00',
      20,
      'ELEC-001-A',
      new Date('2023-05-10'),
      false // Active item
    ),
    new StockItem(
      2, 
      'Product B', 
      80, 
      'Furniture',
      '1XFWD1ODSQ2',
      15,
      'FURN-002-B',
      new Date('2023-05-08'),
      false // Active item
    ),
    new StockItem(
      'SPEC-003',
      'Product C', 
      5,
      'Office Supplies',
      '1X451ODSQ00',
      10,
      undefined,
      new Date(),
      true // Archived item
    ),
    new StockItem(
      4,
      'Discontinued Product',
      0,
      'Electronics',
      '1X451ODSQ00',
      5,
      'ELEC-OLD-001',
      new Date('2022-12-01'),
      true // Archived item
    ),
    new StockItem(
      5,
      'Seasonal Item',
      25,
      'Seasonal',
      '1XFWD1ODSQ2',
      10,
      'SEAS-2023',
      new Date('2023-06-15'),
      false // Active item
    )
  ];
  selectedEntrepot: Entrepot | null = null;
  loading = false;

  companyFields: DialogField[] = [
    { 
      key: 'name', 
      label: 'Company Name', 
      type: 'text', 
      required: true ,
      icon: 'pi pi-exclamation-circle' // Custom icon

    },
    { 
      key: 'activity', 
      label: 'Activity', 
      type: 'text', 
      required: true ,
      icon: 'pi pi-dollar' // Custom icon

    },
    { 
      key: 'responsible', 
      label: 'Responsible', 
      type: 'text',
      required: false ,
      icon: 'pi pi-user' // Custom icon

    },
    { 
      key: 'location', 
      label: 'Location', 
      type: 'text',
      required: false ,
      icon: 'pi pi-map-marker' // Custom icon

    }
  ];

  constructor(private router: Router) {}

  private getStockForEntrepot(entrepotId: string): StockItem[] {
    return this.currentStock.filter(item => item.entrepotId === entrepotId);
  }

  onEntrepotEdited(entrepot: Entrepot) {
    console.log('Editing entrepot:', entrepot);
  }

  createCompany(company: any) {
    const newEntrepot = new Entrepot(
      'C' + (this.entrepots.length + 1).toString().padStart(3, '0'),
      company.name,
      company.location,
      company.activity,
      company.responsible,
      new Date()
    );
    this.entrepots.unshift(newEntrepot);
  }


  handleUpdate(updatedEntrepot: Entrepot) {
    // Find and update the entrepot in your array
    const index = this.entrepots.findIndex(e => e.id === updatedEntrepot.id);
    if (index !== -1) {
      this.entrepots[index] = { ...this.entrepots[index], ...updatedEntrepot };
    }
  }







}