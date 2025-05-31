import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InvoicePrintComponent } from './print-invoice.component'; 

@Component({
  selector: 'app-display-facture',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    CardModule,
    TableModule,
    DatePipe
  ],
    template: `
    <div class="invoice-container">
      <!-- Invoice Content -->
      <div class="invoice-content">
        <!-- Header Section -->
        <div class="header-section">
          <div class="company-info">
            <h2>{{companyName}}</h2>
            <p>{{companyAddress}}</p>
            <p>{{companyPostalCode}} {{companyCity}}</p>
            <p>Tél: {{companyPhone}} | Email: {{companyEmail}}</p>
            <p>{{companyTaxId}}</p>
          </div>
          
          <div class="invoice-info">
            <h1>Facture</h1>
            <div class="invoice-meta">
              <span>N°: {{invoiceNumber}}</span>
              <span>Date: {{invoiceDate | date:'dd/MM/yyyy'}}</span>
            </div>
          </div>
        </div>

        <!-- Client Information -->
        <div class="client-section">
          <div class="client-info">
            <h3>Client</h3>
            <p>{{clientName}}</p>
            <p>{{clientAddress}}</p>
            <p>{{clientPostalCode}} {{clientCity}}</p>
            <p>{{clientTaxId}}</p>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Products Table -->
        <div class="products-section">
          <p-table [value]="items" [responsive]="true">
            <ng-template pTemplate="header">
              <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix Unitaire HT</th>
                <th>TVA</th>
                <th>Total HT</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{item.reference}}</td>
                <td>{{item.productName}}</td>
                <td>{{item.quantity}}</td>
                <td>{{item.unitPrice | number:'1.3-3':'fr'}} TND</td>
                <td>{{vatRate * 100}}%</td>
                <td>{{item.total | number:'1.3-3':'fr'}} TND</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Totals Section -->
        <div class="totals-section">
          <div class="totals-grid">
            <div class="totals-table">
              <table>
                <tr>
                  <th>TVA</th>
                  <th>Base</th>
                  <th>Montant</th>
                </tr>
                <tr>
                  <td>{{vatRate * 100}}%</td>
                  <td>{{totalHT | number:'1.3-3':'fr'}} TND</td>
                  <td>{{totalTVA | number:'1.3-3':'fr'}} TND</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2">Total HT</td>
                  <td>{{totalHT | number:'1.3-3':'fr'}} TND</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2">Total TVA</td>
                  <td>{{totalTVA | number:'1.3-3':'fr'}} TND</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2">Timbre Fiscal</td>
                  <td>{{fiscalStamp | number:'1.3-3':'fr'}} TND</td>
                </tr>
                <tr class="grand-total">
                  <td colspan="2">Total TTC</td>
                  <td>{{totalTTC | number:'1.3-3':'fr'}} TND</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Payment Information -->
        <div class="payment-info">
          <p>Date d'échéance: {{dueDate | date:'dd/MM/yyyy'}}</p>
          <p>Mode de paiement: {{paymentMethod}}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>{{paymentTerms}}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons no-print">
        <button pButton label="Fermer" icon="pi pi-times" class="p-button-secondary" (click)="close()"></button>
      </div>
    </div>
  `,
  styles: [`
   .invoice-container {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      max-width: 800px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    /* Regular styles for display */
    .header-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .company-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #2c3e50;
    }

    .company-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #34495e;
    }

    .invoice-info h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #2c3e50;
      text-align: right;
    }

    .invoice-meta {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #7f8c8d;
      text-align: right;
    }

    .invoice-meta span {
      display: block;
    }

    .client-section {
      margin-bottom: 1.5rem;
    }

    .client-info {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }

    .client-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #2c3e50;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }

    .client-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .products-section {
      margin: 1.5rem 0;
    }

    :host ::ng-deep .p-datatable {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.8rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin: 1.5rem 0;
    }

    .totals-table {
      width: 350px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }

    .totals-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .totals-table th, .totals-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .totals-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .total-row {
      font-weight: 500;
      background-color: #f8f9fa;
    }

    .grand-total {
      font-weight: 600;
      background-color: #e2e8f0;
      color: #2c3e50;
    }

    .payment-info {
      margin: 1rem 0;
      font-size: 0.9rem;
    }

    .footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
      font-size: 0.8rem;
      color: #64748b;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    /* Print-specific styles */
    @media print {
      @page {
        size: A4;
        margin: 1cm;
      }

      body {
        background: white;
        font-size: 12pt;
        line-height: 1.5;
      }

      body * {
        visibility: hidden;
      }

      .invoice-container, .invoice-container * {
        visibility: visible;
      }

      .invoice-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        box-shadow: none;
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      .no-print, .no-print * {
        display: none !important;
      }

      /* Keep the same styling as display view */
      .invoice-content {
        padding: 1.5cm;
        max-width: 800px;
        margin: 0 auto;
        border: none;
      }

      .header-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .company-info h2 {
        font-size: 1.25rem;
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      .company-info p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: #34495e;
      }

      .invoice-info h1 {
        font-size: 1.75rem;
        margin: 0;
        color: #2c3e50;
        text-align: right;
      }

      .invoice-meta {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #7f8c8d;
        text-align: right;
      }

      .client-info {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
      }

      .client-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: #2c3e50;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 0.5rem;
      }

      :host ::ng-deep .p-datatable {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        background-color: #f8f9fa !important;
        color: #2c3e50;
        font-weight: 600;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f1f5f9;
      }

      .totals-table {
        width: 350px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
      }

      .totals-table th, .totals-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }

      .totals-table th {
        background-color: #f8f9fa !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .total-row {
        font-weight: 500;
        background-color: #f8f9fa !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .grand-total {
        font-weight: 600;
        background-color: #e2e8f0 !important;
        color: #2c3e50;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* Hide PrimeNG divider in print */
      p-divider {
        display: none;
      }
    }
  `]
})
export class DisplayFactureComponent {
  // Company Information
  companyName = 'Votre Société';
  companyAddress = '123 Rue des Entreprises';
  companyPostalCode = '1000';
  companyCity = 'Tunis';
  companyPhone = '70 123 456';
  companyEmail = 'contact@votresociete.com';
  companyTaxId = '12345678/A/M/000';

