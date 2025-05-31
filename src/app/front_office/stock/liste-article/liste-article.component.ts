import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

interface StatusTab extends MenuItem {
  key: 'all' | 'active' | 'archive';
}

interface StockItem {
  id: number;
  codeArticle: string;
  designation: string;
  marque: string;
  category: string;
  tva: number;
  marge: number;
  prixRevient: number;
  prixVenteHT: number;
  archived: boolean;
}

@Component({
  selector: 'app-liste-article',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TooltipModule,
    TabMenuModule,
    CardModule,
    ProgressBarModule,
    HeaderBarComponent, 
    DataTableComponent
  ],
  template: `
    <!-- Header Bar -->
    <div class="p-4">
      <app-header-bar
        [title]="'Gestion des Articles'"
        [buttons]="headerButtons"
        [subtitle]="'Gérez vos articles efficacement'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <!-- Statistics Cards - Reduced bottom margin -->
      <div class="flex flex-row gap-2 mt-6">  <!-- Changed to mb-1 for tighter spacing -->
        <!-- Total Articles Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Total Articles</span>
              <div class="text-900 font-medium text-xl">{{ totalItems }}</div>
              <div class="mt-2">
                <small class="text-green-500 font-medium">{{ activeItems }} actifs </small>
                <small class="text-500 ml-2">{{ archivedItems }} archivés</small>
              </div>
            </div>
            <div class="bg-blue-100 p-3 border-round" style="background-color: var(--blue-100)">
              <i class="pi pi-box text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Average Margin Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Moyenne Marge</span>
              <div class="text-900 font-medium text-xl">{{ averageMargin }}%</div>
              <div class="mt-2">
                <p-progressBar [value]="averageMargin" [showValue]="false" 
                  [style]="{height: '6px', width: '100%'}" 
                  [styleClass]="averageMargin >= 0 ? 'progress-positive' : 'progress-negative'">
                </p-progressBar>
              </div>
            </div>
            <div class="bg-green-100 p-3 border-round" style="background-color: var(--green-100)">
              <i class="pi pi-chart-line text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Average Price Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Prix Moyen HT</span>
              <div class="text-900 font-medium text-xl">{{ averagePriceHT.toFixed(3) }} TND</div>
              <div class="mt-2">
                <small class="text-500">Min: {{ minPriceHT.toFixed(3) }} TND</small>
                <small class="text-500 ml-2">Max: {{ maxPriceHT.toFixed(3) }} TND</small>
              </div>
            </div>
            <div class="bg-orange-100 p-3 border-round" style="background-color: var(--orange-100)">
              <i class="pi pi-money-bill text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Categories Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Catégories</span>
              <div class="text-900 font-medium text-xl">{{ categories.length }}</div>
              <div class="mt-2">
                <small class="text-500">Top: {{ topCategory }}</small>
              </div>
            </div>
            <div class="bg-purple-100 p-3 border-round" style="background-color: var(--purple-100)">
              <i class="pi pi-tags text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table - Now closer to stats cards -->
      <app-data-table
        [data]="filteredItems"
        [columns]="tableColumns"
        [tabs]="statusTabs"
        [activeTab]="activeStatusTab"
        (tabChanged)="onStatusFilterChange($event)"
        (search)="onSearch($event)">
        
        <ng-template #actionTemplate let-row>
          <div class="flex gap-2">
            <button pButton icon="pi pi-pencil" rounded outlined class="p-button-lg" severity="danger" (click)="editItem(row)"></button>
            <button pButton icon="pi pi-eye" rounded outlined class="p-button-lg" severity="info" (click)="viewItem(row)"></button>
          </div>
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: [`
    .p-4 {
      padding: 1.5rem;
    }

    :host {
      display: block;
      background-color: #f8fafc;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
    }
    .negative-marge {
      color: #ef4444;
    }
    .positive-marge {
      color: #10b981;
    }
    .progress-positive ::ng-deep .p-progressbar-value {
      background-color: #10b981;
    }
    .progress-negative ::ng-deep .p-progressbar-value {
      background-color: #ef4444;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 1rem;
      border-radius: 10px;
      min-width: 250px;
    }
    .shadow-1 {
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    .border-round {
      border-radius: 50%;
    }
  `]
})
export class ListeArticleComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  stockItems: StockItem[] = [
    {
      id: 1,
      codeArticle: 'P-0001',
      designation: 'Système de chauffage central',
      marque: 'ThermoPlus',
      category: 'Chauffage',
      tva: 19,
      marge: 25,
      prixRevient: 1200,
      prixVenteHT: 1500,
      archived: false
    },
    {
      id: 2,
      codeArticle: 'P-0002',
      designation: 'Ventilateur industriel',
      marque: 'AirFlow',
      category: 'Ventilation',
      tva: 19,
      marge: 30,
      prixRevient: 450,
      prixVenteHT: 585,
      archived: false
    },
    {
      id: 3,
      codeArticle: 'P-0003',
      designation: 'Thermostat intelligent',
      marque: 'SmartHome',
      category: 'Automatisation',
      tva: 19,
      marge: -5,
      prixRevient: 200,
      prixVenteHT: 190,
      archived: false
    },
    {
      id: 4,
      codeArticle: 'P-0004',
      designation: 'Radiateur électrique',
      marque: 'HeatMaster',
      category: 'Chauffage',
      tva: 19,
      marge: 15,
      prixRevient: 300,
      prixVenteHT: 345,
      archived: true
    },
    {
      id: 5,
      codeArticle: 'P-0005',
      designation: 'Climatiseur mural',
      marque: 'CoolAir',
      category: 'Climatisation',
      tva: 19,
      marge: 40,
      prixRevient: 800,
      prixVenteHT: 1120,
      archived: false
    }
  ];
  
  filteredItems: StockItem[] = [...this.stockItems];
  currentFilteredItems: StockItem[] = [...this.stockItems];
  searchTerm: string = '';

  categories = Array.from(new Set(this.stockItems.map(item => item.category)));

  get totalItems(): number {
    return this.stockItems.length;
  }

  get activeItems(): number {
    return this.stockItems.filter(item => !item.archived).length;
  }

  get archivedItems(): number {
    return this.stockItems.filter(item => item.archived).length;
  }

  get averageMargin(): number {
    const sum = this.stockItems.reduce((acc, item) => acc + item.marge, 0);
    return parseFloat((sum / this.stockItems.length).toFixed(1));
  }

  get averagePriceHT(): number {
    const sum = this.stockItems.reduce((acc, item) => acc + item.prixVenteHT, 0);
    return sum / this.stockItems.length;
  }

  get minPriceHT(): number {
    return Math.min(...this.stockItems.map(item => item.prixVenteHT));
  }

  get maxPriceHT(): number {
    return Math.max(...this.stockItems.map(item => item.prixVenteHT));
  }

  get topCategory(): string {
    const categoryCounts = this.stockItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
  }

  headerButtons = [
    {
      key: 'Exporter',
      label: 'Exporter',
      icon: 'pi pi-file-export',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    },
    {
      key: 'add',
      label: 'Ajouter',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'codeArticle', header: 'Code Article' },
    { field: 'designation', header: 'Désignation' },
    { field: 'marque', header: 'Marque' },
    { field: 'category', header: 'Catégorie' },
    { 
      field: 'tva', 
      header: 'TVA (%)',
      body: (item: StockItem) => `${item.tva}%`
    },
    { 
      field: 'marge', 
      header: 'Marge (%)',
      body: (item: StockItem) => {
        const margeClass = item.marge >= 0 ? 'positive-marge' : 'negative-marge';
        return `<span class="${margeClass}">${item.marge}%</span>`;
      }
    },
    { 
      field: 'prixRevient', 
      header: 'Prix Revient (TND)',
      body: (item: StockItem) => `${item.prixRevient.toFixed(3)} TND`
    },
    { 
      field: 'prixVenteHT', 
      header: 'Prix Vente HT (TND)',
      body: (item: StockItem) => `${item.prixVenteHT.toFixed(3)} TND`
    },
    { 
      field: 'actions', 
      header: 'Actions',
      isTemplate: true
    }
  ];

  statusTabs: StatusTab[] = [
    { label: 'Tous', key: 'all' } as StatusTab,
    { label: 'Actifs', key: 'active' } as StatusTab,
    { label: 'Archivés', key: 'archive' } as StatusTab
  ];
  activeStatusTab: StatusTab = this.statusTabs[0];

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
    this.applyFilters();
  }

  onStatusFilterChange(tab: MenuItem) {
    this.activeStatusTab = tab as StatusTab;
    this.applyFilters();
  }

  applyFilters() {
    // First apply status filter
    let filtered = [...this.stockItems];
    
    switch(this.activeStatusTab.key) {
      case 'active':
        filtered = filtered.filter(item => !item.archived);
        break;
      case 'archive':
        filtered = filtered.filter(item => item.archived);
        break;
    }

    // Then apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(item => 
        item.codeArticle.toLowerCase().includes(this.searchTerm) ||
        item.designation.toLowerCase().includes(this.searchTerm) ||
        item.marque.toLowerCase().includes(this.searchTerm) ||
        item.category.toLowerCase().includes(this.searchTerm) ||
        item.tva.toString().includes(this.searchTerm) ||
        item.marge.toString().includes(this.searchTerm) ||
        item.prixRevient.toString().includes(this.searchTerm) ||
        item.prixVenteHT.toString().includes(this.searchTerm)
      );
    }

    this.filteredItems = filtered;
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      console.log('Back button clicked');
      this.goBack();
    } else if (key === 'add') {
      console.log('Add new item');
      this.goToAdd();
    }
  }

  viewItem(item: StockItem) {
    console.log('Viewing item:', item);
    this.router.navigate(['/Gescom/frontOffice/Stock/ArticleListe/view']);
  }

  editItem(item: StockItem) {
    console.log('Editing item:', item);
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/Stock/StockManagement']);
  }

  goToAdd() {
    this.router.navigate(['/Gescom/frontOffice/Stock/ArticleAdd']);
  }
}