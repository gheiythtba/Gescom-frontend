import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { DeliveryDialogComponent } from '../devis/view-devis/delivery-dialog.component';
import { DeliveryNoteComponent } from '../devis/view-devis/delivery-note.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { DeliveryOptionsDialogComponent } from './add-delivery-option.component';

// Add to your component imports
import { ConfirmDialogModule } from 'primeng/confirmdialog';




interface DeliveryStatusTab extends MenuItem {
  key: 'all' | 'pending' | 'in_transit' | 'delivered' | 'cancelled';
}

interface DeliveryItem {
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
}

interface Delivery {
  id: number;
  deliveryNumber: string;
  invoiceNumber: string;
  clientName: string;
  deliveryDate: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  driverName: string;
  truckNumber: string;
  exitDate: Date;
  estimatedArrival: Date;
  destination: string;
  items: DeliveryItem[];
}

@Component({
  selector: 'app-bon-de-livraison',
  standalone: true,
  imports: [
    CommonModule,
    TableModule, ButtonModule, TooltipModule, TabMenuModule,
    CardModule, TagModule, DialogModule, CalendarModule, InputTextModule,
    HeaderBarComponent, DataTableComponent, 
    DeliveryDialogComponent, DeliveryNoteComponent,ConfirmDialogModule,
  ],
  template: `
  <div class="delivery-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <app-header-bar
        [title]="'Gestion des livraisons'"
        [buttons]="headerButtons"
        [subtitle]="'Gérez vos bons de livraison'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">Total Livraisons</span>
            <span class="stat-value">{{ deliveries.length }}</span>
            <div class="stat-meta">
              <span>Ce mois: {{ recentDeliveriesCount }}</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-truck"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">En Transit</span>
            <span class="stat-value">{{ inTransitCount }}</span>
            <div class="stat-meta">
              <span>{{ inTransitPercentage }}% du total</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-map-marker"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">Livrées</span>
            <span class="stat-value">{{ deliveredCount }}</span>
            <div class="stat-meta">
              <span>{{ deliveredPercentage }}% du total</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-check-circle"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">En Retard</span>
            <span class="stat-value">{{ lateDeliveriesCount }}</span>
            <div class="stat-meta">
              <span>{{ latePercentage }}% du total</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="table-section">
      <app-data-table
        [data]="filteredDeliveries"
        [columns]="tableColumns"
        [tabs]="statusTabs"
        [activeTab]="activeStatusTab"
        (tabChanged)="onStatusFilterChange($event)"
          (search)="onSearch($event)">

        
        <ng-template #actionTemplate let-row>
          <div class="action-buttons">
            <button pButton 
              icon="pi pi-eye" 
              class="action-button view-button p-button-info"
              (click)="viewDelivery(row)"></button>
          
            <button pButton 
              icon="pi pi-file-export" 
              class="action-button print-button p-button-help"
              (click)="printDeliveryNote(row)"></button>
            
            <button pButton 
              icon="pi pi-trash" 
              class="action-button delete-button p-button-danger"
              (click)="cancelDelivery(row)"
              [disabled]="row.status === 'cancelled' || row.status === 'delivered'"></button>
          </div>
        </ng-template>
      </app-data-table>
    </div>

    <!-- Delivery Dialog Component -->
    <app-delivery-dialog 
      [(visible)]="showDeliveryDialog" 
      [invoice]="selectedInvoice"
      (generate)="generateDeliveryNote($event)">
    </app-delivery-dialog>

    <app-delivery-note 
      [visible]="showDeliveryNote" 
      [data]="deliveryNoteData"
      (onClose)="showDeliveryNote = false">
    </app-delivery-note>
  </div>
  `,
  styles: [`
    .delivery-management-container {
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

    /* Status Tags */
    .delivery-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-pending {
      background-color: #e2e8f0;
      color: #475569;
    }

    .status-in_transit {
      background-color: #e0f2fe;
      color: #075985;
    }

    .status-delivered {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .status-late {
      background-color: #fef3c7;
      color: #92400e;
    }
  `],
  providers: [DatePipe,DialogService]
})
export class BonDeLivraisonComponent {

  private dialogRef?: DynamicDialogRef;

