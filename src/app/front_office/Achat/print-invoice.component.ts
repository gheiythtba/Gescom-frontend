import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-print',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, DatePipe],
  template: `
    <p-dialog 
      header="Facture" 
      [(visible)]="visible" 
      [modal]="true"
      [style]="{ width: '80vw', maxWidth: '800px' }"
      [draggable]="false"
      [resizable]="false"
      [contentStyle]="{ 'border-radius': '0', 'padding': '0', 'overflow': 'hidden' }"
      [closeOnEscape]="false">
      
      <!-- Printable content container -->
      <div class="printable-content" id="invoiceContent">
        <div class="invoice">
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <div class="company-logo">
                <img src="assets/images/company-logo.png" alt="Company Logo" *ngIf="hasLogo; else textLogo">
                <ng-template #textLogo>
                  <h1>{{companyName}}</h1>
                </ng-template>
              </div>
              <div class="company-details">
                <p>{{companyAddress}}</p>
                <p>{{companyPostalCode}} {{companyCity}}</p>
                <p>Tél: {{companyPhone}} | Email: {{companyEmail}}</p>
                <p>{{companyTaxId}}</p>
              </div>
            </div>
            
            <div class="document-info">
              <h2>FACTURE</h2>
              <div class="document-meta">
                <p><strong>N°:</strong> {{invoiceNumber}}</p>
                <p><strong>Date:</strong> {{invoiceDate | date:'dd/MM/yyyy'}}</p>
              </div>
            </div>
          </div>

          <!-- Client Information -->
          <div class="client-section">
            <div class="client-info">
              <h3>Client:</h3>
              <p><strong>Nom:</strong> {{clientName}}</p>
              <p><strong>Adresse:</strong> {{clientAddress}}</p>
              <p><strong>Ville:</strong> {{clientPostalCode}} {{clientCity}}</p>
              <p><strong>Identifiant Fiscal:</strong> {{clientTaxId}}</p>
            </div>
          </div>

          <!-- Products Table -->
          <div class="products-section">
            <table class="products-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Désignation</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire HT</th>
                  <th>TVA</th>
                  <th>Total HT</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of items">
                  <td>{{item.reference}}</td>
                  <td>{{item.productName}}</td>
                  <td>{{item.quantity}}</td>
                  <td>{{item.unitPrice | number:'1.3-3':'fr'}} TND</td>
                  <td>{{vatRate * 100}}%</td>
                  <td>{{item.total | number:'1.3-3':'fr'}} TND</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals Section -->
          <div class="totals-section">
            <table class="totals-table">
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

          <!-- Payment Information -->
          <div class="payment-info">
            <p><strong>Date d'échéance:</strong> {{dueDate | date:'dd/MM/yyyy'}}</p>
            <p><strong>Mode de paiement:</strong> {{paymentMethod}}</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="signatures">
              <div class="signature-box">
                <p>Responsable Société</p>
                <div class="signature-line"></div>
                <p>Nom & Cachet</p>
              </div>
              <div class="signature-box">
                <p>Client</p>
                <div class="signature-line"></div>
                <p>Nom & Signature</p>
              </div>
            </div>
            
            <div class="footer-notes">
              <p>{{paymentTerms}}</p>
            </div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button 
            pButton 
            label="Fermer" 
            icon="pi pi-times" 
            (click)="onClose()" 
            class="cancel-button"
            pTooltip="Fermer la facture"
            tooltipPosition="top">
          </button>
          <button 
            pButton 
            label="Imprimer" 
            icon="pi pi-print" 
            (click)="printInvoice()" 
            class="print-button"
            pTooltip="Imprimer la facture"
            tooltipPosition="top">
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    /* Premium Invoice Styles */
    :host {
      --primary-color: #4361ee;
      --primary-light: rgba(67, 97, 238, 0.1);
      --secondary-color: #6c757d;
      --border-color: #e5e7eb;
      --text-color: #1e293b;
      --text-light: #64748b;
    }

    .invoice {
      font-family: 'Segoe UI', 'Arial', sans-serif;
      color: var(--text-color);
      background: white;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 1.25rem;
    }

    .company-info {
      display: flex;
      gap: 1.25rem;
      width: 60%;
    }

    .company-logo {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .company-logo img {
      max-width: 100%;
      max-height: 100%;
    }

    .company-logo h1 {
      font-size: 1rem;
      text-align: center;
      margin: 0;
      color: var(--primary-color);
    }

    .company-details {
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--text-light);
    }

    .document-info {
      text-align: right;
      width: 40%;
    }

    .document-info h2 {
      color: var(--primary-color);
      margin: 0 0 0.75rem 0;
      font-size: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .document-meta {
      font-size: 0.8125rem;
    }

    .document-meta p {
      margin: 0.25rem 0;
    }

    .client-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .client-info h3 {
      color: var(--primary-color);
      font-size: 1.125rem;
      margin: 0 0 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    .client-info p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }

    .products-section {
      margin-bottom: 1.5rem;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }

    .products-table th {
      background-color: var(--primary-light);
      color: var(--primary-color);
      text-align: left;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
    }

    .products-table td {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1.5rem;
    }

    .totals-table {
      width: 350px;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }

    .totals-table th, .totals-table td {
      padding: 0.75rem;
      text-align: left;
      border: 1px solid var(--border-color);
    }

    .totals-table th {
      background-color: var(--primary-light);
      color: var(--primary-color);
    }

    .total-row {
      font-weight: 500;
      background-color: var(--primary-light);
    }

    .grand-total {
      font-weight: 600;
      background-color: var(--primary-color);
      color: white;
    }

    .payment-info {
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .payment-info p {
      margin: 0.5rem 0;
    }

    .footer {
      margin-top: 2rem;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 2.5rem;
    }

    .signature-box {
      width: 45%;
      text-align: center;
      font-size: 0.8125rem;
    }

    .signature-line {
      border-top: 1px solid var(--text-color);
      margin: 1rem 0 0.5rem 0;
      height: 3rem;
    }

    .footer-notes {
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--text-light);
      padding: 0.75rem;
      background-color: var(--primary-light);
      border-radius: 6px;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid var(--border-color);
    }

    .cancel-button {
      background-color: white !important;
      color: var(--secondary-color) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: all 0.2s ease;
    }

    .cancel-button:hover {
      background-color: #f3f4f6 !important;
    }

    .print-button {
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: all 0.2s ease;
    }

    .print-button:hover {
      background-color: #3a0ca3 !important;
      border-color: #3a0ca3 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2);
    }

    /* Print-specific styles */
    @media print {
      body * {
        visibility: hidden;
      }
      
      .printable-content, .printable-content * {
        visibility: visible;
      }
      
      .printable-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      
      .invoice {
        padding: 1.5rem;
        font-size: 12px;
        border: none;
        box-shadow: none;
      }

      .header {
        page-break-after: avoid;
      }

      .products-section, .totals-section {
        page-break-inside: avoid;
      }

      .footer {
        page-break-before: avoid;
      }

      .dialog-footer {
        display: none !important;
      }

      /* Ensure colors print correctly */
      .products-table th,
      .totals-table th,
      .total-row {
        background-color: var(--primary-light) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .grand-total {
        background-color: var(--primary-color) !important;
        color: white !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    @media screen and (max-width: 768px) {
      .header {
        flex-direction: column;
      }

      .company-info, .document-info {
        width: 100%;
      }

      .document-info {
        text-align: left;
        margin-top: 1.25rem;
      }

      .totals-section {
        justify-content: flex-start;
      }

      .totals-table {
        width: 100%;
      }

      .signatures {
        flex-direction: column;
        gap: 1.5rem;
      }

      .signature-box {
        width: 100%;
      }
    }
  `]
})
export class InvoicePrintComponent {
  @Input() visible: boolean = false;
  @Input() data: any;
    @Output() visibleChange = new EventEmitter<boolean>();

