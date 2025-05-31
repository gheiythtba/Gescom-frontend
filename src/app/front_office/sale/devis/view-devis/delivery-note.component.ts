import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Invoice } from '../devis.component';

interface DeliveryInfo {
  driverName: string;
  truckNumber: string;
  exitDate: Date | null;
  arrivalDate: Date | null;
  destination: string;
}

@Component({
  selector: 'app-delivery-note',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  template: `
    <p-dialog 
      header="Bon de Sortie" 
      [(visible)]="visible" 
      [modal]="true"
      [style]="{ width: '80vw', maxWidth: '800px' }"
      [draggable]="false"
      [resizable]="false"
      [contentStyle]="{ 'border-radius': '0', 'padding': '0', 'overflow': 'hidden' }"
      [closeOnEscape]="false">
      
      <!-- Printable content container -->
      <div class="printable-content" id="deliveryNoteContent">
        <div class="delivery-note">
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
                <p>Tél: {{companyPhone}}</p>
                <p>R.C: {{companyRC}}</p>
                <p>Mat. Fisc: {{companyMatFisc}}</p>
              </div>
            </div>
            
            <div class="document-info">
              <h2>BON DE LIVRAISON</h2>
              <div class="document-meta">
                <p><strong>N°:</strong> BL-{{data?.invoiceNumber}}</p>
                <p><strong>Date:</strong> {{today | date:'dd/MM/yyyy'}}</p>
              </div>
            </div>
          </div>

          <!-- Client & Delivery Info -->
          <div class="info-section">
            <div class="client-info">
              <h3>Client:</h3>
              <p><strong>Nom:</strong> {{data?.clientName}}</p>
              <p><strong>Code:</strong> {{data?.clientCode}}</p>
              <p><strong>Adresse:</strong> {{data?.clientAddress || 'Non spécifiée'}}</p>
            </div>
            
            <div class="delivery-details">
              <h3>Détails Livraison:</h3>
              <p><strong>Conducteur:</strong> {{data?.driverName}}</p>
              <p><strong>Camion:</strong> {{data?.truckNumber}}</p>
              <p><strong>Date Sortie:</strong> {{data?.exitDate | date:'dd/MM/yyyy'}}</p>
              <p><strong>Date Arrivée:</strong> {{data?.arrivalDate | date:'dd/MM/yyyy'}}</p>
              <p><strong>Destination:</strong> {{data?.destination}}</p>
            </div>
          </div>

          <!-- Invoice Summary -->
          <div class="invoice-summary">
            <h3>Facture N°: {{data?.invoiceNumber}}</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span>Date Facture:</span>
                <strong>{{data?.invoiceDate | date:'dd/MM/yyyy'}}</strong>
              </div>
              <div class="summary-item">
                <span>Total HT:</span>
                <strong>{{data?.totalHT | currency:'TND':'symbol':'1.3-3'}}</strong>
              </div>
              <div class="summary-item">
                <span>TVA:</span>
                <strong>{{data?.totalTVA | currency:'TND':'symbol':'1.3-3'}}</strong>
              </div>
              <div class="summary-item">
                <span>Timbre:</span>
                <strong>{{data?.timbre | currency:'TND':'symbol':'1.3-3'}}</strong>
              </div>
              <div class="summary-item total">
                <span>Total TTC:</span>
                <strong>{{data?.totalTTC | currency:'TND':'symbol':'1.3-3'}}</strong>
              </div>
            </div>
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
                <p>Responsable Transport</p>
                <div class="signature-line"></div>
                <p>Nom & Signature</p>
              </div>
              <div class="signature-box">
                <p>Client</p>
                <div class="signature-line"></div>
                <p>Nom & Signature</p>
              </div>
            </div>
            
            <div class="footer-notes">
              <p><strong>Notes:</strong> Merci de vérifier la conformité des marchandises avant signature.</p>
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
            pTooltip="Fermer le bon de livraison"
            tooltipPosition="top">
          </button>
          <button 
            pButton 
            label="Imprimer" 
            icon="pi pi-print" 
            (click)="printDeliveryNote()" 
            class="print-button"
            pTooltip="Imprimer le bon de livraison"
            tooltipPosition="top">
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    /* Premium Delivery Note Styles */
    :host {
      --primary-color: #4361ee;
      --primary-light: rgba(67, 97, 238, 0.1);
      --secondary-color: #6c757d;
      --border-color: #e5e7eb;
      --text-color: #1e293b;
      --text-light: #64748b;
    }

    .delivery-note {
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

    .info-section {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .client-info, .delivery-details {
      flex: 1;
    }

    .info-section h3 {
      color: var(--primary-color);
      font-size: 1.125rem;
      margin: 0 0 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    .info-section p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }

    .invoice-summary {
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .invoice-summary h3 {
      color: var(--primary-color);
      font-size: 1.125rem;
      margin: 0 0 1rem 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      padding: 0.5rem 0;
      border-bottom: 1px dashed var(--border-color);
    }

    .summary-item.total {
      font-weight: 600;
      color: var(--primary-color);
      border-bottom: none;
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
      width: 30%;
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
      
      .delivery-note {
        padding: 1.5rem;
        font-size: 12px;
        border: none;
        box-shadow: none;
      }

      .header {
        page-break-after: avoid;
      }

      .info-section, .invoice-summary {
        page-break-inside: avoid;
      }

      .footer {
        page-break-before: avoid;
      }

      .dialog-footer {
        display: none !important;
      }
    }

    @media screen and (max-width: 768px) {
      .header, .info-section {
        flex-direction: column;
      }

      .company-info, .document-info, .client-info, .delivery-details {
        width: 100%;
      }

      .document-info {
        text-align: left;
        margin-top: 1.25rem;
      }

      .summary-grid {
        grid-template-columns: 1fr;
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
export class DeliveryNoteComponent {
  @Input() visible: boolean = false;
  @Input() data: any;

  // Company information (should be configured in your environment)
  companyName = 'VOTRE SOCIÉTÉ';
  companyAddress = '123 Rue Principale, Tunis, Tunisie';
  companyPhone = '+216 70 123 456';
  companyRC = 'A12345678';
  companyMatFisc = '1234567A/B/C/D';
  hasLogo = false;

  today = new Date();

  printDeliveryNote() {
    const printContent = document.getElementById('deliveryNoteContent')?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent || '';
    window.print();
    document.body.innerHTML = originalContent;
    
    // Restore the Angular application
    window.location.reload();
  }

  onClose() {
    this.visible = false;
  }
}