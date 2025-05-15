import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-detail-article',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PanelModule, DropdownModule,
    TableModule, DividerModule,
    TagModule, CardModule,
    InputTextModule, ButtonModule,
    DatePipe, BadgeModule,
    TooltipModule, ProgressBarModule,
    DialogModule, InputNumberModule,
    CalendarModule
  ],
  template: `
    <div class="max-w-[1200px] mx-auto bg-gray-50 p-4 md:p-6">
      <!-- Main Header Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row gap-4 md:gap-6">
          <!-- Product Image -->
          <div class="w-full sm:w-56 h-56 flex-shrink-0 mx-auto sm:mx-0 relative group">
            <div class="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              <img src="https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg" 
                   alt="Product Image" 
                   class="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105">
            </div>
            <button
                pButton
                icon="pi pi-eye"
                class="absolute bottom-2 right-2 p-button-rounded p-button-sm p-button-text bg-white/80 hover:bg-white"
                pTooltip="Voir l'image en grand"
                tooltipPosition="top"
                (click)="openImageDialog( 'https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg')">
            </button>
          </div>



          <!-- Image Popup Dialog -->
          <div *ngIf="showImageDialog" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-4">
              <button (click)="closeImageDialog()" class="absolute top-2 right-2 text-black hover:text-red-600 text-xl font-bold">✖</button>
              <img [src]="selectedImageUrl" alt="Image agrandie" class="w-full h-auto object-contain" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div class="min-w-0">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 truncate">Système de chauffage</h1>
                <div class="flex items-center gap-2 flex-wrap">
                  <p-tag value="En stock" severity="success" class="text-sm"></p-tag>
                  <p-tag value="Nouveau" severity="info" class="text-sm" *ngIf="isNewProduct"></p-tag>
                </div>
              </div>
              <div class="flex items-center gap-2 sm:ml-4">
                <p-badge value="REF: P-000001" severity="info"></p-badge>
                <button pButton icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-sm"
                        pTooltip="Modifier le produit" tooltipPosition="top">
                </button>
              </div>
            </div>

            <h2 class="text-xl sm:text-2xl font-semibold text-primary-600 mt-4 mb-3">Informations produit</h2>

            <div class="flex flex-wrap gap-3 mb-4">
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-tag text-gray-500"></i>
                <span class="text-gray-600">Marque:</span>
                <span class="font-medium truncate">Marque générale</span>
              </div>
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-folder text-gray-500"></i>
                <span class="text-gray-600">Catégorie:</span>
                <span class="font-medium truncate">Catégorie générale</span>
              </div>
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-barcode text-gray-500"></i>
                <span class="text-gray-600">Code barre:</span>
                <span class="font-medium truncate">1234567890123</span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500 shadow-sm hover:shadow transition-colors">
                <span class="block text-gray-500 text-sm">Prix Public</span>
                <span class="font-bold text-lg">200,000 TND</span>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500 shadow-sm hover:shadow transition-colors">
                <span class="block text-gray-500 text-sm">TVA</span>
                <span class="font-bold text-lg">19%</span>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500 shadow-sm hover:shadow transition-colors">
                <span class="block text-gray-500 text-sm">Unité</span>
                <span class="font-bold text-lg">Pièce</span>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500 shadow-sm hover:shadow transition-colors">
                <span class="block text-gray-500 text-sm">Stock actuel</span>
                <span class="font-bold text-lg">45</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button pButton label="Approvisionner" icon="pi pi-plus" class="p-button-sm"></button>
        <button pButton label="Vendre" icon="pi pi-minus" class="p-button-sm p-button-outlined"></button>
        <button pButton label="Transférer" icon="pi pi-arrows-h" class="p-button-sm p-button-outlined"></button>
        <button pButton label="Inventaire" icon="pi pi-list" class="p-button-sm p-button-outlined"></button>
      </div>

      <!-- Price Overview Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 class="text-xl font-semibold text-primary-600">Vue d'ensemble</h2>
          <button pButton icon="pi pi-chart-line" label="Voir statistiques" class="p-button-sm p-button-text"></button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
            <h3 class="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
              <i class="pi pi-money-bill"></i> Prix
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Prix HT:</span>
                <span class="font-medium">200,000 TND</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">TVA (19%):</span>
                <span class="font-medium">38,000 TND</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span class="text-gray-800 font-semibold">Total TTC:</span>
                <span class="text-primary-600 font-bold text-lg">238,000 TND</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors flex flex-col items-center justify-center">
              <span class="text-gray-500 text-sm mb-1">Dernier prix d'achat</span>
              <span class="text-xl font-semibold">0,000 TND</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors flex flex-col items-center justify-center">
              <span class="text-gray-500 text-sm mb-1">Valeur en stock</span>
              <span class="text-xl font-semibold">0,000 TND</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors flex flex-col items-center justify-center col-span-2">
              <span class="text-gray-500 text-sm mb-1">Niveau de stock</span>
              <p-progressBar [value]="stockLevel" [showValue]="false" class="w-full h-2"></p-progressBar>
              <span class="text-sm mt-1">{{stockLevel}}% (45/50)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 class="text-xl font-semibold text-primary-600">Détails supplémentaires</h2>
          <button pButton icon="pi pi-cog" label="Configurer" class="p-button-sm p-button-text"></button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="min-w-0">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <h3 class="bg-gray-50 px-4 py-3 font-semibold border-b border-gray-200 text-gray-700 flex items-center gap-2">
                <i class="pi pi-money-bill"></i> Grille tarifaire
              </h3>
              <div class="divide-y divide-gray-100">
                <div class="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span class="text-gray-600 truncate">Prix Public HT</span>
                  <span class="font-medium ml-2">200,000 TND</span>
                </div>
                <div class="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span class="text-gray-600 truncate">TVA (19%)</span>
                  <span class="font-medium ml-2">38,000 TND</span>
                </div>
                <div class="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span class="text-gray-600 truncate">Prix Public TTC</span>
                  <span class="text-primary-600 font-medium ml-2">238,000 TND</span>
                </div>
                <div class="px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span class="text-gray-600 truncate">Marge</span>
                  <span class="font-medium ml-2">---</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="min-w-0">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <h3 class="bg-gray-50 px-4 py-3 font-semibold border-b border-gray-200 text-gray-700 flex items-center gap-2">
                <i class="pi pi-box"></i> Stock
              </h3>
              <div class="grid grid-cols-2 gap-4 p-4">
                <div class="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors">
                  <p class="text-gray-500 text-sm mb-1">Quantité actuelle</p>
                  <p class="font-semibold">45</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors">
                  <p class="text-gray-500 text-sm mb-1">Stock minimum</p>
                  <p class="font-semibold text-red-500">5</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors">
                  <p class="text-gray-500 text-sm mb-1">Stock maximum</p>
                  <p class="font-semibold text-green-500">50</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors">
                  <p class="text-gray-500 text-sm mb-1">Entrepôt</p>
                  <p class="font-semibold">Principal</p>
                </div>
              </div>
            </div>
          </div>

          <div class="min-w-0">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <h3 class="bg-gray-50 px-4 py-3 font-semibold border-b border-gray-200 text-gray-700 flex items-center gap-2">
                <i class="pi pi-info-circle"></i> Détails techniques
              </h3>
              <div class="p-4">
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Poids:</span>
                  <span class="font-medium">2.5 kg</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Dimensions:</span>
                  <span class="font-medium">30x20x15 cm</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Couleur:</span>
                  <span class="font-medium">Blanc</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Matériau:</span>
                  <span class="font-medium">Plastique</span>
                </div>
              </div>
            </div>
          </div>

          <div class="min-w-0">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <h3 class="bg-gray-50 px-4 py-3 font-semibold border-b border-gray-200 text-gray-700 flex items-center gap-2">
                <i class="pi pi-history"></i> Historique
              </h3>
              <div class="p-4">
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Date création:</span>
                  <span class="font-medium">15/10/2023</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Dernière modification:</span>
                  <span class="font-medium">28/10/2023</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Créé par:</span>
                  <span class="font-medium">Admin</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span class="text-gray-600">Modifié par:</span>
                  <span class="font-medium">Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Movement Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 class="text-xl font-semibold text-primary-600">Mouvements de stock</h2>
          <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
            <div class="w-full sm:w-[200px]">
              <p-dropdown [options]="warehouses" [(ngModel)]="selectedWarehouse" 
                          optionLabel="name" optionValue="code" 
                          (onChange)="filterMovements()"
                          placeholder="Tous les entrepôts"
                          class="w-full">
              </p-dropdown>
            </div>
            <div class="w-full sm:w-[250px]">
              <span class="p-input-icon-left w-full">
                <input pInputText type="text" placeholder="Rechercher..." [(ngModel)]="searchText" (input)="filterMovements()" class="w-full">
              </span>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button pButton icon="pi pi-filter" label="Filtrer" class="p-button-sm w-full sm:w-auto" (click)="showFilterDialog = true"></button>
              <button pButton icon="pi pi-refresh" 
                      (click)="refreshTable()"
                      class="p-button-sm p-button-outlined w-full sm:w-auto"
                      pTooltip="Actualiser les données" tooltipPosition="top">
              </button>
            </div>
          </div>
        </div>
        
        <p-table [value]="filteredMovements" [paginator]="true" [rows]="rows" 
                [rowsPerPageOptions]="[5,10,25]" styleClass="p-datatable-sm p-datatable-gridlines"
                [globalFilterFields]="['document','utilisateur']" [loading]="loading">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="date" style="width: 120px;">Date <p-sortIcon field="date"></p-sortIcon></th>
              <th pSortableColumn="document">Document <p-sortIcon field="document"></p-sortIcon></th>
              <th style="width: 150px;">Entrepôt</th>
              <th pSortableColumn="stock" style="width: 120px;">Mouvement <p-sortIcon field="stock"></p-sortIcon></th>
              <th style="width: 120px;">État</th>
              <th pSortableColumn="utilisateur" style="width: 150px;">Utilisateur <p-sortIcon field="utilisateur"></p-sortIcon></th>
              <th style="width: 60px;"></th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.date | date:'dd/MM/yyyy' }}</td>
              <td>
                <a class="text-primary-600 hover:underline cursor-pointer flex items-center gap-1">
                  <i class="pi pi-file" [ngClass]="getDocIconClass(item.document)"></i>
                  <span class="truncate">{{ item.document }}</span>
                </a>
              </td>
              <td>
                <span class="truncate">{{ getWarehouseName(item.warehouse) }}</span>
              </td>
              <td>
                <span class="flex items-center gap-1" [ngClass]="getStockClass(item.stock)">
                  <i [class]="getStockIconClass(item.stock)"></i>
                  {{ item.stock }}
                </span>
              </td>
              <td>
                <p-tag [severity]="getEtatSeverity(item.etat)" [value]="item.etat" styleClass="text-xs"></p-tag>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {{ getInitials(item.utilisateur) }}
                  </span>
                  <span class="truncate">{{ item.utilisateur }}</span>
                </div>
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-4 text-gray-500">
                <i class="pi pi-search text-2xl mb-2 block"></i>
                Aucun mouvement de stock trouvé
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Filter Dialog -->
      <p-dialog header="Filtrer les mouvements" [(visible)]="showFilterDialog" [style]="{width: '500px'}" [modal]="true">
        <div class="grid gap-4">
          <div>
            <label class="block text-gray-600 mb-2">Date de début</label>
            <p-calendar [(ngModel)]="filterStartDate" [showIcon]="true" dateFormat="dd/mm/yy" inputId="startDate" class="w-full"></p-calendar>
          </div>
          <div>
            <label class="block text-gray-600 mb-2">Date de fin</label>
            <p-calendar [(ngModel)]="filterEndDate" [showIcon]="true" dateFormat="dd/mm/yy" inputId="endDate" class="w-full"></p-calendar>
          </div>
          <div>
            <label class="block text-gray-600 mb-2">Type de mouvement</label>
            <p-dropdown [options]="movementTypes" [(ngModel)]="selectedMovementType" 
                        optionLabel="name" optionValue="code" 
                        placeholder="Tous les types"
                        class="w-full">
            </p-dropdown>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Effacer" icon="pi pi-times" class="p-button-text" (click)="clearFilters()"></button>
          <button pButton label="Appliquer" icon="pi pi-check" (click)="applyFilters()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      --primary-600: #2563eb;
      --primary-500: #3b82f6;
      --primary-300: #93c5fd;
    }
    
    .text-primary-600 {
      color: var(--primary-600);
    }
    
    .border-primary-500 {
      border-color: var(--primary-500);
    }
    
    .hover\:border-primary-300:hover {
      border-color: var(--primary-300);
    }
    
    .shadow-sm {
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .shadow {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .rounded-xl {
      border-radius: 0.75rem;
    }
    
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    
    .border-gray-200 {
      border-color: #e5e7eb;
    }
    
    .text-gray-600 {
      color: #4b5563;
    }
    
    .text-gray-700 {
      color: #374151;
    }
    
    .text-gray-800 {
      color: #1f2937;
    }
    
    .hover\:bg-gray-100:hover {
      background-color: #f3f4f6;
    }
    
    .hover\:bg-white:hover {
      background-color: white;
    }
    
    .transition-colors {
      transition-property: background-color, border-color, color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    
    .transition-shadow {
      transition-property: box-shadow;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    
    .stock-increase {
      color: #10B981;
      font-weight: 600;
    }
    
    .stock-decrease {
      color: #EF4444;
      font-weight: 600;
    }
    
    .stock-neutral {
      color: #6B7280;
      font-weight: 500;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f9fafb;
      color: #374151;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 0.75rem 1rem;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
      vertical-align: middle;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover > td {
      background-color: #f3f4f6 !important;
    }
    
    :host ::ng-deep .p-dropdown {
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      transition: border-color 0.3s ease;
      width: 100%;
    }
    
    :host ::ng-deep .p-dropdown:hover {
      border-color: #9ca3af;
    }
    
    :host ::ng-deep .p-inputtext {
      border-radius: 0.5rem;
      width: 100%;
    }
    
    :host ::ng-deep .p-progressbar {
      height: 0.5rem;
      border-radius: 0.25rem;
    }
    
    :host ::ng-deep .p-progressbar .p-progressbar-value {
      background-color: var(--primary-500);
    }
    
    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem !important;
    }
    
    @media (max-width: 640px) {
      :host ::ng-deep .p-dialog {
        width: 95vw !important;
      }
    }
  `]
})
export class DetailArticleComponent {
  // Warehouse data

