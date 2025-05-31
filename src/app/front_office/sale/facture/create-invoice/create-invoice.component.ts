import { Component } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import localeFr from '@angular/common/locales/fr';

// Register French locale for number formatting
registerLocaleData(localeFr);

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    DialogModule,
    CardModule,
    DividerModule,
    InputNumberModule,
    AutoCompleteModule,
    CheckboxModule
  ],
  template: `
    <div class="invoice-container">
      <!-- Client Selection -->
      <div class="client-selection print-hide">
        <div class="detail-item">
          <label>Rechercher un client</label>
          <p-autoComplete [(ngModel)]="selectedClient" [suggestions]="filteredClients" 
                         (completeMethod)="filterClients($event)" field="name" [dropdown]="true"
                         (onSelect)="onClientChange()" (onClear)="resetClientInfo()"
                         placeholder="Commencez à taper pour rechercher un client..." [minLength]="1">
            <ng-template let-client pTemplate="item">
              <div class="client-option">
                <div>{{client.name}}</div>
                <small>{{client.email}} • {{client.phone}}</small>
              </div>
            </ng-template>
          </p-autoComplete>
        </div>
      </div>

      <!-- Header Section -->
      <div class="invoice-header">
        <div class="invoice-title">
          <h1>{{isDevis ? 'Devis' : 'Facture'}}</h1>
          <div class="invoice-meta">
            <span class="invoice-number">N°: {{externalReference || '---'}}</span>
            <span class="invoice-date">Date: {{invoiceDate | date:'dd/MM/yyyy'}}</span>
          </div>
        </div>
        <div class="client-info">
          <h2>{{ clientName }}</h2>
          <span>Client</span>
          <div class="client-details">
            <span>{{ clientAddress }}</span>
            <span>{{ clientPhone }}</span>
            <span>{{ clientEmail }}</span>
          </div>
        </div>
      </div>

      <p-divider></p-divider>

      <!-- Document Details -->
      <div class="document-details">
        <div class="details-grid">
          <div class="detail-item">
            <label>Référence Externe</label>
            <input pInputText [(ngModel)]="externalReference" class="print-hide" />
            <span class="print-only">{{externalReference || '---'}}</span>
          </div>
          <div class="detail-item">
            <label>Date</label>
            <p-calendar [(ngModel)]="invoiceDate" [showIcon]="true" dateFormat="dd/mm/yy" class="print-hide"></p-calendar>
            <span class="print-only">{{invoiceDate | date:'dd/MM/yyyy'}}</span>
          </div>
          <div class="detail-item">
            <label>Entrepôt</label>
            <p-dropdown [options]="warehouses" [(ngModel)]="selectedWarehouse" 
                       (onChange)="onWarehouseChange()" class="print-hide"></p-dropdown>
            <span class="print-only">{{getWarehouseLabel(selectedWarehouse)}}</span>
          </div>
          <div class="detail-item">
            <label>Note</label>
            <input pInputText [(ngModel)]="note" class="print-hide" />
            <span class="print-only">{{note || '---'}}</span>
          </div>
          <div class="detail-item print-hide">
            <label>Type de document</label>
            <div class="flex align-items-center">
              <p-checkbox [(ngModel)]="isDevis" binary="true" (onChange)="updateDocumentType()"></p-checkbox>
              <span class="ml-2">Devis</span>
            </div>
          </div>
          <div class="detail-item" *ngIf="!isDevis">
            <label>Timbre Fiscal</label>
            <p-inputNumber [(ngModel)]="fiscalStamp" mode="currency" currency="TND" 
                          (onInput)="calculateTotals()" class="print-hide"></p-inputNumber>
            <span class="print-only">{{fiscalStamp | number:'1.3-3':'fr'}} TND</span>
          </div>
          <div class="detail-item" *ngIf="isDevis">
            <label>Multiplicateur Devis</label>
            <p-inputNumber [(ngModel)]="devisMultiplier" 
                          mode="decimal" 
                          [min]="0" 
                          [maxFractionDigits]="2"
                          [locale]="'fr'"
                          (onInput)="validateDevisMultiplier(); calculateTotals()" 
                          class="print-hide"></p-inputNumber>
            <span class="print-only">{{devisMultiplier | number:'1.2-2':'fr'}}</span>
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
              <th class="print-hide"></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-product let-rowIndex="rowIndex">
            <tr>
              <td>
                <span>{{product.designation}}</span>
              </td>
              <td>
                <p-inputNumber [(ngModel)]="product.quantity" mode="decimal" [min]="1" [max]="product.maxQuantity" 
                              (onInput)="calculateRowTotal(rowIndex)" class="print-hide"></p-inputNumber>
                <span class="print-only">{{product.quantity}}</span>
              </td>
              <td>
                <p-inputNumber [(ngModel)]="product.unitPrice" mode="currency" currency="TND" 
                              (onInput)="calculateRowTotal(rowIndex)" class="print-hide"></p-inputNumber>
                <span class="print-only">{{product.unitPrice | number:'1.3-3':'fr'}} TND</span>
              </td>
              <td>
                <p-dropdown [options]="units" [(ngModel)]="product.unit" class="print-hide"></p-dropdown>
                <span class="print-only">{{getUnitLabel(product.unit)}}</span>
              </td>
              <td>
                <p-dropdown [options]="vatRates" [(ngModel)]="product.vatRate" 
                           (onChange)="calculateRowTotal(rowIndex)" class="print-hide"></p-dropdown>
                <span class="print-only">{{product.vatRate * 100}}%</span>
              </td>
              <td>
                {{ product.totalHT | number:'1.3-3':'fr' }} TND
              </td>
              <td class="print-hide">
                <button pButton icon="pi pi-trash" class="p-button-danger p-button-text" (click)="removeProduct(rowIndex)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
        <button pButton label="Ajouter un Produit" icon="pi pi-plus" class="print-hide" 
                (click)="showAddProductDialog()" [disabled]="!selectedWarehouse"></button>
      </div>

      <!-- Product Selection Dialog -->
      <p-dialog header="Sélectionner un Produit" [(visible)]="displayProductDialog" [style]="{width: '800px'}" [modal]="true">
        <div class="product-dialog-content">
          <div class="product-search">
            <input pInputText placeholder="Rechercher un produit..." [(ngModel)]="productSearchTerm" (input)="filterProducts()" />
          </div>
          <p-table [value]="filteredProducts" [paginator]="true" [rows]="5" [responsive]="true" selectionMode="single" [(selection)]="selectedProduct">
            <ng-template pTemplate="header">
              <tr>
                <th>Code</th>
                <th>Désignation</th>
                <th>Prix HT</th>
                <th>Unité</th>
                <th>Stock disponible</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr [pSelectableRow]="product">
                <td>{{product.code}}</td>
                <td>{{product.name}}</td>
                <td>{{product.price | number:'1.3-3':'fr'}} TND</td>
                <td>{{product.unit}}</td>
                <td>{{getProductStock(product)}}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Annuler" icon="pi pi-times" (click)="displayProductDialog = false" class="p-button-text"></button>
          <button pButton label="Ajouter" icon="pi pi-check" (click)="addSelectedProduct()" 
                 [disabled]="!selectedProduct || getProductStock(selectedProduct) <= 0" class="p-button-success"></button>
        </ng-template>
      </p-dialog>

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
                <td>{{ vat.base | number:'1.3-3':'fr' }} TND</td>
                <td>{{ vat.amount | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total HT</td>
                <td>{{ totalHT | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TVA</td>
                <td>{{ totalTVA | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">Total TTC</td>
                <td>{{ totalTTC | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="total-row" *ngIf="!isDevis">
                <td colspan="2">Timbre Fiscal</td>
                <td>{{ fiscalStamp | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="total-row" *ngIf="isDevis">
                <td colspan="2">Multiplicateur Devis</td>
                <td>{{ devisMultiplier | number:'1.2-2':'fr' }}</td>
              </tr>
              <tr class="grand-total">
                <td colspan="2">Net A Payer</td>
                <td>{{ netToPay | number:'1.3-3':'fr' }} TND</td>
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
            <img src="assets/logo.png" alt="Company Logo" class="print-hide" />
          </div>
          <div class="company-text">
            <h3>{{companyName}}</h3>
            <p>{{companyAddress}}</p>
            <p>Tél: {{companyPhone}}</p>
            <p>Email: {{companyEmail}}</p>
            <p>Matricule Fiscale: {{companyTaxId}}</p>
          </div>
          <div class="bank-details">
            <h4>Coordonnées Bancaires</h4>
            <p>{{bankName}}</p>
            <p>IBAN: {{bankIBAN}}</p>
            <p>Code Banque: {{bankCode}}</p>
            <p>Code Guichet: {{bankBranchCode}}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons print-hide">
        <button pButton label="Enregistrer" icon="pi pi-save" class="p-button-success"></button>
        <button pButton label="Imprimer" icon="pi pi-print" class="p-button-primary" (click)="printInvoice()"></button>
        <button pButton label="Annuler" icon="pi pi-times" class="p-button-danger"></button>
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

    .client-selection {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .client-selection .detail-item {
      width: 100%;
      max-width: 600px;
    }

    .client-option {
      line-height: 1.5;
      padding: 0.5rem 0;
    }

    .client-option small {
      color: var(--text-secondary-color);
      font-size: 0.85rem;
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

    .document-details h3 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 0.5rem;
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

    .products-section button {
      margin-top: 1rem;
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

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: #f8fafc;
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

    /* Product Dialog Styles */
    .product-dialog-content {
      padding: 1rem;
    }

    .product-search {
      margin-bottom: 1rem;
    }

    .product-search input {
      width: 100%;
      padding: 0.5rem;
    }

    /* Print-specific styles */
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
      
      .print-hide {
        display: none !important;
      }
      
      .print-only {
        display: inline !important;
      }
      
      .invoice-header {
        margin-bottom: 1rem;
      }
      
      .client-info {
        background-color: transparent;
        padding: 0;
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
    
    .print-only {
      display: none;
    }

    /* New styles for checkbox and fiscal stamp */
    .flex {
      display: flex;
    }
    .align-items-center {
      align-items: center;
    }
    .ml-2 {
      margin-left: 0.5rem;
    }
  `]
})
export class CreateInvoiceComponent {
  // Clients data
  clients = [
    { id: 1, name: 'HBO Technologies', address: '123 Rue des Clients, Tunis', phone: '70 123 456', email: 'contact@hbo.com', taxId: '12345678' },
    { id: 2, name: 'Netflix Tunisie', address: '456 Avenue des Entreprises, Sousse', phone: '70 654 321', email: 'contact@netflix.com', taxId: '87654321' },
    { id: 3, name: 'Amazon Maghreb', address: '789 Boulevard des Sociétés, Hammamet', phone: '70 789 123', email: 'contact@amazon.com', taxId: '11223344' },
    { id: 4, name: 'Apple Center Tunis', address: '1010 Rue des Technologies, Tunis', phone: '70 101 010', email: 'contact@apple.com', taxId: '55667788' },
    { id: 5, name: 'Google Tunisia', address: '1111 Avenue des Innovations, Sfax', phone: '70 111 111', email: 'contact@google.com', taxId: '99887766' },
    { id: 6, name: 'Microsoft Tunisia', address: '1212 Rue des Développeurs, Tunis', phone: '70 121 212', email: 'contact@microsoft.com', taxId: '55443322' },
    { id: 7, name: 'Samsung Electronics', address: '1313 Avenue de l\'Électronique, Sousse', phone: '70 131 313', email: 'contact@samsung.com', taxId: '66778899' },
    { id: 8, name: 'Orange Tunisie', address: '1414 Rue des Télécoms, Tunis', phone: '70 141 414', email: 'contact@orange.com', taxId: '11223355' },
    { id: 9, name: 'Ooredoo Tunisia', address: '1515 Avenue de la Communication, Tunis', phone: '70 151 515', email: 'contact@ooredoo.com', taxId: '66554433' },
    { id: 10, name: 'STEG', address: '1616 Rue de l\'Énergie, Tunis', phone: '70 161 616', email: 'contact@steg.com', taxId: '77889900' },
    { id: 11, name: 'SONEDE', address: '1717 Avenue de l\'Eau, Tunis', phone: '70 171 717', email: 'contact@sonede.com', taxId: '88776655' },
    { id: 12, name: 'Tunisair', address: '1818 Rue de l\'Aviation, Tunis', phone: '70 181 818', email: 'contact@tunisair.com', taxId: '33445566' },
    { id: 13, name: 'Banque de Tunisie', address: '1919 Avenue Habib Bourguiba, Tunis', phone: '70 191 919', email: 'contact@bte.com', taxId: '44556677' },
    { id: 14, name: 'BIAT', address: '2020 Rue de la Finance, Tunis', phone: '70 202 020', email: 'contact@biat.com', taxId: '55667788' },
    { id: 15, name: 'Attijari Bank', address: '2121 Boulevard des Banques, Sfax', phone: '70 212 121', email: 'contact@attijari.com', taxId: '66778899' }
  ];

