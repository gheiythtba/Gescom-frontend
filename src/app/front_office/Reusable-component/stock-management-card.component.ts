import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { Entrepot } from '../../models/entrepot.model';
import { UpdateDialogComponent, DialogField } from './update-dialog.component';

@Component({
  selector: 'app-stock-management-card',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    RippleModule,
    TooltipModule,
    UpdateDialogComponent
  ],
  template: `
    <p-card [class]="customClass" 
            class="w-full shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-round-xl overflow-hidden border-1 surface-border hover:border-primary-100">
      <div class="flex flex-col p-4">
        <!-- Header with Warehouse Name -->
        <div class="flex items-center gap-4 mb-4 p-3 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl transition-all duration-300 hover:from-blue-100 hover:to-gray-100">
          <div class="p-3 bg-white shadow-sm rounded-full border-1 surface-border">
            <img src="assets/Images/insurance.png" 
                 alt="Entrepot" 
                 class="w-8 h-8 object-contain">
          </div>
          <div class="overflow-hidden">
            <h3 class="text-xl font-bold text-gray-800 truncate">{{ entrepot.name }}</h3>
            <p class="text-sm text-gray-500 truncate">
              <i class="pi pi-tag mr-1"></i>{{ entrepot.activity || 'Activité non spécifiée' }}
            </p>
          </div>
        </div>
        
        <!-- Details Grid -->
        <div class="grid gap-3 mb-4">
          <!-- Reference -->
          <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shadow-sm">
              <i class="pi pi-qrcode"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs text-gray-500">Référence</p>
              <p class="font-medium text-gray-700 truncate">{{ entrepot.id }}</p>
            </div>
          </div>
          
          <!-- Address -->
          <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shadow-sm">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs text-gray-500">Adresse</p>
              <p class="font-medium text-gray-700 truncate">{{ entrepot.location }}</p>
            </div>
          </div>
          
          <!-- Responsible -->
          <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200" *ngIf="entrepot.responsible">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shadow-sm">
              <i class="pi pi-user"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs text-gray-500">Responsable</p>
              <p class="font-medium text-gray-700 truncate">{{ entrepot.responsible }}</p>
            </div>
          </div>
          
          <!-- Stock Value -->
          <div class="flex items-center gap-3 bg-gradient-to-r from-green-50 to-gray-50 p-3 rounded-lg border-1 surface-border mt-2">
            <div class="p-2 bg-white rounded-lg text-green-600 shadow-sm border-1 surface-border">
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="flex-grow overflow-hidden">
              <p class="text-xs text-gray-500">Valeur de stock</p>
              <p class="font-bold text-gray-800 truncate">80250,50 TND</p>
            </div>
            <div class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
              +2.5%
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-3 border-t-1 surface-border" *ngIf="showActions">
          <div class="text-xs text-gray-500">
            <i class="pi pi-clock mr-1"></i> Mis à jour: {{ getLastUpdated() }}
          </div>
          <div class="flex gap-2">
            <button pButton 
                    icon="pi pi-chart-bar" 
                    label="Etat de stock" 
                    class="p-button-text p-button-sm p-button-rounded"
                    (click)="onSelect()"
                    pRipple
                    pTooltip="Voir l'état du stock"
                    tooltipPosition="top"></button>
                    
            <button pButton 
                    icon="pi pi-pencil" 
                    label="Modifier" 
                    class="p-button-outlined p-button-sm p-button-rounded"
                    (click)="onEdit()"
                    pRipple
                    pTooltip="Modifier l'entrepôt"
                    tooltipPosition="top"></button>
          </div>
        </div>
      </div>
    </p-card>

    <!-- Update Dialog -->
    <app-update-dialog 
      #updateDialog
      [title]="'Modifier Entrepôt'"
      [fields]="entrepotFields"
      [confirmButtonText]="'Sauvegarder'"
      (submit)="onUpdateSubmit($event)"
      (closed)="onUpdateCancel()">
    </app-update-dialog>
  `,
  styles: [`
    :host {
      display: block;
      transition: all 0.3s ease;
    }
    
    .p-card {
      transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
    }
    
    .p-card:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
      border-color: var(--primary-color) !important;
    }
  `]
})
export class StockManagementCardComponent {
  @Input() entrepot!: Entrepot;
  @Input() showActions = true;
  @Input() customClass = '';
  
  @Output() selected = new EventEmitter<Entrepot>();
  @Output() edit = new EventEmitter<Entrepot>();
  @Output() updated = new EventEmitter<Entrepot>();

  // Define fields for the update form
  entrepotFields: DialogField[] = [
    { key: 'name', label: 'Nom', type: 'text', required: true },
    { key: 'location', label: 'Adresse', type: 'text', required: true },
    { key: 'activity', label: 'Activité', type: 'text' },
    { key: 'responsible', label: 'Responsable', type: 'text' }
  ];

  getLastUpdated(): string {
    // This would ideally use the entrepot's last updated date
    return 'Aujourd\'hui, 14:30';
  }

  onSelect() {
    this.selected.emit(this.entrepot);
  }

  onEdit() {
    this.edit.emit(this.entrepot);
  }

  onUpdateSubmit(updatedEntrepot: any) {
    this.updated.emit({
      ...this.entrepot,
      ...updatedEntrepot
    });
  }

  onUpdateCancel() {
    console.log('Update canceled');
  }
}