  showImageDialog = false;
  selectedImageUrl: string = '';
  
  openImageDialog(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.showImageDialog = true;
  }
  
  closeImageDialog() {
    this.showImageDialog = false;
    this.selectedImageUrl = '';
  }








  warehouses = [
    { code: 'WH1', name: 'Entrepôt Principal' },
    { code: 'WH2', name: 'Entrepôt Nord' },
    { code: 'WH3', name: 'Entrepôt Sud' },
    { code: 'WH4', name: 'Entrepôt Est' },
    { code: 'WH5', name: 'Entrepôt Ouest' }
  ];
  
  // Movement types for filtering
  movementTypes = [
    { code: 'IN', name: 'Entrées' },
    { code: 'OUT', name: 'Sorties' },
    { code: 'TRANSFER', name: 'Transferts' },
    { code: 'ADJUST', name: 'Ajustements' }
  ];
  
  selectedWarehouse: string = '';
  selectedMovementType: string = '';
  searchText: string = '';
  filteredMovements: any[] = [];
  loading: boolean = false;
  showFilterDialog: boolean = false;
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  isNewProduct: boolean = true;
  stockLevel: number = 90; // 90% for demo

  // Sample data for the table with warehouse information
  data: any[] = [
    {
      date: '2023-10-15',
      document: 'BR-2023-00158',
      warehouse: 'WH1',
      stock: '+5',
      etat: 'Approvisionnement',
      utilisateur: 'Ahmed Ben Salah'
    },
    {
      date: '2023-10-18',
      document: 'BL-2023-00472',
      warehouse: 'WH2',
      stock: '-2',
      etat: 'Vente',
      utilisateur: 'Marie Dupont'
    },
    {
      date: '2023-10-20',
      document: 'INV-2023-00033',
      warehouse: 'WH1',
      stock: '0',
      etat: 'Inventaire',
      utilisateur: 'Karim Jridi'
    },
    {
      date: '2023-10-22',
      document: 'RT-2023-00012',
      warehouse: 'WH3',
      stock: '-1',
      etat: 'Retour client',
      utilisateur: 'Sophie Martin'
    },
    {
      date: '2023-10-25',
      document: 'BR-2023-00172',
      warehouse: 'WH1',
      stock: '+10',
      etat: 'Approvisionnement',
      utilisateur: 'Mohamed Karray'
    },
    {
      date: '2023-10-28',
      document: 'BL-2023-00489',
      warehouse: 'WH4',
      stock: '-3',
      etat: 'Vente',
      utilisateur: 'Julie Leroy'
    },
    {
      date: '2023-11-02',
      document: 'RT-2023-00015',
      warehouse: 'WH5',
      stock: '+1',
      etat: 'Retour fournisseur',
      utilisateur: 'Ali Ben Amor'
    },
    {
      date: '2023-11-05',
      document: 'BL-2023-00501',
      warehouse: 'WH2',
      stock: '-4',
      etat: 'Vente',
      utilisateur: 'Emma Petit'
    },
    {
      date: '2023-11-08',
      document: 'INV-2023-00041',
      warehouse: 'WH1',
      stock: '0',
      etat: 'Inventaire',
      utilisateur: 'Youssef Hammami'
    },
    {
      date: '2023-11-10',
      document: 'BR-2023-00195',
      warehouse: 'WH3',
      stock: '+8',
      etat: 'Approvisionnement',
      utilisateur: 'Nadia Belhassen'
    }
  ];

