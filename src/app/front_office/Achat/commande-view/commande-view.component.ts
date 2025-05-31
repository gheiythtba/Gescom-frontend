// supplier.component.ts
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
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InvoicePrintComponent } from '../print-invoice.component';

interface InvoiceStatusTab extends MenuItem {
  key: 'all' | 'draft' | 'sent' | 'paid' | 'cancelled';
}

interface InvoiceItem {
  reference: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SupplierInvoice {
  id: number;
  invoiceNumber: string;
  reference: string;
  supplierCode: string;
  supplierName: string;
  invoiceDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  dueDate: Date;
  paymentDate?: Date;
  items: InvoiceItem[];
}

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    CommonModule,
    TableModule, ButtonModule, TooltipModule, TabMenuModule,
    CardModule, TagModule, DialogModule, CalendarModule, InputTextModule,
    HeaderBarComponent, DataTableComponent, ConfirmDialogModule, InvoicePrintComponent
  ],
  template: `
  <div class="supplier-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <app-header-bar
        [title]="'Gestion des Commandes Fournisseurs'"
        [buttons]="headerButtons"
        [subtitle]="'Gérez vos factures fournisseurs'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">Total Factures</span>
            <span class="stat-value">{{ invoices.length }}</span>
            <div class="stat-meta">
              <span>Ce mois: {{ recentInvoicesCount }}</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-file-invoice"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">Envoyées</span>
            <span class="stat-value">{{ sentCount }}</span>
            <div class="stat-meta">
              <span>{{ sentPercentage }}% du total</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-send"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-text">
            <span class="stat-label">Payées</span>
            <span class="stat-value">{{ paidCount }}</span>
            <div class="stat-meta">
              <span>{{ paidPercentage }}% du total</span>
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
            <span class="stat-label">Montant Total</span>
            <span class="stat-value">{{ totalAmount | currency:'TND':'symbol':'1.3-3' }}</span>
            <div class="stat-meta">
              <span>Moyenne: {{ averageAmount | currency:'TND':'symbol':'1.3-3' }}</span>
            </div>
          </div>
          <div class="stat-icon">
            <i class="pi pi-money-bill"></i>
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
            <button pButton 
              icon="pi pi-eye" 
              class="action-button view-button p-button-warning"
              (click)="viewInvoice(row)"></button>

            <button pButton 
              icon="pi pi-file-export" 
              class="action-button print-button p-button-help"
              (click)="printInvoice(row)"></button>

            <button pButton 
              icon="pi pi-trash" 
              class="action-button delete-button p-button-danger"
              (click)="cancelInvoice(row)"
              [disabled]="row.status === 'cancelled' || row.status === 'paid'"></button>
          </div>
        </ng-template>
      </app-data-table>
    </div>

    <app-invoice-print 
      [visible]="showPrintDialogFlag" 
      [data]="printData"
      (visibleChange)="onPrintDialogClose($event)">
    </app-invoice-print>
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

    .status-sent {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-paid {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `],
  providers: [DatePipe, DialogService]
})
export class SupplierComponent {
  private dialogRef?: DynamicDialogRef;

  invoices: SupplierInvoice[] = [
    {
      id: 1,
      invoiceNumber: 'FAC-2023-001',
      reference: 'CMD-2023-001',
      supplierCode: 'FOUR-001',
      supplierName: 'SARL Matériel Informatique',
      invoiceDate: new Date('2023-10-02'),
      amount: 10000,
      taxAmount: 1900,
      totalAmount: 11900,
      status: 'paid',
      dueDate: new Date('2023-11-02'),
      paymentDate: new Date('2023-10-28'),
      items: [
        { reference: 'PRD-001', productName: 'Ordinateur Portable', quantity: 5, unitPrice: 2000, total: 10000 }
      ]
    },
    {
      id: 2,
      invoiceNumber: 'FAC-2023-002',
      reference: 'CMD-2023-002',
      supplierCode: 'FOUR-002',
      supplierName: 'Technologie Plus',
      invoiceDate: new Date('2023-10-05'),
      amount: 7500,
      taxAmount: 1425,
      totalAmount: 8925,
      status: 'sent',
      dueDate: new Date('2023-11-05'),
      items: [
        { reference: 'PRD-002', productName: 'Imprimante Laser', quantity: 3, unitPrice: 2500, total: 7500 }
      ]
    },
    {
      id: 3,
      invoiceNumber: 'FAC-2023-003',
      reference: 'CMD-2023-003',
      supplierCode: 'FOUR-003',
      supplierName: 'Global Components',
      invoiceDate: new Date('2023-10-10'),
      amount: 15000,
      taxAmount: 2850,
      totalAmount: 17850,
      status: 'draft',
      dueDate: new Date('2023-11-10'),
      items: [
        { reference: 'PRD-003', productName: 'Serveur Rack', quantity: 1, unitPrice: 15000, total: 15000 }
      ]
    },
    {
      id: 4,
      invoiceNumber: 'FAC-2023-004',
      reference: 'CMD-2023-004',
      supplierCode: 'FOUR-001',
      supplierName: 'SARL Matériel Informatique',
      invoiceDate: new Date('2023-10-15'),
      amount: 5000,
      taxAmount: 950,
      totalAmount: 5950,
      status: 'cancelled',
      dueDate: new Date('2023-11-15'),
      items: [
        { reference: 'PRD-004', productName: 'Clavier Sans Fil', quantity: 10, unitPrice: 500, total: 5000 }
      ]
    }
  ];

