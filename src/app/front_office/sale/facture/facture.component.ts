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
import { Router } from '@angular/router';
import { DeliveryDialogComponent } from '../devis/view-devis/delivery-dialog.component';
import { DeliveryNoteComponent } from '../devis/view-devis/delivery-note.component';

interface DeliveryInfo {
  driverName: string;
  truckNumber: string;
  exitDate: Date | null;
  arrivalDate: Date | null;
  destination: string;
}


interface StatusTab extends MenuItem {
  key: 'all' | 'draft' | 'paid' | 'unpaid' | 'cancelled';
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: Date;
  clientCode: string;
  clientName: string;
  totalHT: number;
  totalTVA: number;
  timbre: number;
  totalTTC: number;
  status: 'draft' | 'paid' | 'unpaid' | 'cancelled' | 'exonerated';
  paymentDate?: Date;
  dueDate: Date;
}

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TooltipModule,
    TabMenuModule, CardModule, ProgressBarModule,
    HeaderBarComponent, DataTableComponent, TagModule,DeliveryNoteComponent,
    DialogModule, DropdownModule, AvatarModule, DeliveryDialogComponent,
    InputSwitchModule, BadgeModule, DividerModule,
    FormsModule, CurrencyPipe, InputGroupModule, InputGroupAddonModule
  ],
  template: `
    <div class="invoice-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <app-header-bar
          [title]="'Gestion des Bon de Sortie'"
          [buttons]="headerButtons"
          [subtitle]="'Gérez vos factures efficacement'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <!-- Total TTC -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Total TTC</span>
              <span class="stat-value">{{ totalTTC | currency:'TND' }}</span>
              <div class="stat-meta">
                <span class="paid-amount">{{ totalPaid | currency:'TND' }} payé</span>
                <span class="unpaid-amount">{{ totalUnpaid | currency:'TND' }} impayé</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-money-bill"></i>
            </div>
          </div>
        </div>

        <!-- Paid Invoices -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Factures Payées</span>
              <span class="stat-value">{{ paidInvoicesCount }}</span>
              <div class="stat-progress">
                <p-progressBar 
                  [value]="paidPercentage" 
                  [showValue]="false" 
                  class="progress-bar-success">
                </p-progressBar>
                <span class="progress-text">{{ paidPercentage }}% du total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-check-circle"></i>
            </div>
          </div>
        </div>

        <!-- Unpaid Invoices -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Factures Impayées</span>
              <span class="stat-value">{{ unpaidInvoicesCount }}</span>
              <div class="stat-progress">
                <p-progressBar 
                  [value]="unpaidPercentage" 
                  [showValue]="false" 
                  class="progress-bar-danger">
                </p-progressBar>
                <span class="progress-text">{{ unpaidInvoicesTotal | currency:'TND' }} en retard</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-exclamation-circle"></i>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Nouvelles (30j)</span>
              <span class="stat-value">{{ recentInvoicesCount }}</span>
              <div class="stat-meta">
                <span>{{ recentInvoicesPercentage }}% du total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-file"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="table-section">
        <app-data-table
          [data]="filteredInvoices"
          [columns]="tableColumns"
          [tabs]="statusTabs"
          [activeTab]="activeStatusTab"
          (tabChanged)="onStatusFilterChange($event)"
            (search)="onSearch($event)">

          
          <ng-template #actionTemplate let-row>
            <div class="action-buttons">
              <button pButton severity="info" icon="pi pi-eye" 
                class="action-button view-button"
                (click)="viewInvoice(row)"></button>
                <button pButton severity="contrast" icon="pi pi-truck" 
                class="action-button delete-button"
              (click)="openDeliveryDialog(row)"></button>
              <button pButton severity="danger" icon="pi pi-trash" 
                class="action-button delete-button"
                (click)="deleteInvoice(row)"></button>
            </div>
          </ng-template>
        </app-data-table>
      </div>

    <app-delivery-dialog 
      [(visible)]="showDeliveryDialog" 
      [invoice]="selectedInvoice"
      (onHide)="closeDeliveryDialog()"
      (generate)="generateDeliveryNote($event)">
    </app-delivery-dialog>

      <app-delivery-note 
        [visible]="showDeliveryNote" 
        [data]="deliveryNoteData">
      </app-delivery-note>



    </div>




  `,
  styles: [`
    .invoice-management-container {
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

    .paid-amount {
      color: #10b981;
    }

    .unpaid-amount {
      color: #ef4444;
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
      border-radius: 3px;
    }

    :host ::ng-deep .progress-bar-success .p-progressbar-value {
      background-color: #10b981;
    }

    :host ::ng-deep .progress-bar-danger .p-progressbar-value {
      background-color: #ef4444;
    }

    /* Status Tags */
    .invoice-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-draft {
      background-color: #e2e8f0;
      color: #475569;
    }

    .status-paid {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-unpaid {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .status-cancelled {
      background-color: #f1f5f9;
      color: #64748b;
      text-decoration: line-through;
    }

    .status-exonerated {
      background-color: #e0f2fe;
      color: #075985;
    }
  `]
})
export class InvoiceManagementComponent {
  invoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: 'FAC-2023-001',
      invoiceDate: new Date('2023-10-01'),
      clientCode: 'CLI-001',
      clientName: 'SARL Technologie Plus',
      totalHT: 12000,
      totalTVA: 2400,
      timbre: 1,
      totalTTC: 14401,
      status: 'paid',
      paymentDate: new Date('2023-10-05'),
      dueDate: new Date('2023-11-01')
    },
    {
      id: 2,
      invoiceNumber: 'FAC-2023-002',
      invoiceDate: new Date('2023-10-05'),
      clientCode: 'CLI-002',
      clientName: 'Mohamed Ben Salah',
      totalHT: 5000,
      totalTVA: 1000,
      timbre: 1,
      totalTTC: 6001,
      status: 'unpaid',
      dueDate: new Date('2023-11-05')
    },
    {
      id: 3,
      invoiceNumber: 'FAC-2023-003',
      invoiceDate: new Date('2023-10-10'),
      clientCode: 'CLI-003',
      clientName: 'Ministère de la Santé',
      totalHT: 25000,
      totalTVA: 5000,
      timbre: 1,
      totalTTC: 30001,
      status: 'exonerated',
      dueDate: new Date('2023-11-10')
    },
    {
      id: 4,
      invoiceNumber: 'FAC-2023-004',
      invoiceDate: new Date('2023-10-15'),
      clientCode: 'CLI-001',
      clientName: 'SARL Technologie Plus',
      totalHT: 8000,
      totalTVA: 1600,
      timbre: 1,
      totalTTC: 9601,
      status: 'paid',
      paymentDate: new Date('2023-10-18'),
      dueDate: new Date('2023-11-15')
    },
    {
      id: 5,
      invoiceNumber: 'FAC-2023-005',
      invoiceDate: new Date('2023-10-20'),
      clientCode: 'CLI-004',
      clientName: 'Boutique El Medina',
      totalHT: 3000,
      totalTVA: 600,
      timbre: 1,
      totalTTC: 3601,
      status: 'draft',
      dueDate: new Date('2023-11-20')
    },
    {
      id: 6,
      invoiceNumber: 'FAC-2023-006',
      invoiceDate: new Date('2023-09-25'),
      clientCode: 'CLI-002',
      clientName: 'Mohamed Ben Salah',
      totalHT: 7000,
      totalTVA: 1400,
      timbre: 1,
      totalTTC: 8401,
      status: 'unpaid',
      dueDate: new Date('2023-10-25')
    },
    {
      id: 7,
      invoiceNumber: 'FAC-2023-007',
      invoiceDate: new Date('2023-09-20'),
      clientCode: 'CLI-005',
      clientName: 'Restaurant Le Gourmet',
      totalHT: 4500,
      totalTVA: 900,
      timbre: 1,
      totalTTC: 5401,
      status: 'cancelled',
      dueDate: new Date('2023-10-20')
    },
    {
      id: 8,
      invoiceNumber: 'FAC-2023-008',
      invoiceDate: new Date('2023-09-15'),
      clientCode: 'CLI-003',
      clientName: 'Ministère de la Santé',
      totalHT: 18000,
      totalTVA: 3600,
      timbre: 1,
      totalTTC: 21601,
      status: 'paid',
      paymentDate: new Date('2023-09-25'),
      dueDate: new Date('2023-10-15')
    },
    {
      id: 9,
      invoiceNumber: 'FAC-2023-009',
      invoiceDate: new Date('2023-09-10'),
      clientCode: 'CLI-006',
      clientName: 'Hôtel Les Palmiers',
      totalHT: 22000,
      totalTVA: 4400,
      timbre: 1,
      totalTTC: 26401,
      status: 'paid',
      paymentDate: new Date('2023-09-20'),
      dueDate: new Date('2023-10-10')
    },
    {
      id: 10,
      invoiceNumber: 'FAC-2023-010',
      invoiceDate: new Date('2023-09-05'),
      clientCode: 'CLI-007',
      clientName: 'Clinique El Manar',
      totalHT: 15000,
      totalTVA: 3000,
      timbre: 1,
      totalTTC: 18001,
      status: 'unpaid',
      dueDate: new Date('2023-10-05')
    }
  ];

  filteredInvoices = [...this.invoices];
  statusTabs: StatusTab[] = [
    { label: 'Tous (10)', key: 'all' },
    { label: 'Brouillon', key: 'draft' },
    { label: 'Payé', key: 'paid' },
    { label: 'Non Payé', key: 'unpaid' },
    { label: 'Annulé', key: 'cancelled' }
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
      label: 'Ajouter',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'invoiceNumber', header: 'N° Facture' },
    { 
      field: 'invoiceDate', 
      header: 'Date Facture',
      body: (invoice: Invoice) => {
        const datePipe = new DatePipe('fr-FR');
        return datePipe.transform(invoice.invoiceDate, 'dd/MM/yyyy') || '';
      }
    },
    { field: 'clientCode', header: 'Code Client' },
    { field: 'clientName', header: 'Nom Client' },
    { 
      field: 'totalHT', 
      header: 'Total HT',
      body: (invoice: Invoice) => invoice.totalHT.toFixed(3) + ' TND'
    },
    { 
      field: 'totalTVA', 
      header: 'Total TVA',
      body: (invoice: Invoice) => invoice.totalTVA.toFixed(3) + ' TND'
    },
    { 
      field: 'timbre', 
      header: 'Timbre',
      body: (invoice: Invoice) => invoice.timbre.toFixed(3) + ' TND'
    },
    { 
      field: 'totalTTC', 
      header: 'Total TTC',
      body: (invoice: Invoice) => invoice.totalTTC.toFixed(3) + ' TND'
    },
    { 
      field: 'status', 
      header: 'Statut',
      body: (invoice: Invoice) => {
        const statusMap: Record<string, {label: string, class: string}> = {
          'draft': { label: 'Brouillon', class: 'status-draft' },
          'paid': { label: 'Payé', class: 'status-paid' },
          'unpaid': { label: 'Non Payé', class: 'status-unpaid' },
          'cancelled': { label: 'Annulé', class: 'status-cancelled' },
          'exonerated': { label: 'Exonéré', class: 'status-exonerated' }
        };
        const status = statusMap[invoice.status] || { label: invoice.status, class: '' };
        return `<span class="invoice-status ${status.class}">${status.label}</span>`;
      }
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  // Statistics
  get totalTTC(): number {
    return this.invoices.reduce((sum, invoice) => sum + invoice.totalTTC, 0);
  }

  get totalPaid(): number {
    return this.invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.totalTTC, 0);
  }

  get totalUnpaid(): number {
    return this.invoices
      .filter(invoice => invoice.status === 'unpaid')
      .reduce((sum, invoice) => sum + invoice.totalTTC, 0);
  }

  get paidInvoicesCount(): number {
    return this.invoices.filter(invoice => invoice.status === 'paid').length;
  }

  get unpaidInvoicesCount(): number {
    return this.invoices.filter(invoice => invoice.status === 'unpaid').length;
  }

  get unpaidInvoicesTotal(): number {
    return this.invoices
      .filter(invoice => invoice.status === 'unpaid' && new Date(invoice.dueDate) < new Date())
      .reduce((sum, invoice) => sum + invoice.totalTTC, 0);
  }

  get paidPercentage(): number {
    return Math.round((this.paidInvoicesCount / this.invoices.length) * 100);
  }

  get unpaidPercentage(): number {
    return Math.round((this.unpaidInvoicesCount / this.invoices.length) * 100);
  }

  get recentInvoicesCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.invoices.filter(invoice => invoice.invoiceDate > oneMonthAgo).length;
  }

  get recentInvoicesPercentage(): number {
    return Math.round((this.recentInvoicesCount / this.invoices.length) * 100);
  }

   searchTerm = '';

  // Add this method to handle search
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterInvoices();
  }

  // Update the filterInvoices method to include search filtering
  filterInvoices(): void {
    let filtered = [...this.invoices];

    // Apply status filter
    if (this.activeStatusTab.key !== 'all') {
      filtered = filtered.filter(i => i.status === this.activeStatusTab.key);
    }

    // Apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(this.searchTerm) ||
        invoice.clientCode.toLowerCase().includes(this.searchTerm) ||
        invoice.clientName.toLowerCase().includes(this.searchTerm) ||
        this.formatDate(invoice.invoiceDate).includes(this.searchTerm) ||
        this.formatDate(invoice.dueDate).includes(this.searchTerm) ||
        this.formatCurrency(invoice.totalHT).includes(this.searchTerm) ||
        this.formatCurrency(invoice.totalTVA).includes(this.searchTerm) ||
        this.formatCurrency(invoice.totalTTC).includes(this.searchTerm) ||
        this.getStatusText(invoice.status).toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredInvoices = filtered;
  }

  // Helper method to get status text
  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'paid': 'Payé',
      'unpaid': 'Non Payé',
      'cancelled': 'Annulé',
      'exonerated': 'Exonéré'
    };
    return statusMap[status] || status;
  }

  // Helper method to format currency
  private formatCurrency(amount: number): string {
    return amount.toFixed(3) + ' TND';
  }

  // Helper method to format date
  private formatDate(date: Date): string {
    const datePipe = new DatePipe('fr-FR');
    return datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  onStatusFilterChange(tab: MenuItem) {
    this.activeStatusTab = tab as StatusTab;
    this.filterInvoices();
  }

  viewInvoice(invoice: Invoice) {
    console.log('View invoice:', invoice);
    this.router.navigate(['/Gescom/frontOffice/Sale/facture/view']);
  }

  editInvoice(invoice: Invoice) {
    console.log('Edit invoice:', invoice);
    // Implement edit logic
  }

  deleteInvoice(invoice: Invoice) {
    console.log('Delete invoice:', invoice);

    // Implement delete logic
  }

  delevryInvoice(invoice: Invoice) {
    console.log('Delevry invoice:', invoice);
    // Implement delete logic
  }




  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      console.log('Back button clicked');
    } else if (key === 'add') {
      console.log('Add new invoice');
      this.router.navigate(['/Gescom/frontOffice/Sale/facture/add']);

    } else if (key === 'export') {
      console.log('Export invoices');
    }
  }


    constructor(   private router: Router
    ) {}
  


// Delivery Dialog
  showDeliveryDialog = false;
  selectedInvoice: Invoice | null = null;
  deliveryInfo: DeliveryInfo = {
    driverName: '',
    truckNumber: '',
    exitDate: null,
    arrivalDate: null,
    destination: ''
  };

  // Delivery Note Data
  deliveryNoteData: any = null;

  // Show Delivery Note
  showDeliveryNote: boolean = false;






  openDeliveryDialog(invoice: Invoice) {
    this.selectedInvoice = invoice;
    this.showDeliveryDialog = true;
  }


  closeDeliveryDialog() {
    this.showDeliveryDialog = false;
    this.selectedInvoice = null;
  }

  isDeliveryFormValid(): boolean {
    return !!this.deliveryInfo.driverName &&
           !!this.deliveryInfo.truckNumber &&
           !!this.deliveryInfo.exitDate &&
           !!this.deliveryInfo.arrivalDate &&
           !!this.deliveryInfo.destination;
  }

  generateDeliveryNote(data: any) {
    this.deliveryNoteData = data;
    this.showDeliveryNote = true;
  }







}