  filteredClients: any[] = [];
  selectedClient: any = null;

  // Client Information
  clientName = '---';
  clientAddress = '---';
  clientPhone = '---';
  clientEmail = '---';
  clientTaxId = '---';

  // Invoice Information
  externalReference = '';
  invoiceDate: Date = new Date();
  selectedWarehouse: string = '';
  note = '';
  isDevis: boolean = false;
  fiscalStamp: number = 0;
  devisMultiplier: string | number = 1.0;  // Initialize with decimal
  
  // Products
  products: any[] = [];
  
  // Product Dialog
  displayProductDialog = false;
  productSearchTerm = '';
  selectedProduct: any = null;
  filteredProducts: any[] = [];

  // Products database with warehouse-specific stock
  allProducts = [
    { 
      id: 1, code: 'PROD-001', name: 'Ordinateur Portable', price: 2500, unit: 'PIECE', 
      stock: { WH1: 15, WH2: 5, WH3: 0 } 
    },
    { 
      id: 2, code: 'PROD-002', name: 'Souris Sans Fil', price: 120, unit: 'PIECE', 
      stock: { WH1: 42, WH2: 10, WH3: 8 } 
    },
    { 
      id: 3, code: 'PROD-003', name: 'Clavier Mécanique', price: 350, unit: 'PIECE', 
      stock: { WH1: 28, WH2: 0, WH3: 5 } 
    },
    { 
      id: 4, code: 'PROD-004', name: 'Écran 24"', price: 800, unit: 'PIECE', 
      stock: { WH1: 10, WH2: 2, WH3: 0 } 
    },
    { 
      id: 5, code: 'PROD-005', name: 'Câble HDMI', price: 25, unit: 'PIECE', 
      stock: { WH1: 75, WH2: 30, WH3: 20 } 
    },
    { 
      id: 6, code: 'PROD-006', name: 'Webcam HD', price: 180, unit: 'PIECE', 
      stock: { WH1: 30, WH2: 5, WH3: 3 } 
    },
    { 
      id: 7, code: 'PROD-007', name: 'Casque Audio', price: 450, unit: 'PIECE', 
      stock: { WH1: 18, WH2: 0, WH3: 2 } 
    },
    { 
      id: 8, code: 'PROD-008', name: 'Support Ordinateur', price: 150, unit: 'PIECE', 
      stock: { WH1: 22, WH2: 8, WH3: 4 } 
    }
  ];

