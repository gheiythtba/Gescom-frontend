

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-devis',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    TableModule,
    CardModule,
    DropdownModule,
    FormsModule
  ],
  template: `
    <div class="invoice-container">
      <!-- Currency Selection -->
      <div class="currency-selection">
        <div class="detail-item">
          <label>Devise</label>
          <p-dropdown [options]="currencyOptions" [(ngModel)]="selectedCurrency" 
                     (onChange)="updateCurrencyDisplay()" optionLabel="name"></p-dropdown>
        </div>
        <div class="detail-item" *ngIf="selectedCurrency.code === 'EUR'">
          <label>Taux de change (1 EUR = ? TND)</label>
          <span>{{ currentDevis?.multiplier | number:'1.2-2' }}</span>
        </div>
      </div>

      <!-- Header Section -->
      <div class="invoice-header">
        <div class="invoice-title">
          <h1>Devis</h1>
          <div class="invoice-meta">
            <span class="invoice-number">N°: {{currentDevis?.number || '---'}}</span>
            <span class="invoice-date">Date: {{currentDevis?.date || '---'}}</span>
          </div>
        </div>
        <div class="client-info">
          <h2>{{ currentDevis?.clientName || '---' }}</h2>
          <span>Client</span>
          <div class="client-details">
            <span>{{ currentDevis?.clientAddress || '---' }}</span>
            <span>{{ currentDevis?.clientPhone || '---' }}</span>
            <span>{{ currentDevis?.clientEmail || '---' }}</span>
          </div>
        </div>
      </div>

      <p-divider></p-divider>

      <!-- Document Details -->
      <div class="document-details">
        <div class="details-grid">
          <div class="detail-item">
            <label>Référence Externe</label>
            <span>{{ currentDevis?.externalReference || '---' }}</span>
          </div>
          <div class="detail-item">
            <label>Date</label>
            <span>{{ currentDevis?.date || '---' }}</span>
          </div>
          <div class="detail-item">
            <label>Entrepôt</label>
            <span>{{ currentDevis?.warehouse || '---' }}</span>
          </div>
          <div class="detail-item">
            <label>Note</label>
            <span>{{ currentDevis?.note || '---' }}</span>
          </div>
          <div class="detail-item" *ngIf="selectedCurrency.code === 'TND'">
            <label>Multiplicateur (1 EUR = ? TND)</label>
            <span>{{ currentDevis?.multiplier | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="products-section">
        <p-table [value]="currentDevis?.products || []" [responsive]="true">
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
              <td>{{convertCurrency(product.unitPrice) | number:'1.3-3'}} {{selectedCurrency.code}}</td>
              <td>{{product.unit}}</td>
              <td>{{product.vatRate * 100}}%</td>
              <td>{{ convertCurrency(product.totalHT) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
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
              <tr *ngFor="let vat of currentDevis?.vatSummary || []">
                <td>{{ vat.rate * 100 }}%</td>
                <td>{{ convertCurrency(vat.base) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
                <td>{{ convertCurrency(vat.amount) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total HT</td>
                <td>{{ convertCurrency(currentDevis?.totalHT) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TVA</td>
                <td>{{ convertCurrency(currentDevis?.totalTVA) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TTC</td>
                <td>{{ convertCurrency(currentDevis?.totalTTC) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
              </tr>
              <tr class="total-row" *ngIf="selectedCurrency.code === 'TND'">
                <td colspan="2">Taux de change (1 EUR)</td>
                <td>{{ currentDevis?.multiplier | number:'1.2-2' }} TND</td>
              </tr>
              <tr class="grand-total">
                <td colspan="2">Net A Payer</td>
                <td>{{ convertCurrency(currentDevis?.netToPay) | number:'1.3-3' }} {{selectedCurrency.code}}</td>
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
        <button pButton label="Imprimer" icon="pi pi-print" class="p-button-primary" (click)="printDevis()"></button>
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

    .currency-selection {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .currency-selection .detail-item {
      width: 100%;
      max-width: 300px;
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
      
      .currency-selection, .action-buttons {
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
export class ViewDevisComponent {
  // Currency options
  currencyOptions = [
    { name: 'Dinar Tunisien (TND)', code: 'TND' },
    { name: 'Euro (EUR)', code: 'EUR' }
  ];
  
  selectedCurrency: any = this.currencyOptions[0];
  originalDevis: any;
  currentDevis: any;

  // Mocked list of devis
  devisList = [
    {
      number: 'DEV-2023-001',
      date: '10/06/2023',
      clientName: 'Client Premium',
      clientAddress: '456 Avenue des Entreprises, Sousse',
      clientPhone: '70 654 321',
      clientEmail: 'contact@clientpremium.com',
      externalReference: 'REF-DEV-001',
      warehouse: 'Entrepôt Principal',
      note: 'Devis valable 30 jours',
      multiplier: 3.2, // This is now the exchange rate (1 EUR = 3.2 TND)
      products: [
        {
          designation: 'Ordinateur Portable',
          quantity: 1,
          unitPrice: 2500, // This is in TND
          unit: 'Pièce',
          vatRate: 0.19,
          totalHT: 2500 // This is in TND
        },
        {
          designation: 'Souris Sans Fil',
          quantity: 2,
          unitPrice: 120, // This is in TND
          unit: 'Pièce',
          vatRate: 0.19,
          totalHT: 240 // This is in TND
        }
      ],
      vatSummary: [
        { rate: 0.19, base: 2740, amount: 520.6 } // These are in TND
      ],
      totalHT: 2740, // TND
      totalTVA: 520.6, // TND
      totalTTC: 3260.6, // TND
      netToPay: 3260.6 // TND
    },
    {
      number: 'DEV-2023-002',
      date: '15/06/2023',
      clientName: 'Client Entreprise',
      clientAddress: '789 Boulevard des Sociétés, Hammamet',
      clientPhone: '70 789 123',
      clientEmail: 'contact@cliententreprise.com',
      externalReference: 'REF-DEV-002',
      warehouse: 'Entrepôt Nord',
      note: 'Devis avec remise spéciale',
      multiplier: 3.15, // Different exchange rate for this devis (1 EUR = 3.15 TND)
      products: [
        {
          designation: 'Écran 24"',
          quantity: 3,
          unitPrice: 800, // TND
          unit: 'Pièce',
          vatRate: 0.19,
          totalHT: 2400 // TND
        },
        {
          designation: 'Clavier Mécanique',
          quantity: 3,
          unitPrice: 350, // TND
          unit: 'Pièce',
          vatRate: 0.19,
          totalHT: 1050 // TND
        }
      ],
      vatSummary: [
        { rate: 0.19, base: 3450, amount: 655.5 } // TND
      ],
      totalHT: 3450, // TND
      totalTVA: 655.5, // TND
      totalTTC: 4105.5, // TND
      netToPay: 4105.5 // TND (no discount in this example)
    }
  ];

  ngOnInit() {
    // Load first devis by default
    this.originalDevis = this.devisList[0];
    this.currentDevis = {...this.originalDevis};
  }

  convertCurrency(amount: number): number {
    if (this.selectedCurrency.code === 'EUR') {
      // Convert from TND to EUR using the multiplier (exchange rate)
      return amount / this.currentDevis.multiplier;
    }
    // For TND, return the amount as is
    return amount;
  }

  updateCurrencyDisplay() {
    // Just update the display, no need to modify the original data
    this.currentDevis = {...this.originalDevis};
  }

  printDevis() {
    window.print();
  }
}