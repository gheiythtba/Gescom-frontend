import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { SupplierDisplayDialogComponent } from './supplier-display-dialog/supplier-display-dialog.component';
import { SupplierEditDialogComponent } from './supplier-edit-dialog/supplier-edit-dialog.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

interface StatusTab extends MenuItem {
  key: 'all' | 'active' | 'inactive';
}

interface Supplier {
  id: number;
  code: string;
  matriculeFiscale: string;
  nomRaisonSociale: string;
  telephone: string;
  adresse: string;
  email: string;
  commandesLivrees: number;
  commandesEnAttente: number;
  montantTotalCommandes: number;
  numeroCamion: string[];
  delaiLivraisonMoyen: number;
  conditionsPaiement: string;
  active: boolean;
  dateCreation: Date;
  dernierLivraison?: Date;
}

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TooltipModule, SupplierEditDialogComponent,
    TabMenuModule, CardModule, ProgressBarModule, TagModule, FormsModule,
    HeaderBarComponent, DataTableComponent, CurrencyPipe, SupplierDisplayDialogComponent, InputSwitchModule
  ],
  template: `
    <div class="supplier-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <app-header-bar
          [title]="'Gestion des Fournisseurs'"
          [buttons]="headerButtons"
          [subtitle]="'Gérez vos fournisseurs efficacement'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <!-- Total Suppliers -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Total Fournisseurs</span>
              <span class="stat-value">{{ totalSuppliers }}</span>
              <div class="stat-meta">
                <span class="active-count">{{ activeSuppliers }} actifs</span>
                <span class="inactive-count">{{ inactiveSuppliers }} inactifs</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-truck"></i>
            </div>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Commandes en Attente</span>
              <span class="stat-value">{{ totalPendingOrders }}</span>
              <div class="stat-progress">
                <p-progressBar 
                  [value]="pendingOrdersPercentage" 
                  [showValue]="false" 
                  [styleClass]="pendingOrdersPercentage > 20 ? 'progress-bar-danger' : 'progress-bar-warning'">
                </p-progressBar>
                <span class="progress-text">{{ pendingOrdersPercentage }}% des commandes</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-shopping-cart"></i>
            </div>
          </div>
        </div>

        <!-- Delivery Performance -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Délai Moyen</span>
              <span class="stat-value">{{ averageDeliveryTime }}j</span>
              <div class="stat-meta">
                <span [class.text-green-500]="onTimeDeliveryPercentage > 90" 
                      [class.text-yellow-500]="onTimeDeliveryPercentage <= 90">
                  {{ onTimeDeliveryPercentage }}% à temps
                </span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-clock"></i>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Volume d'Achats</span>
              <span class="stat-value">{{ totalPurchaseVolume | currency:'TND' }}</span>
              <div class="stat-meta">
                <span>{{ suppliersWithCredit.length }} avec crédit</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-chart-line"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="table-section">
        <app-data-table
          [data]="filteredSuppliers"
          [columns]="tableColumns"
          [tabs]="statusTabs"
          [activeTab]="activeStatusTab"
          (tabChanged)="onStatusFilterChange($event)"
          (search)="onSearch($event)">
          
          <ng-template #actionTemplate let-row>
            <div class="action-buttons">
              <button pButton severity="info" icon="pi pi-eye" 
                      class="action-button view-button"
                      (click)="viewSupplier(row)"></button>
              <button pButton severity="contrast" icon="pi pi-pencil" 
                      class="action-button edit-button"
                      (click)="editSupplier(row)"></button>
              <p-inputSwitch [(ngModel)]="row.active" 
                            (onChange)="toggleSupplierStatus(row)"
                            class="status-switch"></p-inputSwitch>
            </div>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Supplier Dialogs -->
      <app-supplier-display-dialog 
        [visible]="displayDialogVisible"
        [supplier]="selectedSupplier">
      </app-supplier-display-dialog>

      <app-supplier-edit-dialog 
        [visible]="editDialogVisible"
        [supplier]="selectedSupplier"
        (save)="onSaveSupplier($event)"
        (cancel)="onCancelEdit()">
      </app-supplier-edit-dialog>
    </div>
  `,
  styles: [`
    .supplier-management-container {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .stat-text {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
    }

    .active-count {
      color: #10b981;
    }

    .inactive-count {
      color: #64748b;
    }

    .text-green-500 {
      color: #10b981;
    }

    .text-yellow-500 {
      color: #f59e0b;
    }

    .stat-progress {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .stat-icon {
      background-color: #f1f5f9;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .stat-icon i {
      font-size: 1.25rem;
    }

    .table-section {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .action-button {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-switch {
      margin-left: 0.5rem;
    }

    /* Table Styles */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8fafc;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: #f8fafc;
    }

    /* Progress Bar */
    :host ::ng-deep .p-progressbar {
      background-color: #e2e8f0;
      height: 6px;
      border-radius: 3px;
    }

    :host ::ng-deep .p-progressbar .p-progressbar-value {
      background-color: #10b981;
      border-radius: 3px;
    }

    :host ::ng-deep .progress-bar-danger .p-progressbar-value {
      background-color: #ef4444;
    }

    :host ::ng-deep .progress-bar-warning .p-progressbar-value {
      background-color: #f59e0b;
    }
  `]
})
export class SupplierManagementComponent {
  suppliers: Supplier[] = [
    {
      id: 1,
      code: 'FOUR-001',
      matriculeFiscale: '99887766A',
      nomRaisonSociale: 'SARL Matériaux Tunisie',
      telephone: '71234567',
      adresse: 'Zone Industrielle, Ben Arous',
      email: 'contact@materiaux.tn',
      commandesLivrees: 45,
      commandesEnAttente: 3,
      montantTotalCommandes: 125000,
      numeroCamion: ['TU-1234', 'TU-5678'],
      delaiLivraisonMoyen: 2,
      conditionsPaiement: 'NET-30',
      active: true,
      dateCreation: new Date('2022-11-15'),
      dernierLivraison: new Date('2023-10-10')
    },
    {
      id: 2,
      code: 'FOUR-002',
      matriculeFiscale: '55443322B',
      nomRaisonSociale: 'EURL Pièces Auto',
      telephone: '98223344',
      adresse: 'Rue de l\'Industrie, Sfax',
      email: 'info@piecesauto.tn',
      commandesLivrees: 32,
      commandesEnAttente: 5,
      montantTotalCommandes: 87000,
      numeroCamion: ['TU-9012'],
      delaiLivraisonMoyen: 3,
      conditionsPaiement: 'NET-15',
      active: true,
      dateCreation: new Date('2023-02-20')
    },
    {
      id: 3,
      code: 'FOUR-003',
      matriculeFiscale: '11223344C',
      nomRaisonSociale: 'Import Export Mediterranée',
      telephone: '70224455',
      adresse: 'Port de Tunis, La Goulette',
      email: 'contact@medimport.tn',
      commandesLivrees: 78,
      commandesEnAttente: 0,
      montantTotalCommandes: 320000,
      numeroCamion: ['TU-3456', 'TU-7890', 'TU-1111'],
      delaiLivraisonMoyen: 1,
      conditionsPaiement: 'NET-45',
      active: false,
      dateCreation: new Date('2021-09-05'),
      dernierLivraison: new Date('2023-09-28')
    }
  ];

