import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { StockItem } from '../../../models/stockItem.model';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
@Component({
  selector: 'app-seuil',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    HeaderBarComponent,
    ButtonModule,
    TooltipModule,
    TabMenuModule,
    CardModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    InputNumberModule,
    TagModule,
    BadgeModule,
    RippleModule,
    DividerModule,
    ProgressBarModule,
    DropdownModule,
    MultiSelectModule
  ],
  template: `
    <div class="p-4 bg-gray-50 min-h-screen">
      <app-header-bar
        [title]="'Seuil de Réapprovisionnement'"
        [buttons]="headerButtons"
        [subtitle]="'Gérez vos articles et leurs seuils de réapprovisionnement'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>
      
      <!-- Statistics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Critical Items -->
        <p-card class="stat-card">
          <div class="flex items-center gap-4">
            <div class="stat-icon bg-red-100">
              <i class="pi pi-exclamation-triangle text-red-500"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">Articles Critiques</h3>
              <p class="stat-value text-red-500">{{ criticalItemsCount }}</p>
              <p class="stat-percentage">{{ criticalPercentage | number:'1.0-0' }}% du stock</p>
            </div>
          </div>
        </p-card>

        <!-- Warning Items -->
        <p-card class="stat-card">
          <div class="flex items-center gap-4">
            <div class="stat-icon bg-yellow-100">
              <i class="pi pi-exclamation-circle text-yellow-500"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">Articles en Avertissement</h3>
              <p class="stat-value text-yellow-500">{{ warningItemsCount }}</p>
              <p class="stat-percentage">{{ warningPercentage | number:'1.0-0' }}% du stock</p>
            </div>
          </div>
        </p-card>

        <!-- Safe Items -->
        <p-card class="stat-card">
          <div class="flex items-center gap-4">
            <div class="stat-icon bg-green-100">
              <i class="pi pi-check-circle text-green-500"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">Articles Sûrs</h3>
              <p class="stat-value text-green-500">{{ safeItemsCount }}</p>
              <p class="stat-percentage">{{ safePercentage | number:'1.0-0' }}% du stock</p>
            </div>
          </div>
        </p-card>

        <!-- Average Threshold -->
        <p-card class="stat-card">
          <div class="flex items-center gap-4">
            <div class="stat-icon bg-blue-100">
              <i class="pi pi-chart-line text-blue-500"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">Seuil Moyen</h3>
              <p class="stat-value text-blue-500">{{ averageThreshold | number:'1.0-0' }}</p>
              <p class="stat-percentage">Par article</p>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Main Table Card -->
      <p-card class="w-full main-table-card">
        <!-- Tab Menu -->
        <div class="border-b border-gray-100">
          <p-tabMenu 
            [model]="tabs" 
            [activeItem]="activeTab"
            (activeItemChange)="onTabChange($event)"
            class="custom-tab-menu ">
          </p-tabMenu>
        </div>

        <!-- Search and Filters -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex flex-col md:flex-row gap-4 w-full">
              <p-iconField iconPosition="left" class="w-full md:w-96">
                <p-inputIcon class="text-gray-400">
                  <i class="pi pi-search"></i>
                </p-inputIcon>
                <input 
                  pInputText 
                  [(ngModel)]="searchText" 
                  (input)="applySearch()"
                  placeholder="Rechercher un article..." 
                  class="search-input" />
              </p-iconField>

              <p-multiSelect 
                [options]="statusOptions" 
                [(ngModel)]="selectedStatuses"
                (onChange)="applyStatusFilter()"
                optionLabel="label"
                optionValue="value"
                placeholder="Statut"
                [showToggleAll]="false"
                display="chip"
                class="w-full md:w-64">
                <ng-template let-option pTemplate="item">
                  <p-tag 
                    [value]="option.label" 
                    [severity]="option.severity" 
                    [rounded]="true"
                    styleClass="text-xs">
                  </p-tag>
                </ng-template>
              </p-multiSelect>

              <p-dropdown 
                [options]="categoryOptions" 
                [(ngModel)]="selectedCategory"
                (onChange)="applyCategoryFilter()"
                optionLabel="label"
                optionValue="value"
                placeholder="Catégorie"
                class="w-full md:w-48">
              </p-dropdown>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="p-0">
          <p-table 
            [value]="filteredItems"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[5,10,25,50]"
            styleClass="p-datatable-sm p-datatable-striped p-datatable-gridlines"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} articles"
            [loading]="loading"
            [globalFilterFields]="['code','name','category']">
            
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="code" class="table-header">Code <p-sortIcon field="code"></p-sortIcon></th>
                <th pSortableColumn="name" class="table-header">Désignation <p-sortIcon field="name"></p-sortIcon></th>
                <th pSortableColumn="category" class="table-header">Catégorie <p-sortIcon field="category"></p-sortIcon></th>
                <th class="table-header text-center">Quantité</th>
                <th class="table-header text-center">Seuil Min</th>
                <th class="table-header text-center">Statut</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-item>
              <tr class="table-row">
                <td class="table-cell font-medium text-gray-900">
                  <span class="inline-flex items-center gap-2">
                    <i class="pi pi-box text-gray-400"></i>
                    {{item.code || '-'}}
                  </span>
                </td>
                <td class="table-cell text-gray-700">
                  {{item.name}}
                </td>
                <td class="table-cell">
                  <p-tag [value]="item.category" severity="info" [rounded]="true" class="text-xs"></p-tag>
                </td>
                <td class="table-cell text-center">
                  <div class="flex flex-col items-center">
                    <span [ngClass]="{
                      'font-bold': true,
                      'text-red-500': getQuantityStatus(item.quantity, item.seuilMin) === 'danger',
                      'text-yellow-500': getQuantityStatus(item.quantity, item.seuilMin) === 'warning',
                      'text-green-500': getQuantityStatus(item.quantity, item.seuilMin) === 'safe'
                    }">
                      {{item.quantity}}
                    </span>
                    <p-progressBar 
                      [value]="(item.quantity / (item.seuilMin || 1)) * 100" 
                      [showValue]="false"
                      [ngClass]="{
                        'bg-red-100': getQuantityStatus(item.quantity, item.seuilMin) === 'danger',
                        'bg-yellow-100': getQuantityStatus(item.quantity, item.seuilMin) === 'warning',
                        'bg-green-100': getQuantityStatus(item.quantity, item.seuilMin) === 'safe'
                      }"
                      styleClass="h-1 w-16" 
                      [style]="{
                        'background-color': getQuantityStatus(item.quantity, item.seuilMin) === 'danger' ? '#fee2e2' : 
                                          getQuantityStatus(item.quantity, item.seuilMin) === 'warning' ? '#fef3c7' : '#dcfce7'
                      }">
                    </p-progressBar>
                  </div>
                </td>
                <td class="table-cell text-center text-gray-600">
                  {{item.seuilMin || '-'}}
                </td>
                <td class="table-cell text-center">
                  <p-tag 
                    [value]="getStatusText(item.quantity, item.seuilMin)"
                    [severity]="getQuantityStatus(item.quantity, item.seuilMin)"
                    [rounded]="true"
                    class="status-tag">
                  </p-tag>
                </td>
                <td class="table-cell text-right">
                  <div class="action-buttons">
                    <button pButton 
                            icon="pi pi-eye" 
                            class="action-button view-button" 
                            pTooltip="Voir détails"
                            pRipple
                            (click)="viewItem(item)">
                    </button>
                    <button pButton 
                            icon="pi pi-pencil" 
                            class="action-button edit-button" 
                            pTooltip="Modifier"
                            pRipple
                            (click)="showEditDialog(item)">
                    </button>
                    <button pButton 
                            icon="pi pi-file-export" 
                            class="action-button export-button" 
                            pTooltip="Exporter"
                            pRipple
                            (click)="exportItem(item)">
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="loadingbody">
              <tr>
                <td colspan="7" class="text-center p-4">
                  <div class="flex items-center justify-center gap-2">
                    <i class="pi pi-spinner pi-spin text-blue-500"></i>
                    <span>Chargement des données...</span>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="empty">
              <tr>
                <td [colSpan]="7" class="empty-state">
                  <div class="empty-content">
                    <i class="pi pi-database empty-icon"></i>
                    <span class="empty-text">Aucun article trouvé</span>
                    <p class="empty-subtext text-sm text-gray-500 mt-2">
                      Essayez de modifier vos critères de recherche ou ajoutez de nouveaux articles
                    </p>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <!-- Edit Dialog -->
      <p-dialog 
        header="Modifier le seuil minimum" 
        [(visible)]="displayEditDialog" 
        [style]="{width: '500px'}" 
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
        (onHide)="hideEditDialog()">
        
        <div class="dialog-grid">
          <div class="dialog-field">
            <label class="dialog-label">Code Article</label>
            <input pInputText [(ngModel)]="selectedItem.code" readonly class="dialog-input" />
          </div>
          
          <div class="dialog-field">
            <label class="dialog-label">Désignation</label>
            <input pInputText [(ngModel)]="selectedItem.name" readonly class="dialog-input" />
          </div>
          
          <div class="dialog-field">
            <label class="dialog-label">Quantité actuelle</label>
            <input pInputText [(ngModel)]="selectedItem.quantity" readonly class="dialog-input" />
          </div>
          
          <div class="dialog-field">
            <label class="dialog-label">Nouveau seuil minimum *</label>
            <p-inputNumber 
              [(ngModel)]="selectedItem.seuilMin" 
              [min]="0" 
              [max]="1000" 
              mode="decimal"
              class="w-full"
              inputClass="dialog-input">
            </p-inputNumber>
            <small class="dialog-hint">
              Définissez le seuil minimum pour déclencher une alerte
            </small>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button pButton 
                    label="Annuler" 
                    icon="pi pi-times" 
                    class="dialog-button cancel-button"
                    pRipple
                    (click)="hideEditDialog()">
            </button>
            
            <button pButton 
                    label="Enregistrer" 
                    icon="pi pi-check" 
                    class="dialog-button save-button"
                    pRipple
                    (click)="saveSeuilMin()">
            </button>
          </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    /* Main Container */
    .p-4 {
      padding: 1.5rem;
    }

    .bg-gray-50 {
      background-color: #f8fafc;
    }

    .min-h-screen {
      min-height: 100vh;
    }

    /* Stat Cards */
    .stat-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .stat-icon i {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      white-space: nowrap;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0.25rem 0;
    }

    .stat-percentage {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    /* Main Table Card */
    .main-table-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .main-table-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Tab Menu */
    :host ::ng-deep .custom-tab-menu .p-tabmenu-nav {
      background: transparent;
      border: none;
    }
    
    :host ::ng-deep .custom-tab-menu .p-tabmenuitem {
      margin-right: 1.5rem;
    }
    
    :host ::ng-deep .custom-tab-menu .p-tabmenuitem.p-highlight .p-menuitem-link {
      color: #007AFF;
      border-color: #007AFF;
    }
    
    :host ::ng-deep .custom-tab-menu .p-menuitem-link {
      padding: 0.75rem 0;
      border-bottom-width: 2px;
      border-color: transparent;
      transition: all 0.2s ease;
    }
    
    :host ::ng-deep .custom-tab-menu .p-menuitem-link:hover {
      border-color: rgba(0, 122, 255, 0.3);
    }

    /* Search and Filters */
    .search-input {
      width: 100%;
      font-size: 0.875rem;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.5rem 0.75rem 0.5rem 2rem;
      transition: border-color 0.2s ease;
    }

    .search-input:hover {
      border-color: #93c5fd;
    }

    .search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      outline: none;
    }

    /* Table Styles */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8fafc !important;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      color: #64748b;
      padding: 0.75rem 1rem;
      border-color: #f1f5f9 !important;
      font-weight: 600;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      transition: background-color 0.2s ease;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: #f0f9ff !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
      border-color: #f1f5f9 !important;
      vertical-align: middle;
    }

    :host ::ng-deep .p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
      background-color: #f9fafb;
    }

    :host ::ng-deep .p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):hover {
      background-color: #f0f9ff !important;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .action-button {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .view-button {
      color: #3b82f6 !important;
      background-color: #eff6ff !important;
      border-color: #bfdbfe !important;
    }

    .view-button:hover {
      background-color: #dbeafe !important;
    }

    .edit-button {
      color: #6b7280 !important;
      background-color: #f3f4f6 !important;
      border-color: #e5e7eb !important;
    }

    .edit-button:hover {
      background-color: #e5e7eb !important;
    }

    .export-button {
      color: #10b981 !important;
      background-color: #ecfdf5 !important;
      border-color: #a7f3d0 !important;
    }

    .export-button:hover {
      background-color: #d1fae5 !important;
    }

    /* Empty State */
    .empty-state {
      padding: 3rem !important;
      text-align: center;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .empty-icon {
      font-size: 2rem;
      color: #cbd5e1;
    }

    .empty-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .empty-subtext {
      max-width: 300px;
    }

    /* Paginator */
    :host ::ng-deep .p-paginator {
      background: transparent;
      border: none;
      padding: 1rem;
      border-top: 1px solid #f1f5f9;
    }
    
    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #007AFF;
      border-color: #007AFF;
      color: white;
    }

    :host ::ng-deep .p-paginator .p-paginator-current {
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Dialog Styles */
    .dialog-grid {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }

    .dialog-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dialog-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .dialog-input {
      width: 100%;
      font-size: 0.875rem;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      background-color: #f9fafb;
    }

    .dialog-hint {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .dialog-button {
      min-width: 6rem;
    }

    .cancel-button {
      color: #6b7280 !important;
      background-color: #f3f4f6 !important;
      border-color: #e5e7eb !important;
    }

    .save-button {
      background-color: #007AFF !important;
      border-color: #007AFF !important;
    }

    /* Status Tags */
    .status-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      min-width: 100px;
      text-align: center;
    }

    /* Responsive Adjustments */
    @media (max-width: 1024px) {
      .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .p-4 {
        padding: 1rem;
      }

      .search-input {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
        gap: 0.25rem;
      }

      .action-button {
        width: 1.75rem;
        height: 1.75rem;
      }

      .status-tag {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        font-size: 0.8125rem;
      }
    }
  `]
})
export class SeuilComponent {


