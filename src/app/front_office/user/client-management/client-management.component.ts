import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ClientDisplayDialogComponent} from './client-view-dialog/client-view-dialog.component';
import { ClientEditDialogComponent } from './client-edit-dialog/client-edit-dialog.component';

interface StatusTab extends MenuItem {
  key: 'all' | 'active' | 'inactive';
}

export interface Client {
  id: number;
  code: string;
  matriculeFiscale: string;
  nomRaisonSociale: string;
  telephone: string;
  adresse: string;
  email: string;
  category: 'particulier' | 'entreprise' | 'gouvernement';
  facturesPayees: number;
  facturesImpayees: number;
  montantDettesPayees: number;
  montantDettesImpayees: number;
  creditMax: number;
  active: boolean;
  dateCreation: Date;
  dernierAchat?: Date;
}

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TooltipModule,
    TabMenuModule, CardModule, ProgressBarModule,
    HeaderBarComponent, DataTableComponent, TagModule,
    DialogModule, DropdownModule, AvatarModule, 
    InputSwitchModule, BadgeModule, DividerModule,
    FormsModule, CurrencyPipe, InputGroupModule, InputGroupAddonModule,
    ClientDisplayDialogComponent, ClientEditDialogComponent
  ],
  template: `
    <div class="client-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <app-header-bar
          [title]="'Gestion des Clients'"
          [buttons]="headerButtons"
          [subtitle]="'Gérez vos clients efficacement'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <!-- Total Clients -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Total Clients</span>
              <span class="stat-value">{{ totalClients }}</span>
              <div class="stat-meta">
                <span class="active-count">{{ activeClients }} actifs</span>
                <span class="inactive-count">{{ inactiveClients }} inactifs</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-users"></i>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Dettes Impayées</span>
              <span class="stat-value">{{ totalUnpaidDebts | currency:'TND' }}</span>
              <div class="stat-progress">
                <p-progressBar 
                  [value]="debtPercentage" 
                  [showValue]="false" 
                  [styleClass]="debtPercentage > 30 ? 'progress-bar-danger' : 'progress-bar-warning'">
                </p-progressBar>
                <span class="progress-text">{{ debtPercentage }}% du crédit total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-money-bill"></i>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Nouveaux (30j)</span>
              <span class="stat-value">{{ newClientsThisMonth }}</span>
              <div class="stat-meta">
                <span>{{ newClientsPercentage }}% du total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-user-plus"></i>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Catégories</span>
              <span class="stat-value">{{ categories.length }}</span>
              <div class="stat-meta">
                <span class="main-category">Principal: {{ mainCategory }}</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-tags"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="table-section">
        <app-data-table
          [data]="filteredClients"
          [columns]="tableColumns"
          [tabs]="statusTabs"
          [activeTab]="activeStatusTab"
          (tabChanged)="onStatusFilterChange($event)"
          (search)="onSearch($event)">
          
          <ng-template #actionTemplate let-row>
            <div class="action-buttons">
              <button pButton severity="info" icon="pi pi-eye" 
                      class="action-button view-button"
                      (click)="viewClient(row)"></button>
              <button pButton severity="contrast" icon="pi pi-pencil" 
                      class="action-button edit-button"
                      (click)="editClient(row)"></button>
              <p-inputSwitch [(ngModel)]="row.active" 
                            (onChange)="toggleClientStatus(row)"
                            class="status-switch"></p-inputSwitch>
            </div>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Client Dialogs -->
      <app-client-display-dialog 
        [visible]="showViewDialog" 
        [client]="selectedClient">
      </app-client-display-dialog>

      <app-client-edit-dialog 
        [visible]="showEditDialog" 
        [client]="selectedClient"
        (save)="saveClient($event)"
        (cancel)="onEditCancel()">
      </app-client-edit-dialog>
    </div>
  `,
  styles: [`
    .client-management-container {
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

    .main-category {
      color: #6366f1;
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
export class ClientManagementComponent {
  clients: Client[] = [
    {
      id: 1,
      code: 'CLI-001',
      matriculeFiscale: '12345678A',
      nomRaisonSociale: 'SARL Technologie Plus',
      telephone: '70123456',
      adresse: '12 Rue de la République, Tunis',
      email: 'contact@technoplus.tn',
      category: 'entreprise',
      facturesPayees: 12,
      facturesImpayees: 2,
      montantDettesPayees: 45000,
      montantDettesImpayees: 8500,
      creditMax: 100000,
      active: true,
      dateCreation: new Date('2023-01-15'),
      dernierAchat: new Date('2023-10-05')
    },
    {
      id: 2,
      code: 'CLI-002',
      matriculeFiscale: '87654321B',
      nomRaisonSociale: 'Mohamed Ben Salah',
      telephone: '98123456',
      adresse: '45 Avenue Habib Bourguiba, Sousse',
      email: 'mohamed.bensalah@email.com',
      category: 'particulier',
      facturesPayees: 5,
      facturesImpayees: 1,
      montantDettesPayees: 12000,
      montantDettesImpayees: 3000,
      creditMax: 20000,
      active: true,
      dateCreation: new Date('2023-03-22')
    },
    {
      id: 3,
      code: 'CLI-003',
      matriculeFiscale: '11223344C',
      nomRaisonSociale: 'Ministère de la Santé',
      telephone: '70223344',
      adresse: 'Place du Gouvernement, Tunis',
      email: 'contact@sante.gov.tn',
      category: 'gouvernement',
      facturesPayees: 24,
      facturesImpayees: 0,
      montantDettesPayees: 180000,
      montantDettesImpayees: 0,
      creditMax: 500000,
      active: true,
      dateCreation: new Date('2023-02-10')
    }
  ];

  filteredClients = [...this.clients];
  searchTerm: string = '';
  
  statusTabs: StatusTab[] = [
    { label: 'Tous', key: 'all' },
    { label: 'Actifs', key: 'active' },
    { label: 'Inactifs', key: 'inactive' }
  ];
  activeStatusTab = this.statusTabs[0];

  // Dialogs
  showViewDialog = false;
  showEditDialog = false;
  selectedClient: Client | null = null;

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
      field: 'category', 
      header: 'Catégorie',
      body: (client: Client) => {
        switch(client.category) {
          case 'particulier': return '<span class="text-blue-500">Particulier</span>';
          case 'entreprise': return '<span class="text-green-500">Entreprise</span>';
          case 'gouvernement': return '<span class="text-purple-500">Gouvernement</span>';
          default: return client.category;
        }
      }
    },
    { field: 'telephone', header: 'Téléphone' },
    { 
      field: 'facturesImpayees', 
      header: 'Factures Impayées',
      body: (client: Client) => `
        <span class="font-bold ${client.facturesImpayees > 0 ? 'text-red-500' : 'text-green-500'}">
          ${client.facturesImpayees}
        </span>
      `
    },
    { 
      field: 'montantDettesImpayees', 
      header: 'Dette (TND)',
      body: (client: Client) => `${client.montantDettesImpayees} TND`
    },
    { 
      field: 'dernierAchat', 
      header: 'Dernier Achat',
      body: (client: Client) => {
        if (!client.dernierAchat) return 'N/A';
        const datePipe = new DatePipe('fr-FR');
        return datePipe.transform(client.dernierAchat, 'dd/MM/yyyy') || 'N/A';
      }
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  // Statistics
  get totalClients(): number {
    return this.clients.length;
  }

  get activeClients(): number {
    return this.clients.filter(c => c.active).length;
  }

  get inactiveClients(): number {
    return this.clients.filter(c => !c.active).length;
  }

  get totalUnpaidDebts(): number {
    return this.clients.reduce((sum, client) => sum + client.montantDettesImpayees, 0);
  }

  get debtPercentage(): number {
    const totalCredit = this.clients.reduce((sum, client) => sum + client.creditMax, 0);
    return totalCredit > 0 ? Math.round((this.totalUnpaidDebts / totalCredit) * 100) : 0;
  }

  get newClientsThisMonth(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.clients.filter(c => c.dateCreation > oneMonthAgo).length;
  }

  get newClientsPercentage(): number {
    return Math.round((this.newClientsThisMonth / this.totalClients) * 100);
  }

  get categories(): {name: string, value: string}[] {
    return [
      { name: 'Particulier', value: 'particulier' },
      { name: 'Entreprise', value: 'entreprise' },
      { name: 'Gouvernement', value: 'gouvernement' }
    ];
  }

  get mainCategory(): string {
    const counts = this.clients.reduce((acc, client) => {
      acc[client.category] = (acc[client.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const [category] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return this.categories.find(c => c.value === category)?.name || '';
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
    let filtered = [...this.clients];
    
    switch(this.activeStatusTab.key) {
      case 'active':
        filtered = filtered.filter(c => c.active);
        break;
      case 'inactive':
        filtered = filtered.filter(c => !c.active);
        break;
    }

    // Then apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(client => 
        client.code.toLowerCase().includes(this.searchTerm) ||
        client.nomRaisonSociale.toLowerCase().includes(this.searchTerm) ||
        client.matriculeFiscale.toLowerCase().includes(this.searchTerm) ||
        client.telephone.toLowerCase().includes(this.searchTerm) ||
        client.adresse.toLowerCase().includes(this.searchTerm) ||
        client.email.toLowerCase().includes(this.searchTerm) ||
        client.category.toLowerCase().includes(this.searchTerm) ||
        client.facturesPayees.toString().includes(this.searchTerm) ||
        client.facturesImpayees.toString().includes(this.searchTerm) ||
        client.montantDettesPayees.toString().includes(this.searchTerm) ||
        client.montantDettesImpayees.toString().includes(this.searchTerm) ||
        (client.dernierAchat && 
          client.dernierAchat.toLocaleDateString().toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredClients = filtered;
  }

  viewClient(client: Client) {
    this.selectedClient = {...client};
    this.showViewDialog = true;
  }

  editClient(client: Client) {
    this.selectedClient = {...client};
    this.showEditDialog = true;
  }

  saveClient(client: Client) {
    if (!client) return;
    
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      this.clients[index] = {...client};
      this.applyFilters();
    }
    
    this.showEditDialog = false;
    this.selectedClient = null;
  }

  onEditCancel() {
    this.showEditDialog = false;
    this.selectedClient = null;
  }

  toggleClientStatus(client: Client) {
    client.active = !client.active;
    this.applyFilters();
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      console.log('Back button clicked');
    } else if (key === 'add') {
      console.log('Add new client');
    } else if (key === 'export') {
      console.log('Export clients');
    }
  }
}