  // Invoice Information
  invoiceNumber = 'FAC-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000);
  invoiceDate = new Date();
  fiscalStamp = 0.600;
  vatRate = 0.19;

  // Client Information
  clientName = '';
  clientAddress = '';
  clientPostalCode = '';
  clientCity = '';
  clientTaxId = '';

  // Items
  items: any[] = [];

  // Payment Information
  dueDate = new Date();
  paymentMethod = 'Virement Bancaire';
  paymentTerms = 'Paiement à 30 jours fin de mois';

  // Calculated totals
  totalHT = 0;
  totalTVA = 0;
  totalTTC = 0;

  // Print dialog control
  showPrintDialogFlag = false;
  printData: any = {};

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    // Initialize from passed data
    if (config.data?.receipt) {
      const receipt = config.data.receipt;
      this.clientName = receipt.supplierName;
      this.clientAddress = ''; // You might want to add address to your receipt interface
      this.items = receipt.items;
      this.invoiceDate = receipt.receiptDate;
      this.dueDate = new Date(receipt.receiptDate);
      this.dueDate.setDate(this.dueDate.getDate() + 30); // 30 days payment terms
      
      // Calculate totals
      this.calculateTotals();

    }
  }

  calculateTotals() {
    this.totalHT = this.items.reduce((sum, item) => sum + item.total, 0);
    this.totalTVA = this.totalHT * this.vatRate;
    this.totalTTC = this.totalHT + this.totalTVA + this.fiscalStamp;
  }


 

  close() {
    this.ref.close();
  }
}