  // Totals
  vatSummary: any[] = [];
  totalHT = 0;
  totalTVA = 0;
  totalTTC = 0;
  netToPay = 0;

  // Company Information
  companyName = 'Tech Solutions SARL';
  companyAddress = '45 Avenue Habib Bourguiba, 1002 Tunis, Tunisie';
  companyPhone = '+216 70 987 654';
  companyEmail = 'contact@techsolutions.tn';
  companyTaxId = '12345678/A/M/000';

  // Bank Information
  bankName = 'Banque Internationale Arabe de Tunisie (BIAT)';
  bankIBAN = 'TN59 1000 1234 5678 9012 3456';
  bankCode = '10';
  bankBranchCode = '100';

  warehouses = [
    { label: 'Entrepôt Principal', value: 'MAIN', code: 'WH1' },
    { label: 'Entrepôt Nord', value: 'NORTH', code: 'WH2' },
    { label: 'Entrepôt Sud', value: 'SOUTH', code: 'WH3' }
  ];

  units = [
    { label: 'Pièce', value: 'PIECE' },
    { label: 'Kg', value: 'KG' },
    { label: 'Litre', value: 'LITRE' },
    { label: 'Mètre', value: 'METER' },
    { label: 'Heure', value: 'HOUR' }
  ];

  vatRates = [
    { label: '0%', value: 0 },
    { label: '7%', value: 0.07 },
    { label: '13%', value: 0.13 },
    { label: '19%', value: 0.19 }
  ];