  rows = 5; // Default rows per page

  constructor() {
    this.filteredMovements = [...this.data];
  }

  // Refresh table data
  refreshTable() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.filteredMovements = [...this.data];
      this.selectedWarehouse = '';
      this.searchText = '';
      this.loading = false;
    }, 800);
  }

  // Filter movements by selected warehouse and search text
  filterMovements() {
    this.filteredMovements = this.data.filter(item => {
      const matchesWarehouse = !this.selectedWarehouse || item.warehouse === this.selectedWarehouse;
      const matchesSearch = !this.searchText || 
        item.document.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.utilisateur.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesWarehouse && matchesSearch;
    });
  }

  // Apply advanced filters
  applyFilters() {
    this.filteredMovements = this.data.filter(item => {
      const matchesWarehouse = !this.selectedWarehouse || item.warehouse === this.selectedWarehouse;
      const matchesSearch = !this.searchText || 
        item.document.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.utilisateur.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Date filtering
      const itemDate = new Date(item.date);
      const matchesStartDate = !this.filterStartDate || itemDate >= this.filterStartDate;
      const matchesEndDate = !this.filterEndDate || itemDate <= this.filterEndDate;
      
      // Movement type filtering
      let matchesMovementType = true;
      if (this.selectedMovementType) {
        if (this.selectedMovementType === 'IN') {
          matchesMovementType = item.stock.startsWith('+');
        } else if (this.selectedMovementType === 'OUT') {
          matchesMovementType = item.stock.startsWith('-');
        } else if (this.selectedMovementType === 'TRANSFER') {
          matchesMovementType = item.etat === 'Transfert';
        } else if (this.selectedMovementType === 'ADJUST') {
          matchesMovementType = item.etat === 'Ajustement';
        }
      }
      
      return matchesWarehouse && matchesSearch && matchesStartDate && matchesEndDate && matchesMovementType;
    });
    
    this.showFilterDialog = false;
  }

  // Clear all filters
  clearFilters() {
    this.selectedWarehouse = '';
    this.selectedMovementType = '';
    this.searchText = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.filteredMovements = [...this.data];
    this.showFilterDialog = false;
  }

  // Get warehouse name by code
  getWarehouseName(code: string): string {
    const warehouse = this.warehouses.find(w => w.code === code);
    return warehouse ? warehouse.name : code;
  }

  // Helper methods
  getStockClass(stock: string): string {
    if (stock.startsWith('+')) return 'stock-increase';
    if (stock.startsWith('-')) return 'stock-decrease';
    return 'stock-neutral';
  }

  getStockIconClass(stock: string): string {
    if (stock.startsWith('+')) return 'pi pi-arrow-up text-green-500';
    if (stock.startsWith('-')) return 'pi pi-arrow-down text-red-500';
    return 'pi pi-circle text-gray-500';
  }

  getDocIconClass(doc: string): string {
    if (doc.startsWith('BR')) return 'text-green-500';
    if (doc.startsWith('BL')) return 'text-blue-500';
    if (doc.startsWith('INV')) return 'text-purple-500';
    return 'text-gray-500';
  }

  getEtatSeverity(etat: string): string {
    switch(etat) {
      case 'Approvisionnement': return 'success';
      case 'Vente': return 'warning';
      case 'Inventaire': return 'info';
      case 'Retour client':
      case 'Retour fournisseur': return 'help';
      default: return '';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0].toUpperCase()).join('');
  }
}