  filteredInvoices = [...this.invoices];
  statusTabs: InvoiceStatusTab[] = [
    { label: 'Tous', key: 'all' },
    { label: 'Brouillon', key: 'draft' },
    { label: 'Envoyées', key: 'sent' },
    { label: 'Payées', key: 'paid' },
    { label: 'Annulées', key: 'cancelled' }
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
      label: 'Nouvelle Facture',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'invoiceNumber', header: 'N° Facture' },
    { field: 'reference', header: 'Référence' },
    { field: 'supplierCode', header: 'Code Fournisseur' },
    { field: 'supplierName', header: 'Nom Fournisseur' },
    { 
      field: 'invoiceDate', 
      header: 'Date Facture',
      body: (invoice: SupplierInvoice) => this.formatDate(invoice.invoiceDate)
    },
    { 
      field: 'totalAmount', 
      header: 'Montant TTC',
      body: (invoice: SupplierInvoice) => this.formatCurrency(invoice.totalAmount)
    },
    { 
      field: 'dueDate', 
      header: 'Date Échéance',
      body: (invoice: SupplierInvoice) => this.formatDate(invoice.dueDate)
    },
    { 
      field: 'status', 
      header: 'Statut',
      body: (invoice: SupplierInvoice) => this.getStatusBadge(invoice.status)
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  showPrintDialogFlag = false;
  printData: any = {};

  constructor(private router: Router, private datePipe: DatePipe, private dialogService: DialogService) {}

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  private formatCurrency(amount: number): string {
    return this.datePipe.transform(amount, '1.3-3', 'TND') || '';
  }

  private getStatusBadge(status: 'draft' | 'sent' | 'paid' | 'cancelled' | string): string {
    const statusMap: Record<'draft' | 'sent' | 'paid' | 'cancelled', { label: string; class: string }> = {
      'draft': { label: 'Brouillon', class: 'status-draft' },
      'sent': { label: 'Envoyée', class: 'status-sent' },
      'paid': { label: 'Payée', class: 'status-paid' },
      'cancelled': { label: 'Annulée', class: 'status-cancelled' }
    };

    const statusInfo = (status in statusMap)
      ? statusMap[status as 'draft' | 'sent' | 'paid' | 'cancelled']
      : { label: status, class: '' };
    return `<span class="invoice-status ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  searchTerm = '';

  // Add this method to handle search
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterInvoices();
  }

  filterInvoices(): void {
    let filtered = [...this.invoices];

    // Apply status filter
    if (this.activeStatusTab.key !== 'all') {
      filtered = filtered.filter(i => i.status === this.activeStatusTab.key);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(this.searchTerm) ||
        invoice.reference.toLowerCase().includes(this.searchTerm) ||
        invoice.supplierCode.toLowerCase().includes(this.searchTerm) ||
        invoice.supplierName.toLowerCase().includes(this.searchTerm) ||
        this.formatDate(invoice.invoiceDate).includes(this.searchTerm) ||
        this.formatDate(invoice.dueDate).includes(this.searchTerm) ||
        this.formatCurrency(invoice.totalAmount).includes(this.searchTerm) ||
        this.getStatusBadge(invoice.status).toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredInvoices = filtered;
  }

  onStatusFilterChange(tab: MenuItem): void {
    this.activeStatusTab = tab as InvoiceStatusTab;
    this.filterInvoices();
  }

  viewInvoice(invoice: SupplierInvoice): void {
    this.dialogRef = this.dialogService.open(InvoicePrintComponent, {
      header: `Facture ${invoice.invoiceNumber}`,
      width: '80%',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        invoice: invoice
      }
    });
  }

  printInvoice(invoice: SupplierInvoice): void {
    this.preparePrintData(invoice);
    this.showPrintDialogFlag = true;
  }

  private preparePrintData(invoice: SupplierInvoice): void {
    this.printData = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      companyName: invoice.supplierName,
      companyAddress: '',
      companyPostalCode: '',
      companyCity: '',
      companyPhone: '',
      companyEmail: '',
      companyTaxId: '',
      items: invoice.items,
      totalHT: invoice.amount,
      totalTVA: invoice.taxAmount,
      totalTTC: invoice.totalAmount,
      dueDate: invoice.dueDate,
      paymentMethod: '',
      paymentTerms: ''
    };
  }

  onPrintDialogClose(visible: boolean) {
    this.showPrintDialogFlag = visible;
  }

  cancelInvoice(invoice: SupplierInvoice): void {
    if (confirm(`Voulez-vous vraiment annuler la facture ${invoice.invoiceNumber}?`)) {
      invoice.status = 'cancelled';
      this.filterInvoices();
    }
  }

  onHeaderButtonClick(key: string): void {
    switch(key) {
      case 'back':
        this.router.navigate(['/Gescom/frontOffice/Dashboards']);
        break;
      case 'add':
        this.router.navigate(['/Gescom/frontOffice/Achat/FactureFournisseur/add']);
        break;
      case 'export':
        console.log('Export invoices');
        break;
    }
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  // Statistics calculations
  get sentCount(): number {
    return this.invoices.filter(i => i.status === 'sent').length;
  }

  get paidCount(): number {
    return this.invoices.filter(i => i.status === 'paid').length;
  }

  get cancelledCount(): number {
    return this.invoices.filter(i => i.status === 'cancelled').length;
  }

  get recentInvoicesCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.invoices.filter(i => i.invoiceDate > oneMonthAgo).length;
  }

  get totalAmount(): number {
    return this.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }

  get averageAmount(): number {
    return this.invoices.length > 0 ? this.totalAmount / this.invoices.length : 0;
  }

  get sentPercentage(): number {
    return Math.round((this.sentCount / this.invoices.length) * 100);
  }

  get paidPercentage(): number {
    return Math.round((this.paidCount / this.invoices.length) * 100);
  }
}