  deliveries: Delivery[] = [
    {
      id: 1,
      deliveryNumber: 'BL-2023-001',
      invoiceNumber: 'FAC-2023-001',
      clientName: 'SARL Technologie Plus',
      deliveryDate: new Date('2023-10-02'),
      status: 'delivered',
      driverName: 'Mohamed Ali',
      truckNumber: 'TU-1234-AB',
      exitDate: new Date('2023-10-02 08:00'),
      estimatedArrival: new Date('2023-10-02 16:00'),
      destination: '45 Avenue Habib Bourguiba, Tunis',
      items: [
        { productCode: 'PRD-001', productName: 'Ordinateur Portable', quantity: 5, unit: 'pcs' },
        { productCode: 'PRD-002', productName: 'Imprimante Laser', quantity: 2, unit: 'pcs' }
      ]
    },
    {
      id: 2,
      deliveryNumber: 'BL-2023-002',
      invoiceNumber: 'FAC-2023-002',
      clientName: 'Mohamed Ben Salah',
      deliveryDate: new Date('2023-10-06'),
      status: 'in_transit',
      driverName: 'Ali Ben Ahmed',
      truckNumber: 'TU-5678-CD',
      exitDate: new Date('2023-10-06 09:00'),
      estimatedArrival: new Date('2023-10-06 17:00'),
      destination: '12 Rue de la Liberté, Sousse',
      items: [
        { productCode: 'PRD-003', productName: 'Ecran 24"', quantity: 3, unit: 'pcs' }
      ]
    },
    {
      id: 3,
      deliveryNumber: 'BL-2023-003',
      invoiceNumber: 'FAC-2023-003',
      clientName: 'Ministère de la Santé',
      deliveryDate: new Date('2023-10-11'),
      status: 'pending',
      driverName: 'Salah Ben Youssef',
      truckNumber: 'TU-9012-EF',
      exitDate: new Date('2023-10-11 08:30'),
      estimatedArrival: new Date('2023-10-11 15:00'),
      destination: 'Place du Gouvernement, Tunis',
      items: [
        { productCode: 'PRD-004', productName: 'Serveur Rack', quantity: 1, unit: 'pcs' },
        { productCode: 'PRD-005', productName: 'Switch 24 ports', quantity: 2, unit: 'pcs' }
      ]
    },
    {
      id: 4,
      deliveryNumber: 'BL-2023-004',
      invoiceNumber: 'FAC-2023-004',
      clientName: 'SARL Technologie Plus',
      deliveryDate: new Date('2023-10-16'),
      status: 'cancelled',
      driverName: 'Youssef Ben Mohamed',
      truckNumber: 'TU-3456-GH',
      exitDate: new Date('2023-10-16 10:00'),
      estimatedArrival: new Date('2023-10-16 18:00'),
      destination: '45 Avenue Habib Bourguiba, Tunis',
      items: [
        { productCode: 'PRD-006', productName: 'Clavier Sans Fil', quantity: 10, unit: 'pcs' }
      ]
    },
    {
      id: 5,
      deliveryNumber: 'BL-2023-005',
      invoiceNumber: 'FAC-2023-005',
      clientName: 'Boutique El Medina',
      deliveryDate: new Date('2023-10-21'),
      status: 'in_transit',
      driverName: 'Ahmed Ben Salah',
      truckNumber: 'TU-7890-IJ',
      exitDate: new Date('2023-10-21 07:00'),
      estimatedArrival: new Date('2023-10-21 14:00'),
      destination: '18 Rue du Commerce, Sfax',
      items: [
        { productCode: 'PRD-007', productName: 'Souris Optique', quantity: 15, unit: 'pcs' },
        { productCode: 'PRD-008', productName: 'Disque Dur Externe', quantity: 5, unit: 'pcs' }
      ]
    }
  ];