  stockItems: StockItem[] = [
    new StockItem(1, 'Produit 1', 5, 'Catégorie A', undefined, undefined, 'ART001', undefined, false, undefined, 10),
    new StockItem(2, 'Produit 2', 12, 'Catégorie B', undefined, undefined, 'ART002', undefined, false, undefined, 15),
    new StockItem(3, 'Produit 3', 8, 'Catégorie A', undefined, undefined, 'ART003', undefined, false, undefined, 10),
    new StockItem(4, 'Produit 4', 20, 'Catégorie C', undefined, undefined, 'ART004', undefined, false, undefined, 5),
    new StockItem(5, 'Produit 5', 3, 'Catégorie B', undefined, undefined, 'ART005', undefined, false, undefined, 5),
    new StockItem(6, 'Produit 6', 15, 'Catégorie A', undefined, undefined, 'ART006', undefined, false, undefined, 10),
    new StockItem(7, 'Produit 7', 10, 'Catégorie C', undefined, undefined, 'ART007', undefined, false, undefined, 10),
    new StockItem(8, 'Produit 8', 7, 'Catégorie B', undefined, undefined, 'ART008', undefined, false, undefined, 10),
    new StockItem(9, 'Produit 9', 25, 'Catégorie A', undefined, undefined, 'ART009', undefined, false, undefined, 20),
    new StockItem(10, 'Produit 10', 2, 'Catégorie C', undefined, undefined, 'ART010', undefined, false, undefined, 5)
  ];

