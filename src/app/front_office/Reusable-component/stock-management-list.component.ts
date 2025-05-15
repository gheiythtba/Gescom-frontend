import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { StockManagementCardComponent } from './stock-management-card.component';
import { Entrepot } from '../../models/entrepot.model';
import { StockItem } from '../../models/stockItem.model';
import { Router } from '@angular/router';
import { UpdateDialogComponent, DialogField } from './update-dialog.component';

@Component({
  selector: 'app-stock-management-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    StockManagementCardComponent,
    UpdateDialogComponent,
  ],
  template: `
    <div class="p-4">
      <!-- Update Dialog -->
      <app-update-dialog 
        #updateDialog
        [title]="'Modifier Entrepôt'"
        [fields]="entrepotFields"
        [confirmButtonText]="'Sauvegarder'"
        (submit)="onUpdateSubmit($event)"
        (closed)="onUpdateCancel()">
      </app-update-dialog>

      <div class="flex flex-col gap-6">
        <app-stock-management-card 
          *ngFor="let entrepot of entrepots"
          [entrepot]="entrepot"
          (selected)="selectEntrepot($event)"
          (edit)="openEditDialog($event)">
        </app-stock-management-card>
      </div>

      <!-- Stock Table -->
      <div *ngIf="selectedEntrepot" class="mt-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-700">
          <i class="pi pi-table mr-2 text-blue-500"></i>
          Stock in {{ selectedEntrepot.name }}
        </h3>
        
        <p-table [value]="currentStock" 
                 styleClass="p-datatable-sm w-full shadow-sm"
                 [paginator]="true" [rows]="5">
          <ng-template pTemplate="header">
            <tr class="bg-gray-50">
              <th class="text-sm font-semibold text-gray-600">ID</th>
              <th class="text-sm font-semibold text-gray-600">Name</th>
              <th class="text-sm font-semibold text-gray-600">Quantity</th>
              <th class="text-sm font-semibold text-gray-600">Category</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="text-sm text-gray-600">{{ item.id }}</td>
              <td class="text-sm font-medium text-gray-700">{{ item.name }}</td>
              <td class="text-sm">{{ item.quantity }}</td>
              <td class="text-sm text-gray-600">{{ item.category }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StockManagementListComponent {
  @ViewChild('updateDialog') updateDialog!: UpdateDialogComponent;

  @Input() entrepots: Entrepot[] = [];
  @Input() currentStock: StockItem[] = [];
  @Input() selectedEntrepot: Entrepot | null = null;
  @Input() loading = false;
  
  @Output() entrepotEdited = new EventEmitter<Entrepot>();
  @Output() entrepotUpdated = new EventEmitter<Entrepot>();

  // Define fields for the update form
  entrepotFields: DialogField[] = [
    { key: 'name', label: 'Nom', type: 'text', required: true,      icon: 'pi pi-exclamation-circle' },
    { key: 'location', label: 'Adresse', type: 'text', required: true ,     icon: 'pi  pi-map-marker' },
    { key: 'activity', label: 'Activité', type: 'text',     icon: 'pi pi-dollar'  },
    { key: 'responsible', label: 'Responsable', type: 'text' ,     icon: 'pi pi-user' }
  ];

  constructor(private router: Router) {}

  selectEntrepot(entrepot: Entrepot) {
    this.router.navigate([
      '/Gescom/frontOffice/Stock/StockManagement/entrepot', 
      entrepot.id
    ], {
      state: {
        entrepot: entrepot,
        stockItems: this.currentStock.filter(item => item.entrepotId === entrepot.id)
      }
    });
  }

  

  openEditDialog(entrepot: Entrepot) {
    this.updateDialog.show(entrepot);
  }

  onUpdateSubmit(updatedEntrepot: Entrepot) {
    this.entrepotUpdated.emit(updatedEntrepot);
  }

  onUpdateCancel() {
    // Handle dialog cancel if needed
  }
}