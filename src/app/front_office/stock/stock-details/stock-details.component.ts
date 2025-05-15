import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { Entrepot } from '../../../models/entrepot.model';
import { StockItem } from '../../../models/stockItem.model';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';

// Add these imports for icons
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

interface StatusTab extends MenuItem {
  key: 'all' | 'active' | 'archive';
}

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TooltipModule,
    TabMenuModule,
    CardModule,
    DividerModule, // Added for dividers
    TagModule,     // Added for status tags
    HeaderBarComponent, 
    DataTableComponent
  ],
  template: `
    <!-- Header Bar -->
    <div class="p-4">
      <app-header-bar
        [title]="entrepot?.name + ' - Stock Overview'"
        [buttons]="headerButtons"
        [subtitle]="'Manage your stock efficiently'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <!-- Enhanced Statistics Card -->
      <div class="statistics-container mt-6 mb-6">
        <p-card class="statistics-card">
          <div class="flex flex-wrap justify-content-between gap-3">
            <!-- Total Articles -->
            <div class="stat-item">
              <div class="stat-icon bg-blue-100">
                <i class="pi pi-box text-blue-500"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Total Articles</span>
                <span class="stat-value">{{ totalArticles }}</span>
                <p-tag severity="info" value="All Items" class="mt-2"></p-tag>
              </div>
            </div>

            <p-divider layout="vertical"></p-divider>

            <!-- Active Articles -->
            <div class="stat-item">
              <div class="stat-icon bg-green-100">
                <i class="pi pi-check-circle text-green-500"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Active Articles</span>
                <span class="stat-value">{{ activeArticles }}</span>
                <p-tag severity="success" value="In Stock" class="mt-2"></p-tag>
              </div>
            </div>

            <p-divider layout="vertical"></p-divider>

            <!-- Archived Articles -->
            <div class="stat-item">
              <div class="stat-icon bg-purple-100">
                <i class="pi pi-ban text-purple-500"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Archived Articles</span>
                <span class="stat-value">{{ archivedArticles }}</span>
                <p-tag severity="warning" value="Archived" class="mt-2"></p-tag>
              </div>
            </div>

            <p-divider layout="vertical"></p-divider>

            <!-- Total Value -->
            <div class="stat-item">
              <div class="stat-icon bg-orange-100">
                <i class="pi pi-money-bill text-orange-500"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Total Value</span>
                <span class="stat-value">{{ totalValue | currency:'EUR':'symbol':'1.2-2' }}</span>
                <p-tag severity="info" [value]="valueTrend" class="mt-2"></p-tag>
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <app-data-table
  [data]="filteredItems"
  [columns]="tableColumns"
  [tabs]="statusTabs"
  [activeTab]="activeStatusTab"
  (tabChanged)="onStatusFilterChange($event)">
  
  <!-- Define the action buttons template -->
  <ng-template #actionTemplate let-item>
    <div class="flex gap-2">
      <button pButton 
              pTooltip="Adjust threshold" 
              icon="pi pi-sliders-h" 
              class="p-button-sm p-button-rounded p-button-text"
              (click)="adjustSeuil(item)"></button>
      
      <button pButton 
              pTooltip="Transfer item" 
              icon="pi pi-arrows-h" 
              class="p-button-sm p-button-rounded p-button-text"
              (click)="transferItem(item)"></button>
      
      <button pButton 
              pTooltip="Archive item" 
              icon="pi pi-ban" 
              class="p-button-sm p-button-rounded p-button-text"
              (click)="archiveItem(item)"></button>
    </div>
  </ng-template>
</app-data-table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
    }
    
    .p-4 {
      padding: 1.5rem;
    }

    /* Enhanced Statistics Card Styles */
    .statistics-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: none;
    }

    :host ::ng-deep .statistics-card .p-card-body {
      padding: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      flex: 1;
      min-width: 200px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }

    .stat-icon i {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0.25rem 0;
    }

    :host ::ng-deep .p-divider.p-divider-vertical {
      margin: 0 0.5rem;
      height: 60px;
      align-self: center;
    }

    .mb-6 {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .stat-item {
        min-width: 100%;
      }
      
      :host ::ng-deep .p-divider.p-divider-vertical {
        display: none;
      }
    }
  `]
})
export class StockDetailsComponent implements OnInit {
  entrepot?: Entrepot;
  stockItems: StockItem[] = [];
  filteredItems: StockItem[] = [];

  // Statistics properties
  totalArticles = 0;
  activeArticles = 0;
  archivedArticles = 0;
  totalValue = 0;
  valueTrend = 'Current Value';

  // Header Configuration
  headerButtons = [
    {
      key: 'back',
      label: 'Back to List',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];
  archiveItem(item: StockItem) {
    console.log('Archiving:', item);
    // Implement your archive logic here
    item.archived = true;
    this.filterItems(); // Refresh the filtered items
    this.calculateStatistics(); // Update statistics
  }
  // Table Configuration
  tableColumns = [
    { field: 'name', header: 'Article' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'seuil', header: 'Threshold' },
    { field: 'actions', header: 'Actions' }
  ];

  // Tab Configuration
  statusTabs: StatusTab[] = [
    { label: 'All', key: 'all' },
    { label: 'Active', key: 'active' },
    { label: 'Archive', key: 'archive' }
  ];
  activeStatusTab: StatusTab = this.statusTabs[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const navigationState = history.state;
    if (navigationState) {
      this.entrepot = navigationState.entrepot;
      this.stockItems = navigationState.stockItems || [];
      this.filteredItems = [...this.stockItems];
      this.calculateStatistics();
    }
  }

  calculateStatistics() {
    this.totalArticles = this.stockItems.length;
    this.activeArticles = this.stockItems.filter(item => !item.archived).length;
    this.archivedArticles = this.stockItems.filter(item => item.archived).length;
    this.totalValue = this.stockItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    
    // Add some logic for value trend (example)
    this.valueTrend = this.totalValue > 10000 ? 'High Value' : 'Standard';
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.goBack();
    }
  }

  onStatusFilterChange(tab: MenuItem) {
    this.activeStatusTab = tab as StatusTab;
    this.filterItems();
  }

  filterItems() {
    const tab = this.activeStatusTab;
    
    switch(tab.key) {
      case 'active':
        this.filteredItems = this.stockItems.filter(item => !item.archived);
        break;
      case 'archive':
        this.filteredItems = this.stockItems.filter(item => item.archived);
        break;
      default: // 'all'
        this.filteredItems = [...this.stockItems];
    }
  }

  adjustSeuil(item: StockItem) {
    console.log('Adjusting seuil for:', item);
  }

  transferItem(item: StockItem) {
    console.log('Transferring:', item);
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/Stock/StockManagement']);
  }
}