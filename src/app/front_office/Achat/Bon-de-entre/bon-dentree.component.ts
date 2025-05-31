/**
 * Goods Receipt Management Component
 * 
 * This component provides a comprehensive interface for managing goods receipts (Bons d'Entrée).
 * It includes features for viewing, filtering, and managing receipt documents with statistics,
 * search capabilities, and various actions like printing, viewing details, and supplier ordering.
 * 
 * Key Features:
 * - Dashboard with receipt statistics (counts, amounts, status distribution)
 * - Filterable and searchable table of all receipts
 * - Status-based filtering (Created, Validated, Cancelled)
 * - Detailed view of receipts
 * - Print functionality for receipts
 * - Supplier ordering integration
 * 
 * Dependencies:
 * - PrimeNG components for UI elements (Table, Buttons, Dialogs)
 * - Angular Router for navigation
 * - DatePipe for date and currency formatting
 * - Reusable components (HeaderBar, DataTable)
 * 
 * @component
 * @selector app-bon-entree
 * @standalone true
 */
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
import { DisplayFactureComponent } from '../display-facture.component';
import { InvoicePrintComponent } from '../print-invoice.component';
import { SupplierOrderDialogComponent } from '../supplier-order-dialog.component';

interface ReceiptStatusTab extends MenuItem {
  key: 'all' | 'created' | 'validated' | 'cancelled';
}

