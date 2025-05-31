

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

registerLocaleData(localeFr);

@Component({
  selector: 'app-goods-receipt',
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

      <div class="invoice-header">
        <div class="invoice-title">
          <h1>Bon d'Entrée</h1>
          <div class="invoice-meta">
            <span class="invoice-number">N°: {{receiptNumber || '---'}}</span>
            <span class="invoice-date">Date: {{receiptDate | date:'dd/MM/yyyy'}}</span>
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

      <div class="document-details">
        <div class="details-grid">
          <div class="detail-item">
            <label>Référence</label>
            <input pInputText [(ngModel)]="externalReference" class="print-hide" />
            <span class="print-only">{{externalReference || '---'}}</span>
          </div>
          <div class="detail-item">
            <label>Date</label>
            <p-calendar [(ngModel)]="receiptDate" [showIcon]="true" dateFormat="dd/mm/yy" class="print-hide"></p-calendar>
            <span class="print-only">{{receiptDate | date:'dd/MM/yyyy'}}</span>
          </div>
          <div class="detail-item">
            <label>Note</label>
            <input pInputText [(ngModel)]="note" class="print-hide" />
            <span class="print-only">{{note || '---'}}</span>
          </div>
          <div class="detail-item">
            <label>Timbre Fiscal (TND)</label>
            <input pInputText [(ngModel)]="fiscalStampInput" 
              (input)="updateFiscalStamp()"
              placeholder="0,600" 
              class="print-hide" />
            <span class="print-only">{{fiscalStamp | number:'1.3-3':'fr'}} TND</span>
          </div>
        </div>
      </div>

      <div class="products-section">
        <p-table [value]="products" [responsive]="true">
          <ng-template pTemplate="header">
            <tr>
              <th>Référence</th>
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
              <td>{{product.reference}}</td>
              <td>{{product.description}}</td>
              <td>
                <p-inputNumber [(ngModel)]="product.quantity" mode="decimal" [min]="1" 
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
              <td>{{ product.totalHT | number:'1.3-3':'fr' }} TND</td>
              <td class="print-hide">
                <button pButton icon="pi pi-trash" class="p-button-danger p-button-text" (click)="removeProduct(rowIndex)"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
        <button pButton label="Ajouter un Produit" icon="pi pi-plus" class="print-hide" 
          (click)="showAddProductDialog()"></button>
      </div>

      <p-dialog header="Sélectionner un Produit" [(visible)]="displayProductDialog" [style]="{width: '800px'}" [modal]="true">
        <div class="product-dialog-content">
          <div class="product-search">
            <input pInputText placeholder="Rechercher un produit..." [(ngModel)]="productSearchTerm" (input)="filterProducts()" />
          </div>
          <p-table [value]="filteredProducts" [paginator]="true" [rows]="5" [responsive]="true" selectionMode="single" [(selection)]="selectedProduct">
            <ng-template pTemplate="header">
              <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Prix HT</th>
                <th>Unité</th>
                <th>Stock disponible</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr [pSelectableRow]="product">
                <td>{{product.reference}}</td>
                <td>{{product.description}}</td>
                <td>{{product.price | number:'1.3-3':'fr'}} TND</td>
                <td>{{product.unit}}</td>
                <td>{{product.currentStock}}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Annuler" icon="pi pi-times" (click)="displayProductDialog = false" class="p-button-text"></button>
          <button pButton label="Ajouter" icon="pi pi-check" (click)="addSelectedProduct()" 
            [disabled]="!selectedProduct" class="p-button-success"></button>
        </ng-template>
      </p-dialog>

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
              <tr class="total-row">
                <td colspan="2">Timbre Fiscal</td>
                <td>{{ fiscalStamp | number:'1.3-3':'fr' }} TND</td>
              </tr>
              <tr class="grand-total">
                <td colspan="2">Montant Total</td>
                <td>{{ (totalTTC + fiscalStamp) | number:'1.3-3':'fr' }} TND</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <p-divider></p-divider>

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

      <div class="signature-section">
        <div class="signature-box">
          <p>Signature Réceptionnaire</p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <p>Signature Client</p>
          <div class="signature-line"></div>
        </div>
      </div>

      <div class="action-buttons print-hide">
        <button pButton label="Enregistrer" icon="pi pi-save" class="p-button-success" (click)="saveReceipt()"></button>
        <button pButton label="Imprimer" icon="pi pi-print" class="p-button-primary" (click)="printReceipt()"></button>
        <button pButton label="Annuler" icon="pi pi-times" class="p-button-danger" (click)="cancelReceipt()"></button>
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

    .signature-section {
      display: flex;
      justify-content: space-around;
      margin: 3rem 0 2rem 0;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .signature-box {
      text-align: center;
      width: 300px;
    }

    .signature-box p {
      margin: 0;
      font-weight: 500;
      color: #2c3e50;
    }

    .signature-line {
      border-top: 1px solid #2c3e50;
      margin-top: 2rem;
      padding-top: 1.5rem;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
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
export class GoodsReceiptComponent {
  receiptNumber = 'BE-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000);
  receiptDate: Date = new Date();
  externalReference = '';
  note = '';
  fiscalStamp = 0.600;
  fiscalStampInput = '0,600';
  
  clients = [
    { id: 1, name: 'Client A', address: '10 Rue Client, Paris', postalCode: '75002', city: 'Paris', 
      phone: '01 23 45 67 89', email: 'client@client-a.com', taxId: '12345678' },
    { id: 2, name: 'Entreprise B', address: '20 Av. Commerciale, Lyon', postalCode: '69003', 
      city: 'Lyon', phone: '04 32 10 98 76', email: 'contact@entreprise-b.com', taxId: '87654321' }
  ];
  
  filteredClients: any[] = [];
  selectedClient: any = null;
  clientName = '---';
  clientAddress = '---';
  clientPhone = '---';
  clientEmail = '---';
  clientTaxId = '---';
  products: any[] = [];
  displayProductDialog = false;
  productSearchTerm = '';
  selectedProduct: any = null;
  filteredProducts: any[] = [];
  
  allProducts = [
    { id: 1, reference: 'REF-001', description: 'Produit A', price: 100, unit: 'PIECE', currentStock: 50 },
    { id: 2, reference: 'REF-002', description: 'Produit B', price: 200, unit: 'PIECE', currentStock: 100 },
    { id: 3, reference: 'REF-003', description: 'Produit C', price: 150, unit: 'PIECE', currentStock: 30 },
    { id: 4, reference: 'REF-004', description: 'Produit D', price: 250, unit: 'PIECE', currentStock: 20 }
  ];

  vatSummary: any[] = [];
  totalHT = 0;
  totalTVA = 0;
  totalTTC = 0;

  units = [
    { label: 'Pièce', value: 'PIECE' },
    { label: 'Kg', value: 'KG' },
    { label: 'Litre', value: 'LITRE' },
    { label: 'Mètre', value: 'METER' }
  ];

  vatRates = [
    { label: '0%', value: 0 },
    { label: '7%', value: 0.07 },
    { label: '13%', value: 0.13 },
    { label: '19%', value: 0.19 }
  ];

  companyName = 'Nom de la Société';
  companyAddress = 'Adresse de la Société';
  companyPhone = 'Téléphone';
  companyEmail = 'Email';
  companyTaxId = 'SIRET - RCS';
  bankName = 'Nom de la Banque';
  bankIBAN = 'IBAN';
  bankCode = 'Code Banque';
  bankBranchCode = 'Code Guichet';

  constructor() {
    this.filteredProducts = [...this.allProducts];
    this.filteredClients = [...this.clients];
  }

  updateFiscalStamp() {
    const numericValue = parseFloat(this.fiscalStampInput.replace(',', '.'));
    this.fiscalStamp = isNaN(numericValue) ? 0 : numericValue;
    this.calculateTotals();
  }

  filterClients(event: any) {
    const query = event.query.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
  }

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

  resetClientInfo() {
    this.clientName = '---';
    this.clientAddress = '---';
    this.clientPhone = '---';
    this.clientEmail = '---';
    this.clientTaxId = '---';
  }

  showAddProductDialog() {
    this.displayProductDialog = true;
    this.selectedProduct = null;
    this.productSearchTerm = '';
    this.filterProducts();
  }

  filterProducts() {
    if (this.productSearchTerm) {
      this.filteredProducts = this.allProducts.filter(product =>
        product.description.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
        product.reference.toLowerCase().includes(this.productSearchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.allProducts];
    }
  }

  addSelectedProduct() {
    if (!this.selectedProduct) return;
    
    this.products.push({
      id: this.selectedProduct.id,
      reference: this.selectedProduct.reference,
      description: this.selectedProduct.description,
      quantity: 1,
      unitPrice: this.selectedProduct.price,
      unit: this.selectedProduct.unit,
      vatRate: 0.19,
      totalHT: this.selectedProduct.price
    });
    
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

  calculateTotals() {
    this.totalHT = this.products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);

    const vatGroups: Record<number, { base: number, amount: number }> = {};
    this.products.forEach(product => {
      if (!vatGroups[product.vatRate]) {
        vatGroups[product.vatRate] = { base: 0, amount: 0 };
      }
      const rowTotal = product.quantity * product.unitPrice;
      vatGroups[product.vatRate].base += rowTotal;
      vatGroups[product.vatRate].amount += rowTotal * product.vatRate;
    });

    this.vatSummary = Object.keys(vatGroups).map(rate => ({
      rate: parseFloat(rate),
      base: vatGroups[parseFloat(rate)].base,
      amount: vatGroups[parseFloat(rate)].amount
    }));

    this.totalTVA = this.vatSummary.reduce((sum, vat) => sum + vat.amount, 0);
    this.totalTTC = this.totalHT + this.totalTVA;
  }

  getUnitLabel(value: string): string {
    const unit = this.units.find(u => u.value === value);
    return unit ? unit.label : '';
  }

  saveReceipt() {
    console.log('Bon d\'entrée enregistré:', {
      client: this.selectedClient,
      products: this.products,
      totals: {
        ht: this.totalHT,
        tva: this.totalTVA,
        ttc: this.totalTTC,
        fiscalStamp: this.fiscalStamp,
        total: this.totalTTC + this.fiscalStamp
      }
    });
  }

  printReceipt() {
    window.print();
  }

  cancelReceipt() {
    this.products = [];
    this.resetClientInfo();
    this.selectedClient = null;
    this.calculateTotals();
  }
}