  filteredSuppliers = [...this.suppliers];
  searchTerm: string = '';
  
  statusTabs: StatusTab[] = [
    { label: 'Tous', key: 'all' },
    { label: 'Actifs', key: 'active' },
    { label: 'Inactifs', key: 'inactive' }
  ];
  activeStatusTab = this.statusTabs[0];

  // Dialog states
  displayDialogVisible = false;
  editDialogVisible = false;
  selectedSupplier: Supplier | null = null;

  headerButtons = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    },
    {
      key: 'export',
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
    { field: 'code', header: 'Code' },
    { field: 'nomRaisonSociale', header: 'Nom/Raison Sociale' },
    { 
      field: 'commandesEnAttente', 
      header: 'Commandes en Attente',
      body: (supplier: Supplier) => `
        <span class="font-bold ${supplier.commandesEnAttente > 0 ? 'text-orange-500' : 'text-green-500'}">
          ${supplier.commandesEnAttente}
        </span>
      `
    },
    { 
      field: 'delaiLivraisonMoyen', 
      header: 'Délai Livraison',
      body: (supplier: Supplier) => `
        <span class="font-bold ${supplier.delaiLivraisonMoyen > 2 ? 'text-red-500' : 'text-green-500'}">
          ${supplier.delaiLivraisonMoyen} jours
        </span>
      `
    },
    { 
      field: 'numeroCamion', 
      header: 'Camions',
      body: (supplier: Supplier) => supplier.numeroCamion.map(num => 
        `<p-tag value="${num}" styleClass="mr-1"></p-tag>`
      ).join('')
    },
    {
      field: 'dernierAchat', 
      header: 'Dernier Achat',
      body: (supplier: Supplier) => {
        if (!supplier.dernierLivraison) return 'N/A';
        const datePipe = new DatePipe('fr-FR');
        return datePipe.transform(supplier.dernierLivraison, 'dd/MM/yyyy') || 'N/A';
      }
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  // Statistics
  get totalSuppliers(): number {
    return this.suppliers.length;
  }

  get activeSuppliers(): number {
    return this.suppliers.filter(s => s.active).length;
  }

  get inactiveSuppliers(): number {
    return this.suppliers.filter(s => !s.active).length;
  }

  get totalPendingOrders(): number {
    return this.suppliers.reduce((sum, supplier) => sum + supplier.commandesEnAttente, 0);
  }

  get pendingOrdersPercentage(): number {
    const totalOrders = this.suppliers.reduce((sum, supplier) => 
      sum + supplier.commandesLivrees + supplier.commandesEnAttente, 0);
    return totalOrders > 0 ? Math.round((this.totalPendingOrders / totalOrders) * 100) : 0;
  }

  get averageDeliveryTime(): number {
    const total = this.suppliers.reduce((sum, supplier) => sum + supplier.delaiLivraisonMoyen, 0);
    return Math.round(total / this.suppliers.length);
  }

  get onTimeDeliveryPercentage(): number {
    const onTimeSuppliers = this.suppliers.filter(s => s.delaiLivraisonMoyen <= 2).length;
    return Math.round((onTimeSuppliers / this.suppliers.length) * 100);
  }

  get totalPurchaseVolume(): number {
    return this.suppliers.reduce((sum, supplier) => sum + supplier.montantTotalCommandes, 0);
  }

  get suppliersWithCredit(): Supplier[] {
    return this.suppliers.filter(s => s.conditionsPaiement.includes('NET'));
  }

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
    let filtered = [...this.suppliers];
    
    switch(this.activeStatusTab.key) {
      case 'active':
        filtered = filtered.filter(s => s.active);
        break;
      case 'inactive':
        filtered = filtered.filter(s => !s.active);
        break;
    }

    // Then apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.code.toLowerCase().includes(this.searchTerm) ||
        supplier.nomRaisonSociale.toLowerCase().includes(this.searchTerm) ||
        supplier.matriculeFiscale.toLowerCase().includes(this.searchTerm) ||
        supplier.telephone.toLowerCase().includes(this.searchTerm) ||
        supplier.adresse.toLowerCase().includes(this.searchTerm) ||
        supplier.email.toLowerCase().includes(this.searchTerm) ||
        supplier.conditionsPaiement.toLowerCase().includes(this.searchTerm) ||
        supplier.numeroCamion.some(num => num.toLowerCase().includes(this.searchTerm)) ||
        (supplier.dernierLivraison && 
          supplier.dernierLivraison.toLocaleDateString().toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredSuppliers = filtered;
  }

  viewSupplier(supplier: Supplier) {
    this.selectedSupplier = { ...supplier };
    this.displayDialogVisible = true;
  }

  editSupplier(supplier: Supplier) {
    this.selectedSupplier = { ...supplier };
    this.editDialogVisible = true;
  }

  toggleSupplierStatus(supplier: Supplier) {
    supplier.active = !supplier.active;
    this.applyFilters();
  }

  onSaveSupplier(updatedSupplier: Supplier) {
    const index = this.suppliers.findIndex(s => s.id === updatedSupplier.id);
    if (index !== -1) {
      this.suppliers[index] = updatedSupplier;
      this.applyFilters();
    }
    this.editDialogVisible = false;
    this.selectedSupplier = null;
  }

  onCancelEdit() {
    this.editDialogVisible = false;
    this.selectedSupplier = null;
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      //this.goBack();
    } else if (key === 'add') {
      // Create a new supplier
      this.selectedSupplier = {
        id: this.generateNewId(),
        code: '',
        matriculeFiscale: '',
        nomRaisonSociale: '',
        telephone: '',
        adresse: '',
        email: '',
        commandesLivrees: 0,
        commandesEnAttente: 0,
        montantTotalCommandes: 0,
        numeroCamion: [],
        delaiLivraisonMoyen: 0,
        conditionsPaiement: '',
        active: true,
        dateCreation: new Date()
      };
      this.editDialogVisible = true;
    } else if (key === 'export') {
      //this.exportUsers();
    }
  }

  private generateNewId(): number {
    return Math.max(...this.suppliers.map(s => s.id), 0) + 1;
  }
}