interface ReceiptItem {
  reference: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface GoodsReceipt {
  id: number;
  receiptNumber: string;
  reference: string;
  supplierCode: string;
  supplierName: string;
  receiptDate: Date;
  amount: number;
  status: 'created' | 'validated' | 'cancelled';
  items: ReceiptItem[];
}

@Component({
  selector: 'app-bon-entree',
  standalone: true,
  imports: [
    CommonModule,
    TableModule, ButtonModule, TooltipModule, TabMenuModule,
    CardModule, TagModule, DialogModule, CalendarModule, 
    InputTextModule, SupplierOrderDialogComponent,
    HeaderBarComponent, DataTableComponent, ConfirmDialogModule,
    InvoicePrintComponent
  ],
  template: `
    <div class="receipt-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <app-header-bar
          [title]="'Gestion des bons d entrée'"
          [buttons]="headerButtons"
          [subtitle]="'Gérez vos bons d entrée de marchandises'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Total Bons d'Entrée</span>
              <span class="stat-value">{{ receipts.length }}</span>
              <div class="stat-meta">
                <span>Ce mois: {{ recentReceiptsCount }}</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-box"></i>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Créés</span>
              <span class="stat-value">{{ createdCount }}</span>
              <div class="stat-meta">
                <span>{{ createdPercentage }}% du total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-file-edit"></i>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Validés</span>
              <span class="stat-value">{{ validatedCount }}</span>
              <div class="stat-meta">
                <span>{{ validatedPercentage }}% du total</span>
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
          [data]="filteredReceipts"
          [columns]="tableColumns"
          [tabs]="statusTabs"
          [activeTab]="activeStatusTab"
          (tabChanged)="onStatusFilterChange($event)"
          (search)="onSearch($event)">
          
          <ng-template #actionTemplate let-row>
            <div class="action-buttons">
              <button pButton 
                icon="pi pi-eye" 
                class="action-button invoice-button p-button-warning"
                (click)="displayInvoice(row)"
                [disabled]="row.status !== 'validated'"></button>

              <button pButton 
                icon="pi pi-file-export" 
                class="action-button print-button p-button-help"
                (click)="printReceipt(row)"></button>

              <button pButton severity="contrast" icon="pi pi-truck" 
                class="action-button delivery-button"
                (click)="orderFromSupplier(row)"></button>

              <button pButton 
                icon="pi pi-trash" 
                class="action-button delete-button p-button-danger"
                (click)="cancelReceipt(row)"
                [disabled]="row.status === 'cancelled' || row.status === 'validated'"></button>
            </div>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Dialogs -->
      <app-supplier-order-dialog 
        [(visible)]="showSupplierOrderDialog" 
        [receipt]="selectedReceipt"
        (confirm)="onSupplierOrderConfirm($event)">
      </app-supplier-order-dialog>

      <app-invoice-print 
        [visible]="showPrintDialogFlag" 
        [data]="printData"
        (visibleChange)="onPrintDialogClose($event)">
      </app-invoice-print>
    </div>
  `,
  styles: [`
    .receipt-management-container {
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
    .receipt-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-created {
      background-color: #e2e8f0;
      color: #475569;
    }

    .status-validated {
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
export class BonEntreeComponent {
  private dialogRef?: DynamicDialogRef;

  // Sample data for demonstration
  receipts: GoodsReceipt[] = [
    {
      id: 1,
      receiptNumber: 'BE-2023-001',
      reference: 'CMD-2023-001',
      supplierCode: 'FOUR-001',
      supplierName: 'SARL Matériel Informatique',
      receiptDate: new Date('2023-10-02'),
      amount: 12500.500,
      status: 'validated',
      items: [
        { reference: 'PRD-001', productName: 'Ordinateur Portable', quantity: 5, unitPrice: 2000, total: 10000 },
        { reference: 'PRD-002', productName: 'Imprimante Laser', quantity: 2, unitPrice: 1250.250, total: 2500.500 }
      ]
    },
    {
      id: 2,
      receiptNumber: 'BE-2023-002',
      reference: 'CMD-2023-002',
      supplierCode: 'FOUR-002',
      supplierName: 'Technologie Plus',
      receiptDate: new Date('2023-10-06'),
      amount: 3750.750,
      status: 'created',
      items: [
        { reference: 'PRD-003', productName: 'Ecran 24"', quantity: 3, unitPrice: 1250.250, total: 3750.750 }
      ]
    },
    {
      id: 3,
      receiptNumber: 'BE-2023-003',
      reference: 'CMD-2023-003',
      supplierCode: 'FOUR-003',
      supplierName: 'Global Components',
      receiptDate: new Date('2023-10-11'),
      amount: 8500.000,
      status: 'created',
      items: [
        { reference: 'PRD-004', productName: 'Serveur Rack', quantity: 1, unitPrice: 6500, total: 6500 },
        { reference: 'PRD-005', productName: 'Switch 24 ports', quantity: 2, unitPrice: 1000, total: 2000 }
      ]
    },
    {
      id: 4,
      receiptNumber: 'BE-2023-004',
      reference: 'CMD-2023-004',
      supplierCode: 'FOUR-001',
      supplierName: 'SARL Matériel Informatique',
      receiptDate: new Date('2023-10-16'),
      amount: 1500.000,
      status: 'cancelled',
      items: [
        { reference: 'PRD-006', productName: 'Clavier Sans Fil', quantity: 10, unitPrice: 150, total: 1500 }
      ]
    },
    {
      id: 5,
      receiptNumber: 'BE-2023-005',
      reference: 'CMD-2023-005',
      supplierCode: 'FOUR-004',
      supplierName: 'Electro Distribution',
      receiptDate: new Date('2023-10-21'),
      amount: 2250.000,
      status: 'validated',
      items: [
        { reference: 'PRD-007', productName: 'Souris Optique', quantity: 15, unitPrice: 50, total: 750 },
        { reference: 'PRD-008', productName: 'Disque Dur Externe', quantity: 5, unitPrice: 300, total: 1500 }
      ]
    }
  ];

  filteredReceipts = [...this.receipts];
  statusTabs: ReceiptStatusTab[] = [
    { label: 'Tous', key: 'all' },
    { label: 'Créés', key: 'created' },
    { label: 'Validés', key: 'validated' },
    { label: 'Annulés', key: 'cancelled' }
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
      label: 'Nouveau BE',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'receiptNumber', header: 'N° BE' },
    { field: 'reference', header: 'Référence' },
    { field: 'supplierCode', header: 'Code Fournisseur' },
    { field: 'supplierName', header: 'Nom Fournisseur' },
    { 
      field: 'receiptDate', 
      header: 'Date Réception',
      body: (receipt: GoodsReceipt) => this.formatDate(receipt.receiptDate)
    },
    { 
      field: 'amount', 
      header: 'Montant',
      body: (receipt: GoodsReceipt) => this.formatCurrency(receipt.amount)
    },
    { 
      field: 'status', 
      header: 'Statut',
      body: (receipt: GoodsReceipt) => this.getStatusBadge(receipt)
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  showPrintDialogFlag = false;
  printData: any = {};
  showSupplierOrderDialog = false;
  selectedReceipt: GoodsReceipt | null = null;
  searchTerm = '';

  constructor(
    private router: Router, 
    private datePipe: DatePipe, 
    private dialogService: DialogService
  ) {}

  /**
   * Formats a date using Angular's DatePipe
   * @param date The date to format
   * @returns Formatted date string (dd/MM/yyyy)
   */
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  /**
   * Formats a currency value using Angular's DatePipe
   * @param amount The amount to format
   * @returns Formatted currency string (TND)
   */
  private formatCurrency(amount: number): string {
    return this.datePipe.transform(amount, '1.3-3', 'TND') || '';
  }

  /**
   * Generates a status badge HTML for a receipt
   * @param receipt The goods receipt
   * @returns HTML string for the status badge
   */
  private getStatusBadge(receipt: GoodsReceipt): string {
    const statusMap = {
      'created': { label: 'Créé', class: 'status-created' },
      'validated': { label: 'Validé', class: 'status-validated' },
      'cancelled': { label: 'Annulé', class: 'status-cancelled' }
    };

    const status = statusMap[receipt.status] || { label: receipt.status, class: '' };
    return `<span class="receipt-status ${status.class}">${status.label}</span>`;
  }

  /**
   * Handles search input changes
   * @param term The search term
   */
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterReceipts();
  }

  /**
   * Filters receipts based on active status tab and search term
   */
  filterReceipts(): void {
    let filtered = [...this.receipts];

    // Apply status filter
    if (this.activeStatusTab.key !== 'all') {
      filtered = filtered.filter(r => r.status === this.activeStatusTab.key);
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.receiptNumber.toLowerCase().includes(this.searchTerm) ||
        receipt.reference.toLowerCase().includes(this.searchTerm) ||
        receipt.supplierCode.toLowerCase().includes(this.searchTerm) ||
        receipt.supplierName.toLowerCase().includes(this.searchTerm) ||
        this.formatDate(receipt.receiptDate).includes(this.searchTerm) ||
        this.formatCurrency(receipt.amount).includes(this.searchTerm)
      );
    }

    this.filteredReceipts = filtered;
  }

  /**
   * Handles status tab changes
   * @param tab The selected status tab
   */
  onStatusFilterChange(tab: MenuItem): void {
    this.activeStatusTab = tab as ReceiptStatusTab;
    this.filterReceipts();
  }

  /**
   * Prepares print data for a receipt
   * @param receipt The receipt to print
   */
  private preparePrintData(receipt: GoodsReceipt): void {
    const totalHT = receipt.items.reduce((sum, item) => sum + item.total, 0);
    const vatRate = 0.19;
    const totalTVA = totalHT * vatRate;
    const fiscalStamp = 0.600;
    const totalTTC = totalHT + totalTVA + fiscalStamp;

    const dueDate = new Date(receipt.receiptDate);
    dueDate.setDate(dueDate.getDate() + 30);

    this.printData = {
      invoiceNumber: 'FAC-' + receipt.receiptNumber,
      invoiceDate: receipt.receiptDate,
      companyName: 'Votre Société',
      companyAddress: '123 Rue des Entreprises',
      companyPostalCode: '1000',
      companyCity: 'Tunis',
      companyPhone: '70 123 456',
      companyEmail: 'contact@votresociete.com',
      companyTaxId: '12345678/A/M/000',
      clientName: receipt.supplierName,
      clientAddress: '',
      clientPostalCode: '',
      clientCity: '',
      clientTaxId: '',
      items: receipt.items,
      totalHT: totalHT,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      fiscalStamp: fiscalStamp,
      vatRate: vatRate,
      dueDate: dueDate,
      paymentMethod: 'Virement Bancaire',
      paymentTerms: 'Paiement à 30 jours fin de mois'
    };
  }

  /**
   * Handles print dialog close event
   * @param visible The visibility state of the dialog
   */
  onPrintDialogClose(visible: boolean) {
    this.showPrintDialogFlag = visible;
  }

  /**
   * Opens the print dialog for a receipt
   * @param receipt The receipt to print
   */
  printReceipt(receipt: GoodsReceipt): void {
    this.preparePrintData(receipt);
    this.showPrintDialogFlag = true;
  }

  /**
   * Opens the supplier order dialog for a receipt
   * @param receipt The receipt to order from supplier
   */
  orderFromSupplier(receipt: GoodsReceipt): void {
    this.selectedReceipt = receipt;
    this.showSupplierOrderDialog = true;
  }

  /**
   * Handles supplier order confirmation
   * @param data The order confirmation data
   */
  onSupplierOrderConfirm(data: any) {
    console.log('Order confirmed:', data);
    this.showSupplierOrderDialog = false;
  }

  /**
   * Displays a receipt invoice in a dialog
   * @param receipt The receipt to display
   */
  displayInvoice(receipt: GoodsReceipt): void {
    this.dialogRef = this.dialogService.open(DisplayFactureComponent, {
      header: `Facture ${receipt.receiptNumber}`,
      width: '80%',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { receipt: receipt }
    });
  }

  /**
   * Cancels a receipt after confirmation
   * @param receipt The receipt to cancel
   */
  cancelReceipt(receipt: GoodsReceipt): void {
    if (confirm(`Voulez-vous vraiment annuler le bon d'entrée ${receipt.receiptNumber}?`)) {
      receipt.status = 'cancelled';
      this.filterReceipts();
    }
  }

  /**
   * Handles header button clicks
   * @param key The button key that was clicked
   */
  onHeaderButtonClick(key: string): void {
    switch(key) {
      case 'back':
        this.router.navigate(['/Gescom/frontOffice/Dashboards']);
        break;
      case 'add':
        this.router.navigate(['/Gescom/frontOffice/Achat/BonDentree/add']);
        break;
      case 'export':
        console.log('Export receipts');
        break;
    }
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  // Statistics properties
  get createdCount(): number {
    return this.receipts.filter(r => r.status === 'created').length;
  }

  get validatedCount(): number {
    return this.receipts.filter(r => r.status === 'validated').length;
  }

  get cancelledCount(): number {
    return this.receipts.filter(r => r.status === 'cancelled').length;
  }

  get recentReceiptsCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.receipts.filter(r => r.receiptDate > oneMonthAgo).length;
  }

  get totalAmount(): number {
    return this.receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  }

  get averageAmount(): number {
    return this.receipts.length > 0 ? this.totalAmount / this.receipts.length : 0;
  }

  get createdPercentage(): number {
    return Math.round((this.createdCount / this.receipts.length) * 100);
  }

  get validatedPercentage(): number {
    return Math.round((this.validatedCount / this.receipts.length) * 100);
  }
}