import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    TableModule,
    CardModule
  ],
  template: `
    <div class="invoice-container">
      <!-- Header Section -->
      <div class="invoice-header">
        <div class="invoice-title">
          <h1>Facture</h1>
          <div class="invoice-meta">
            <span class="invoice-number">N°: FAC-2023-001</span>
            <span class="invoice-date">Date: 15/06/2023</span>
          </div>
        </div>
        <div class="client-info">
          <h2>Client Example</h2>
          <span>Client</span>
          <div class="client-details">
            <span>123 Rue des Clients, Tunis</span>
            <span>70 123 456</span>
            <span>client&#64;example.com</span>
          </div>
        </div>
      </div>

      <p-divider></p-divider>

      <!-- Document Details -->
      <div class="document-details">
        <div class="details-grid">
          <div class="detail-item">
            <label>Référence Externe</label>
            <span>REF-001</span>
          </div>
          <div class="detail-item">
            <label>Date</label>
            <span>15/06/2023</span>
          </div>
          <div class="detail-item">
            <label>Entrepôt</label>
            <span>Entrepôt Principal</span>
          </div>
          <div class="detail-item">
            <label>Note</label>
            <span>Merci pour votre confiance</span>
          </div>
          <div class="detail-item">
            <label>Timbre Fiscal</label>
            <span>1,000 TND</span>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="products-section">
        <p-table [value]="products" [responsive]="true">
          <ng-template pTemplate="header">
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix HT</th>
              <th>Unité</th>
              <th>TVA</th>
              <th>Total HT</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-product>
            <tr>
              <td>{{product.designation}}</td>
              <td>{{product.quantity}}</td>
              <td>{{product.unitPrice | number:'1.3-3'}} TND</td>
              <td>{{product.unit}}</td>
              <td>{{product.vatRate * 100}}%</td>
              <td>{{ product.totalHT | number:'1.3-3' }} TND</td>
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
              <tr *ngFor="let vat of vatSummary">
                <td>{{ vat.rate * 100 }}%</td>
                <td>{{ vat.base | number:'1.3-3' }} TND</td>
                <td>{{ vat.amount | number:'1.3-3' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total HT</td>
                <td>{{ totalHT | number:'1.3-3' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TVA</td>
                <td>{{ totalTVA | number:'1.3-3' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TTC</td>
                <td>{{ totalTTC | number:'1.3-3' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Timbre Fiscal</td>
                <td>{{ fiscalStamp | number:'1.3-3' }} TND</td>
              </tr>
              <tr class="grand-total">
                <td colspan="2">Net A Payer</td>
                <td>{{ netToPay | number:'1.3-3' }} TND</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <p-divider></p-divider>

      <!-- Company Information -->
      <div class="company-info">
        <div class="company-details">
          <div class="company-logo">
            <img src="assets/logo.png" alt="Company Logo" />
          </div>
          <div class="company-text">
            <h3>Tech Solutions SARL</h3>
            <p>45 Avenue Habib Bourguiba, 1002 Tunis, Tunisie</p>
            <p>Tél: +216 70 987 654</p>
            <p>Email: contact&#64;techsolutions.tn</p>
            <p>Matricule Fiscale: 12345678/A/M/000</p>
          </div>
          <div class="bank-details">
            <h4>Coordonnées Bancaires</h4>
            <p>Banque Internationale Arabe de Tunisie (BIAT)</p>
            <p>IBAN: TN59 1000 1234 5678 9012 3456</p>
            <p>Code Banque: 10</p>
            <p>Code Guichet: 100</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button pButton label="Imprimer" icon="pi pi-print" class="p-button-primary" (click)="printInvoice()"></button>
        <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-secondary"></button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f5f7fa;
      padding: 2rem;
    }

    .invoice-container {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .invoice-title h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .invoice-meta {
      display: flex;
      flex-direction: column;
      margin-top: 0.5rem;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .client-info {
      text-align: right;
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      min-width: 300px;
    }

    .client-info h2 {
      margin: 0 0 0.25rem 0;
      font-size: 1.5rem;
      color: #2c3e50;
    }

    .client-info > span {
      display: block;
      font-size: 0.9rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }

    .client-details {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #34495e;
    }

    .client-details span {
      display: block;
    }

    .document-details {
      margin: 1.5rem 0;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-item label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .products-section {
      margin: 2rem 0;
    }

    :host ::ng-deep .p-datatable {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
      padding: 0.75rem 1rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin: 2rem 0;
    }

    .totals-table {
      width: 350px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
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
      font-size: 1.1rem;
      background-color: #e2e8f0;
      color: #2c3e50;
    }

    .company-info {
      margin-top: 2rem;
    }

    .company-details {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .company-logo {
      width: 120px;
      height: 120px;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      overflow: hidden;
    }

    .company-logo img {
      max-width: 100%;
      max-height: 100%;
    }

    .company-text {
      flex: 1;
    }

    .company-text h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .company-text p {
      margin: 0.25rem 0;
      color: #34495e;
    }

    .bank-details {
      flex: 1;
    }

    .bank-details h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .bank-details p {
      margin: 0.25rem 0;
      color: #34495e;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    @media print {
      :host {
        padding: 0;
        background-color: white;
      }
      
      .invoice-container {
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      
      .action-buttons {
        display: none !important;
      }
      
      :host ::ng-deep .p-datatable {
        box-shadow: none;
      }
      
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        background-color: transparent;
        border-bottom: 2px solid #ddd;
      }
      
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        border-bottom: 1px solid #eee;
      }
      
      .totals-table {
        border: none;
      }
      
      .company-logo {
        background-color: transparent;
      }
    }
  `]
})
export class ViewInvoiceComponent {
  // Mocked invoice data
  products = [
    {
      designation: 'Ordinateur Portable',
      quantity: 2,
      unitPrice: 2500,
      unit: 'Pièce',
      vatRate: 0.19,
      totalHT: 5000
    },
    {
      designation: 'Souris Sans Fil',
      quantity: 3,
      unitPrice: 120,
      unit: 'Pièce',
      vatRate: 0.19,
      totalHT: 360
    },
    {
      designation: 'Clavier Mécanique',
      quantity: 1,
      unitPrice: 350,
      unit: 'Pièce',
      vatRate: 0.19,
      totalHT: 350
    }
  ];

  vatSummary = [
    { rate: 0.19, base: 5710, amount: 1084.9 }
  ];

  totalHT = 5710;
  totalTVA = 1084.9;
  totalTTC = 6794.9;
  fiscalStamp = 1;
  netToPay = 6795.9;

  printInvoice() {
    window.print();
  }
}