  filteredItems: StockItem[] = [];
  searchText: string = '';
  displayEditDialog: boolean = false;
  selectedItem: StockItem = new StockItem(0, '', 0, '', undefined, undefined, '', undefined, false, undefined, 0);
  loading: boolean = false;
  
  // Filter options
  selectedStatuses: string[] = [];
  selectedCategory: string | null = null;
  
  statusOptions = [
    { label: 'Critique', value: 'danger', severity: 'danger' },
    { label: 'Avertissement', value: 'warning', severity: 'warning' },
    { label: 'Sûr', value: 'safe', severity: 'success' }
  ];
  
  categoryOptions = [
    { label: 'Toutes', value: null },
    { label: 'Catégorie A', value: 'Catégorie A' },
    { label: 'Catégorie B', value: 'Catégorie B' },
    { label: 'Catégorie C', value: 'Catégorie C' }
  ];

  tabs: MenuItem[] = [
    { label: 'Tous les articles', icon: 'pi pi-fw pi-list' },
    { label: 'Stock Critique', icon: 'pi pi-fw pi-exclamation-triangle' }
  ];
  activeTab: MenuItem = this.tabs[0];

  headerButtons = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      severity: 'secondary',
      outlined: true
    },
    {
      key: 'export',
      label: 'Exporter',
      icon: 'pi pi-download',
      severity: 'secondary'
    }
  ];

  constructor(
    private router: Router
  ) {
    this.filteredItems = [...this.stockItems];
    
  }


  





  /* Statistics Getters */
  get criticalItemsCount(): number {
    return this.stockItems.filter(item => this.getQuantityStatus(item.quantity, item.seuilMin) === 'danger').length;
  }

  get warningItemsCount(): number {
    return this.stockItems.filter(item => this.getQuantityStatus(item.quantity, item.seuilMin) === 'warning').length;
  }

  get safeItemsCount(): number {
    return this.stockItems.filter(item => this.getQuantityStatus(item.quantity, item.seuilMin) === 'safe').length;
  }

  get criticalPercentage(): number {
    return (this.criticalItemsCount / this.stockItems.length) * 100;
  }

  get warningPercentage(): number {
    return (this.warningItemsCount / this.stockItems.length) * 100;
  }

  get safePercentage(): number {
    return (this.safeItemsCount / this.stockItems.length) * 100;
  }

  get averageThreshold(): number {
    const itemsWithThreshold = this.stockItems.filter(item => item.seuilMin !== undefined);
    if (itemsWithThreshold.length === 0) return 0;
    return itemsWithThreshold.reduce((sum, item) => sum + (item.seuilMin || 0), 0) / itemsWithThreshold.length;
  }

  /* Core Methods */
  showEditDialog(item: StockItem) {
    this.selectedItem = new StockItem(
      item.id,
      item.name,
      item.quantity,
      item.category,
      item.entrepotId,
      item.seuil,
      item.code,
      item.lastUpdated,
      item.archived,
      item.seuilMax,
      item.seuilMin
    );
    this.displayEditDialog = true;
  }

  hideEditDialog() {
    this.displayEditDialog = false;
  }

  saveSeuilMin() {
    const index = this.stockItems.findIndex(i => i.id === this.selectedItem.id);
    if (index !== -1) {
      this.stockItems[index].seuilMin = this.selectedItem.seuilMin;
    }
    this.filteredItems = [...this.stockItems];
    this.displayEditDialog = false;
  }

  applySearch() {
    if (!this.searchText) {
      this.filteredItems = [...this.stockItems];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredItems = this.stockItems.filter(item => 
      (item.code?.toLowerCase().includes(searchTerm)) ||
      (item.name.toLowerCase().includes(searchTerm)) ||
      (item.category.toLowerCase().includes(searchTerm))
    );
  }

  applyStatusFilter() {
    if (this.selectedStatuses.length === 0) {
      this.filteredItems = [...this.stockItems];
      return;
    }

    this.filteredItems = this.stockItems.filter(item => 
      this.selectedStatuses.includes(this.getQuantityStatus(item.quantity, item.seuilMin))
    );
  }

  applyCategoryFilter() {
    if (!this.selectedCategory) {
      this.filteredItems = [...this.stockItems];
      return;
    }

    this.filteredItems = this.stockItems.filter(item => 
      item.category === this.selectedCategory
    );
  }

  getStatusText(quantity: number, seuilMin: number | undefined): string {
    const status = this.getQuantityStatus(quantity, seuilMin);
    return status === 'danger' ? 'Critique' : 
           status === 'warning' ? 'Avertissement' : 'Sûr';
  }

  getQuantityStatus(quantity: number, seuilMin: number | undefined): string {
    if (!seuilMin) return 'safe';
    
    if (quantity < seuilMin) {
      return 'danger';
    } else if (quantity <= seuilMin * 1.2) {
      return 'warning';
    } else {
      return 'safe';
    }
  }

  onTabChange(item: MenuItem) {
    this.activeTab = item;
    if (item.label === 'Stock Critique') {
      this.filteredItems = this.stockItems.filter(i => 
        this.getQuantityStatus(i.quantity, i.seuilMin) === 'danger'
      );
    } else {
      this.filteredItems = [...this.stockItems];
    }
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      console.log('Back button clicked');
    } else if (key === 'export') {
      this.exportData();
    }
  }

  exportData() {
    console.log('Exporting data...');
    // Implement your export logic here
  }

  exportItem(item: StockItem) {
    console.log('Exporting item:', item);
    // Implement single item export logic here
  }

  viewItem(item: StockItem) {
    console.log('Viewing item:', item);
    this.router.navigate(['/Gescom/frontOffice/Stock/ArticleListe/view']);
  }
}