  filteredDeliveries = [...this.deliveries];
  statusTabs: DeliveryStatusTab[] = [
    { label: 'Tous', key: 'all' },
    { label: 'En Attente', key: 'pending' },
    { label: 'En Transit', key: 'in_transit' },
    { label: 'Livrée', key: 'delivered' },
    { label: 'Annulée', key: 'cancelled' }
  ];
  activeStatusTab = this.statusTabs[0];

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
      label: 'Nouveau BL',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'deliveryNumber', header: 'N° BL' },
    { field: 'invoiceNumber', header: 'N° Facture' },
    { field: 'clientName', header: 'Client' },
    { 
      field: 'deliveryDate', 
      header: 'Date Livraison',
      body: (delivery: Delivery) => this.formatDate(delivery.deliveryDate)
    },
    { field: 'driverName', header: 'Chauffeur' },
    { field: 'truckNumber', header: 'Camion' },
    { 
      field: 'status', 
      header: 'Statut',
      body: (delivery: Delivery) => this.getStatusBadge(delivery)
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  showDeliveryDialog = false;
  selectedInvoice: any = null;
  deliveryNoteData: any = null;
  showDeliveryNote = false;

  constructor(private router: Router, private datePipe: DatePipe,    private dialogService: DialogService
  ) {}

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  private getStatusBadge(delivery: Delivery): string {
    const statusMap = {
      'pending': { label: 'En Attente', class: 'status-pending' },
      'in_transit': { label: 'En Transit', class: 'status-in_transit' },
      'delivered': { label: 'Livrée', class: 'status-delivered' },
      'cancelled': { label: 'Annulée', class: 'status-cancelled' }
    };

    const status = statusMap[delivery.status] || { label: delivery.status, class: '' };
    
    if (delivery.status === 'in_transit' && new Date() > delivery.estimatedArrival) {
      return `<span class="delivery-status status-late">En Retard</span>`;
    }
    
    return `<span class="delivery-status ${status.class}">${status.label}</span>`;
  }

  
  searchTerm = '';

  // Add this method to handle search
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterDeliveries();
  }

  // Update the filterDeliveries method to include search filtering
  filterDeliveries(): void {
    let filtered = [...this.deliveries];

    // Apply status filter
    if (this.activeStatusTab.key !== 'all') {
      filtered = filtered.filter(d => d.status === this.activeStatusTab.key);
    }

    // Apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(delivery => 
        delivery.deliveryNumber.toLowerCase().includes(this.searchTerm) ||
        delivery.invoiceNumber.toLowerCase().includes(this.searchTerm) ||
        delivery.clientName.toLowerCase().includes(this.searchTerm) ||
        delivery.driverName.toLowerCase().includes(this.searchTerm) ||
        delivery.truckNumber.toLowerCase().includes(this.searchTerm) ||
        delivery.destination.toLowerCase().includes(this.searchTerm) ||
        this.formatDate(delivery.deliveryDate).includes(this.searchTerm) ||
        this.formatDate(delivery.exitDate).includes(this.searchTerm) ||
        this.formatDate(delivery.estimatedArrival).includes(this.searchTerm) ||
        this.getStatusBadge(delivery).toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredDeliveries = filtered;
  }

  onStatusFilterChange(tab: MenuItem): void {
    this.activeStatusTab = tab as DeliveryStatusTab;
    this.filterDeliveries();
  }

  viewDelivery(delivery: Delivery): void {
    this.deliveryNoteData = delivery;
    this.showDeliveryNote = true;
  }

  printDeliveryNote(delivery: Delivery): void {
    this.deliveryNoteData = delivery;
    this.showDeliveryNote = true;
  }

  cancelDelivery(delivery: Delivery): void {
    if (confirm(`Voulez-vous vraiment annuler la livraison ${delivery.deliveryNumber}?`)) {
      delivery.status = 'cancelled';
      this.filterDeliveries();
    }
  }

  generateDeliveryNote(data: any): void {
    const newDelivery: Delivery = {
      id: this.deliveries.length + 1,
      deliveryNumber: `BL-${new Date().getFullYear()}-${(this.deliveries.length + 1).toString().padStart(3, '0')}`,
      invoiceNumber: data.invoiceNumber,
      clientName: data.clientName,
      deliveryDate: new Date(),
      status: 'pending',
      driverName: data.driverName,
      truckNumber: data.truckNumber,
      exitDate: data.exitDate,
      estimatedArrival: data.arrivalDate,
      destination: data.destination,
      items: []
    };

    this.deliveries.unshift(newDelivery);
    this.filterDeliveries();
    this.showDeliveryDialog = false;
    this.showDeliveryNote = true;
    this.deliveryNoteData = newDelivery;
  }

  onHeaderButtonClick(key: string): void {
    switch(key) {
      case 'back':
        this.router.navigate(['/dashboard']);
        break;
      case 'add':
        this.showDeliveryOptions();
        break;
      case 'export':
        console.log('Export deliveries');
        break;
    }
  }


  private showDeliveryOptions(): void {
    this.dialogRef = this.dialogService.open(DeliveryOptionsDialogComponent, {
      header: 'Nouvelle Livraison',
      width: '450px',
      contentStyle: { 'border-radius': '12px' },
      dismissableMask: true
    });

    this.dialogRef.onClose.subscribe((route?: string) => {
      if (route) {
        this.router.navigate([route]);
      }
    });
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  get inTransitCount(): number {
    return this.deliveries.filter(d => d.status === 'in_transit').length;
  }

  get deliveredCount(): number {
    return this.deliveries.filter(d => d.status === 'delivered').length;
  }

  get pendingCount(): number {
    return this.deliveries.filter(d => d.status === 'pending').length;
  }

  get cancelledCount(): number {
    return this.deliveries.filter(d => d.status === 'cancelled').length;
  }

  get lateDeliveriesCount(): number {
    return this.deliveries.filter(d => 
      d.status === 'in_transit' && new Date() > d.estimatedArrival
    ).length;
  }

  get recentDeliveriesCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.deliveries.filter(d => d.deliveryDate > oneMonthAgo).length;
  }

  get inTransitPercentage(): number {
    return Math.round((this.inTransitCount / this.deliveries.length) * 100);
  }

  get deliveredPercentage(): number {
    return Math.round((this.deliveredCount / this.deliveries.length) * 100);
  }

  get latePercentage(): number {
    return Math.round((this.lateDeliveriesCount / this.deliveries.length) * 100);
  }
}