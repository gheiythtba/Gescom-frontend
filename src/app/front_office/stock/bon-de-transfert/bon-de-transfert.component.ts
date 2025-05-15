import { Component } from '@angular/core';
import { HeaderButton } from '../../Reusable-component/header-bar.component';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

interface StatusTab extends MenuItem {
  key: 'all' | 'pending' | 'completed' | 'cancelled';
}

export interface TransferItem {
  id: number;
  reference: string;
  originDocument: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: Date;
  shipmentDate: Date;
  creationDate: Date;
  itemsCount: number;
  items: TransferItemArticle[];
  companyDetails: {
    name: string;
    address: string;
    phone: string;
    mobiles: string[];
    email: string;
    cif: string;
    stat: string;
    nif: string;
  };
}

export interface TransferItemArticle {
  id: number;
  code: string;
  designation: string;
  supplierReference: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  totalPrice?: number;
}

@Component({
  selector: 'app-bon-de-transfert',
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
    <div class="p-4">
      <app-header-bar
        title="Bon de Transfert"
        subtitle="Gérez les transferts entre entrepôts"
        [buttons]="headerButtons"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <!-- Statistics Cards -->
      <div class="flex flex-row gap-2 mt-6">
        <!-- Total Transfers Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Total Transferts</span>
              <div class="text-900 font-medium text-xl">{{ totalTransfers }}</div>
              <div class="mt-2">
                <small class="text-green-500 font-medium">{{ completedTransfers }} complétés</small>
                <small class="text-500 ml-2">{{ pendingTransfers }} en attente</small>
              </div>
            </div>
            <div class="bg-blue-100 p-3 border-round" style="background-color: var(--blue-100)">
              <i class="pi pi-truck text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Items Transferred Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Articles Transférés</span>
              <div class="text-900 font-medium text-xl">{{ totalItemsTransferred }}</div>
              <div class="mt-2">
                <small class="text-500">Moyenne: {{ averageItemsPerTransfer }} par transfert</small>
              </div>
            </div>
            <div class="bg-green-100 p-3 border-round" style="background-color: var(--green-100)">
              <i class="pi pi-box text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Pending Transfers Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Transferts en Attente</span>
              <div class="text-900 font-medium text-xl">{{ pendingTransfers }}</div>
              <div class="mt-2">
                <p-progressBar [value]="pendingPercentage" [showValue]="false" 
                  [style]="{height: '6px', width: '100%'}" 
                  class="progress-pending">
                </p-progressBar>
              </div>
            </div>
            <div class="bg-orange-100 p-3 border-round" style="background-color: var(--orange-100)">
              <i class="pi pi-clock text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Recent Activity Card -->
        <div class="card shadow-1 flex-1 min-w-64" style="height: 130px;">
          <div class="flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">Dernier Transfert</span>
              <div class="text-900 font-medium text-xl" *ngIf="lastTransfer">{{ lastTransfer.reference }}</div>
              <div class="text-900 font-medium text-xl" *ngIf="!lastTransfer">Aucun</div>
              <div class="mt-2">
                <small class="text-500" *ngIf="lastTransfer">{{ lastTransfer.orderDate | date:'shortDate' }}</small>
              </div>
            </div>
            <div class="bg-purple-100 p-3 border-round" style="background-color: var(--purple-100)">
              <i class="pi pi-history text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [data]="filteredTransfers"
        [columns]="tableColumns"
        [tabs]="statusTabs"
        [activeTab]="activeStatusTab"
        (tabChanged)="onStatusFilterChange($event)">
        
        <ng-template #actionTemplate let-row>
          <div class="flex gap-2">
            <button pButton icon="pi pi-eye" rounded outlined class="p-button-lg" severity="info" 
              (click)="viewTransfer(row)"></button>
            <button pButton icon="pi pi-print" rounded outlined class="p-button-lg" severity="help" 
              (click)="printTransfer(row)"></button>
            <button *ngIf="row.status === 'pending'" pButton icon="pi pi-check" rounded outlined class="p-button-lg" 
              severity="success" (click)="completeTransfer(row)"></button>
            <button *ngIf="row.status === 'pending'" pButton icon="pi pi-times" rounded outlined class="p-button-lg" 
              severity="danger" (click)="cancelTransfer(row)"></button>
          </div>
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: [`
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
    .progress-pending ::ng-deep .p-progressbar-value {
      background-color: #f59e0b;
    }
    .status-pending {
      color: #f59e0b;
      font-weight: 600;
    }
    .status-completed {
      color: #10b981;
      font-weight: 600;
    }
    .status-cancelled {
      color: #ef4444;
      font-weight: 600;
    }
  `]
})
export class BonDeTransfertComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  transferItems: TransferItem[] = [
    {
      id: 1,
      reference: 'DPA/OUT/2414077',
      originDocument: 'TRAN/WH/32626',
      sourceWarehouse: 'Transition/Notifié',
      destinationWarehouse: 'Magasin Principal',
      status: 'completed',
      orderDate: new Date('2023-12-23'),
      shipmentDate: new Date('2023-12-24'),
      creationDate: new Date('2023-12-22'),
      itemsCount: 2,
      items: [
        {
          id: 1,
          code: '50215',
          designation: 'MORTIER D IMPERMEABILISATION IZOLATEX PLUS - 20KG - A (POUDRE)',
          supplierReference: 'DPA/Slock',
          quantity: 2,
          unit: 'Sac'
        },
        {
          id: 2,
          code: '50216',
          designation: 'MORTIER D IMPERMEABILISATION IZOLATEX PLUS - 10L - B (LIQUIDE)',
          supplierReference: 'DPA/Slock',
          quantity: 1,
          unit: 'Eldon'
        }
      ],
      companyDetails: {
        name: 'ENCENTE LA CITY IVANDRY',
        address: 'Magasin Toamasina - Boulevard Ausagneur - Toamasina',
        phone: '020 22 499 00',
        mobiles: ['0320502829', '0340202829', '0321143881', '0332315060', '0340245688'],
        email: 'compta@sirr.mg',
        cif: '0243008 /DGI-K du 08/08/2023',
        stat: '24101 11 2000 0 10023 du 17/01/2000',
        nif: '10 000 22 111 du 17/01/2000'
      }
    },
    {
      id: 2,
      reference: 'DPA/OUT/2414078',
      originDocument: 'TRAN/WH/32627',
      sourceWarehouse: 'Entrepôt Nord',
      destinationWarehouse: 'Entrepôt Sud',
      status: 'pending',
      orderDate: new Date('2023-12-20'),
      shipmentDate: new Date('2023-12-21'),
      creationDate: new Date('2023-12-19'),
      itemsCount: 3,
      items: [
        {
          id: 3,
          code: '50217',
          designation: 'PEINTURE ANTIROUILLE - 5L - BLANC',
          supplierReference: 'DPA/Peint',
          quantity: 5,
          unit: 'Pot'
        }
      ],
      companyDetails: {
        name: 'ENCENTE LA CITY IVANDRY',
        address: 'Magasin Toamasina - Boulevard Ausagneur - Toamasina',
        phone: '020 22 499 00',
        mobiles: ['0320502829', '0340202829', '0321143881', '0332315060', '0340245688'],
        email: 'compta@sirr.mg',
        cif: '0243008 /DGI-K du 08/08/2023',
        stat: '24101 11 2000 0 10023 du 17/01/2000',
        nif: '10 000 22 111 du 17/01/2000'
      }
    }
  ];
  filteredTransfers: TransferItem[] = [...this.transferItems];

  // Statistics calculations
  get totalTransfers(): number {
    return this.transferItems.length;
  }

  get completedTransfers(): number {
    return this.transferItems.filter(t => t.status === 'completed').length;
  }

  get pendingTransfers(): number {
    return this.transferItems.filter(t => t.status === 'pending').length;
  }

  get totalItemsTransferred(): number {
    return this.transferItems.reduce((sum, transfer) => sum + transfer.itemsCount, 0);
  }

  get averageItemsPerTransfer(): number {
    return this.totalItemsTransferred / this.totalTransfers;
  }

  get pendingPercentage(): number {
    return (this.pendingTransfers / this.totalTransfers) * 100;
  }

  get lastTransfer(): TransferItem | null {
    if (this.transferItems.length === 0) return null;
    return [...this.transferItems].sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())[0];
  }

  headerButtons: HeaderButton[] = [
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
      style: {'background-color': '#007AFF', 'border-color': '#007AFF', 'color': '#ffffff'}
    },
    {
      key: 'add',
      label: 'Nouveau Transfert',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF', 'color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'reference', header: 'Référence' },
    { 
      field: 'status', 
      header: 'Statut',
      body: (item: TransferItem) => {
        const statusClass = `status-${item.status}`;
        const statusLabel = 
          item.status === 'pending' ? 'En Attente' : 
          item.status === 'completed' ? 'Complété' : 'Annulé';
        return `<span class="${statusClass}">${statusLabel}</span>`;
      }
    },
    { 
      field: 'orderDate', 
      header: 'Date Commande',
      body: (item: TransferItem) => item.orderDate.toLocaleDateString()
    },
    { field: 'sourceWarehouse', header: 'Entrepôt Source' },
    { field: 'destinationWarehouse', header: 'Entrepôt Destination' },
    { 
      field: 'itemsCount', 
      header: 'Articles',
      body: (item: TransferItem) => `${item.itemsCount} articles`
    },
    { 
      field: 'actions', 
      header: 'Actions',
      isTemplate: true
    }
  ];

  statusTabs: StatusTab[] = [
    { label: 'Tous', key: 'all' } as StatusTab,
    { label: 'En Attente', key: 'pending' } as StatusTab,
    { label: 'Complétés', key: 'completed' } as StatusTab,
    { label: 'Annulés', key: 'cancelled' } as StatusTab
  ];
  activeStatusTab: StatusTab = this.statusTabs[0];

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.goBack();
    } else if (key === 'add') {
      this.createNewTransfer();
    } else if (key === 'export') {
      this.exportTransfers();
    }
  }

  onStatusFilterChange(tab: MenuItem) {
    this.activeStatusTab = tab as StatusTab;
    this.filterTransfers();
  }

  filterTransfers() {
    switch(this.activeStatusTab.key) {
      case 'pending':
        this.filteredTransfers = this.transferItems.filter(t => t.status === 'pending');
        break;
      case 'completed':
        this.filteredTransfers = this.transferItems.filter(t => t.status === 'completed');
        break;
      default:
        this.filteredTransfers = [...this.transferItems];
    }
  }

  viewTransfer(transfer: TransferItem) {
    this.router.navigate(['/Gescom/frontOffice/Stock/BonDeTransfert/view', transfer.id]);
  }

  printTransfer(transfer: TransferItem) {
    console.log('Printing transfer:', transfer);
    // Implement print functionality
  }

  completeTransfer(transfer: TransferItem) {
    transfer.status = 'completed';
    this.filterTransfers();
  }

  cancelTransfer(transfer: TransferItem) {
    transfer.status = 'cancelled';
    this.filterTransfers();
  }

  createNewTransfer() {
    this.router.navigate(['/Gescom/frontOffice/Stock/BonDeTransfert/add']);
  }

  exportTransfers() {
    console.log('Exporting transfers');
    // Implement export functionality
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/Stock/ArticleListe']);
  }
}