  constructor() {
    this.filteredProducts = [...this.allProducts];
  }

  // Filter clients based on search input
  filterClients(event: any) {
    const query = event.query.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query) ||
      client.taxId.toLowerCase().includes(query)
    );
  }

  // Update client info when selection changes
  onClientChange() {
    if (this.selectedClient) {
      this.clientName = this.selectedClient.name;
      this.clientAddress = this.selectedClient.address;
      this.clientPhone = this.selectedClient.phone;
      this.clientEmail = this.selectedClient.email;
      this.clientTaxId = this.selectedClient.taxId;
    } else {
      this.resetClientInfo();
    }
  }

  // Reset client info when no client is selected
  resetClientInfo() {
    this.clientName = '---';
    this.clientAddress = '---';
    this.clientPhone = '---';
    this.clientEmail = '---';
    this.clientTaxId = '---';
  }

  // Handle warehouse change
  onWarehouseChange() {
    this.filterProducts();
    // Clear products if warehouse changes
    if (this.products.length > 0) {
      this.products = [];
      this.calculateTotals();
    }
  }

  // Get product stock for selected warehouse
  getProductStock(product: any): number {
    if (!this.selectedWarehouse) return 0;
    const warehouse = this.warehouses.find(w => w.value === this.selectedWarehouse);
    return warehouse ? product.stock[warehouse.code as keyof typeof product.stock] || 0 : 0;
  }

  // Show product selection dialog
  showAddProductDialog() {
    if (!this.selectedWarehouse) return;
    
    this.displayProductDialog = true;
    this.selectedProduct = null;
    this.productSearchTerm = '';
    this.filterProducts();
  }

  // Filter products based on search term and warehouse
  filterProducts() {
    // First filter by search term if any
    let filtered = [...this.allProducts];
    if (this.productSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(this.productSearchTerm.toLowerCase())
      );
    }

    // Then filter by warehouse availability
    if (this.selectedWarehouse) {
      const warehouse = this.warehouses.find(w => w.value === this.selectedWarehouse);
      if (warehouse) {
        filtered = filtered.filter(product => 
          product.stock[warehouse.code as keyof typeof product.stock] > 0
        );
      }
    }

    this.filteredProducts = filtered;
  }

  // Add selected product to invoice
  addSelectedProduct() {
    if (!this.selectedProduct || !this.selectedWarehouse) return;

    const warehouse = this.warehouses.find(w => w.value === this.selectedWarehouse);
    if (!warehouse) return;

    const availableStock = this.selectedProduct.stock[warehouse.code as keyof typeof this.selectedProduct.stock] || 0;
    if (availableStock <= 0) return;

    const existingProduct = this.products.find(p => p.productId === this.selectedProduct.id);
    
    if (existingProduct) {
      if (existingProduct.quantity >= availableStock) return;
      existingProduct.quantity += 1;
      this.calculateRowTotal(this.products.indexOf(existingProduct));
    } else {
      this.products.push({
        productId: this.selectedProduct.id,
        designation: this.selectedProduct.name,
        quantity: 1,
        unitPrice: this.selectedProduct.price,
        unit: this.selectedProduct.unit,
        vatRate: 0.19,
        totalHT: this.selectedProduct.price,
        maxQuantity: availableStock
      });
    }
    
    this.calculateTotals();
    this.displayProductDialog = false;
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotals();
  }

  calculateRowTotal(index: number) {
    const product = this.products[index];
    product.totalHT = product.quantity * product.unitPrice;
    this.calculateTotals();
  }

  // New method to validate devis multiplier
  validateDevisMultiplier() {
    // Convert string with comma to number if needed
    if (typeof this.devisMultiplier === 'string') {
      this.devisMultiplier = parseFloat(this.devisMultiplier.replace(',', '.'));
    }
    
    // Ensure the multiplier is never negative
    if (this.devisMultiplier < 0) {
      this.devisMultiplier = 0;
    }
    // Round to 2 decimal places
    this.devisMultiplier = parseFloat(this.devisMultiplier.toFixed(2));
  }

  calculateTotals() {
    // Calculate total HT
    this.totalHT = this.products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);

    // Group VAT by rate
    const vatGroups: Record<number, { base: number, amount: number }> = {};
    this.products.forEach(product => {
      if (!vatGroups[product.vatRate]) {
        vatGroups[product.vatRate] = { base: 0, amount: 0 };
      }
      const rowTotal = product.quantity * product.unitPrice;
      vatGroups[product.vatRate].base += rowTotal;
      vatGroups[product.vatRate].amount += rowTotal * product.vatRate;
    });

    // Convert to array for display
    this.vatSummary = Object.keys(vatGroups).map(rate => ({
      rate: parseFloat(rate),
      base: vatGroups[parseFloat(rate)].base,
      amount: vatGroups[parseFloat(rate)].amount
    }));

    // Calculate total TVA
    this.totalTVA = this.vatSummary.reduce((sum, vat) => sum + vat.amount, 0);

    // Calculate TTC
    this.totalTTC = this.totalHT + this.totalTVA;

    // Handle French decimal format (comma) if input is string
    const multiplier = typeof this.devisMultiplier === 'string' ? 
                      parseFloat(this.devisMultiplier.replace(',', '.')) : 
                      this.devisMultiplier;

    // Calculate net to pay based on document type
    this.netToPay = this.isDevis ? 
                   this.totalTTC * multiplier : 
                   this.totalTTC + this.fiscalStamp;
  }

  // Handle document type change
  updateDocumentType() {
    this.calculateTotals();
  }

  getWarehouseLabel(value: string): string {
    const warehouse = this.warehouses.find(w => w.value === value);
    return warehouse ? warehouse.label : '';
  }

  getUnitLabel(value: string): string {
    const unit = this.units.find(u => u.value === value);
    return unit ? unit.label : '';
  }

  printInvoice() {
    window.print();
  }
}