  // Company Information
  companyName = 'Votre Société';
  companyAddress = '123 Rue des Entreprises';
  companyPostalCode = '1000';
  companyCity = 'Tunis';
  companyPhone = '70 123 456';
  companyEmail = 'contact@votresociete.com';
  companyTaxId = '12345678/A/M/000';
  hasLogo = false;

  // Invoice Information
  get invoiceNumber(): string {
    return this.data?.invoiceNumber || 'FAC-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000);
  }

  get invoiceDate(): Date {
    return this.data?.invoiceDate || new Date();
  }

  get fiscalStamp(): number {
    return this.data?.fiscalStamp || 0.600;
  }

  get vatRate(): number {
    return this.data?.vatRate || 0.19;
  }

  // Client Information
  get clientName(): string {
    return this.data?.clientName || '';
  }

  get clientAddress(): string {
    return this.data?.clientAddress || '';
  }

  get clientPostalCode(): string {
    return this.data?.clientPostalCode || '';
  }

  get clientCity(): string {
    return this.data?.clientCity || '';
  }

  get clientTaxId(): string {
    return this.data?.clientTaxId || '';
  }

  // Items
  get items(): any[] {
    return this.data?.items || [];
  }

  // Payment Information
  get dueDate(): Date {
    if (this.data?.dueDate) {
      return new Date(this.data.dueDate);
    }
    const date = new Date(this.invoiceDate);
    date.setDate(date.getDate() + 30); // 30 days payment terms
    return date;
  }

  get paymentMethod(): string {
    return this.data?.paymentMethod || 'Virement Bancaire';
  }

  get paymentTerms(): string {
    return this.data?.paymentTerms || 'Paiement à 30 jours fin de mois';
  }

  // Calculated totals
  get totalHT(): number {
    if (this.data?.totalHT) return this.data.totalHT;
    return this.items.reduce((sum, item) => sum + (item.total || 0), 0);
  }

  get totalTVA(): number {
    if (this.data?.totalTVA) return this.data.totalTVA;
    return this.totalHT * this.vatRate;
  }

  get totalTTC(): number {
    if (this.data?.totalTTC) return this.data.totalTTC;
    return this.totalHT + this.totalTVA + this.fiscalStamp;
  }

  printInvoice() {
    const printContent = document.getElementById('invoiceContent')?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent || '';
    window.print();
    document.body.innerHTML = originalContent;
    
    // Restore the Angular application
    window.location.reload();
  }

 onClose() {
  this.visible = false;
  this.visibleChange.emit(this.visible); // Emit boolean value
}
}