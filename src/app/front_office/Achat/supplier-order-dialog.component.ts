// supplier-order-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { GoodsReceipt } from './Bon-de-entre/bon-dentree.component';

interface SupplierInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  orderDate: Date | null;
  deliveryDate: Date | null;
  paymentTerms: string;
}

@Component({
  selector: 'app-supplier-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    TagModule,
    MessageModule
  ],
  template: `
    <p-dialog 
      header="Commander Fournisseur" 
      [(visible)]="visible" 
      [modal]="true"
      [style]="{ width: '50vw', minWidth: '400px' }"
      [draggable]="false"
      [resizable]="false"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
      [contentStyle]="{ 'border-radius': '12px', 'padding': '0' }"
      [closeOnEscape]="true">
      
      <div class="dialog-content">
        <!-- Receipt Summary Card -->
        <div class="summary-card">
          <div class="summary-header">
            <div class="summary-icon-container">
              <i class="pi pi-shopping-cart summary-icon"></i>
            </div>
            <div class="summary-title">
              <h4>Bon d'Entrée {{ receipt?.receiptNumber }}</h4>
              <p class="supplier-name">{{ supplierInfo.name || 'Nouveau fournisseur' }}</p>
            </div>
          </div>
          
          <div class="summary-details">
            <div class="detail-row">
              <span class="detail-label">Date Réception</span>
              <span class="detail-value">{{ receipt?.receiptDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Montant Total</span>
              <span class="detail-value">{{ receipt?.amount | currency:'TND':'symbol':'1.3-3' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Statut</span>
              <span class="detail-value">
                <p-tag severity="info" value="En commande" styleClass="status-tag"></p-tag>
              </span>
            </div>
          </div>
        </div>

        <!-- Supplier Form Section -->
        <div class="form-section">
          <h5 class="form-title">
            <i class="pi pi-user-edit form-title-icon"></i>
            Informations Fournisseur
          </h5>
          
          <div class="p-fluid grid form-grid">
            <div class="field col-12">
              <label for="supplierName">
                <i class="pi pi-building field-icon"></i>
                Nom Fournisseur *
              </label>
              <div class="input-container">
                <i class="pi pi-id-card input-icon"></i>
                <input id="supplierName" type="text" pInputText 
                      [(ngModel)]="supplierInfo.name" 
                      placeholder="Entrez le nom du fournisseur"
                      required
                      [class.input-error]="submitted && !supplierInfo.name" />
              </div>
              <small *ngIf="submitted && !supplierInfo.name" class="error-message">
                Le nom du fournisseur est requis
              </small>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="supplierAddress">
                <i class="pi pi-map-marker field-icon"></i>
                Adresse
              </label>
              <div class="input-container">
                <i class="pi pi-home input-icon"></i>
                <input id="supplierAddress" type="text" pInputText 
                      [(ngModel)]="supplierInfo.address" 
                      placeholder="Entrez l'adresse du fournisseur" />
              </div>
            </div>

            <div class="field col-12 md:col-6">
              <label for="supplierPhone">
                <i class="pi pi-phone field-icon"></i>
                Téléphone *
              </label>
              <div class="input-container">
                <i class="pi pi-mobile input-icon"></i>
                <input id="supplierPhone" type="text" pInputText 
                      [(ngModel)]="supplierInfo.phone" 
                      placeholder="Entrez le numéro de téléphone"
                      required
                      [class.input-error]="submitted && !supplierInfo.phone" />
              </div>
              <small *ngIf="submitted && !supplierInfo.phone" class="error-message">
                Le téléphone est requis
              </small>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="supplierEmail">
                <i class="pi pi-envelope field-icon"></i>
                Email
              </label>
              <div class="input-container">
                <i class="pi pi-at input-icon"></i>
                <input id="supplierEmail" type="email" pInputText 
                      [(ngModel)]="supplierInfo.email" 
                      placeholder="Entrez l'email du fournisseur" />
              </div>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="supplierTaxId">
                <i class="pi pi-barcode field-icon"></i>
                Identifiant Fiscal
              </label>
              <div class="input-container">
                <i class="pi pi-key input-icon"></i>
                <input id="supplierTaxId" type="text" pInputText 
                      [(ngModel)]="supplierInfo.taxId" 
                      placeholder="Entrez l'identifiant fiscal" />
              </div>
            </div>

            <div class="field col-12 md:col-6">
              <label for="orderDate">
                <i class="pi pi-calendar field-icon"></i>
                Date de Commande *
              </label>
              <div class="input-container">
                <p-calendar 
                  id="orderDate" 
                  [(ngModel)]="supplierInfo.orderDate" 
                  [showIcon]="true" 
                  dateFormat="dd/mm/yy"
                  placeholder="Sélectionnez la date"
                  [required]="true"
                  inputId="orderDate"
                  [class.input-error]="submitted && !supplierInfo.orderDate"
                  styleClass="calendar-input">
                </p-calendar>
              </div>
              <small *ngIf="submitted && !supplierInfo.orderDate" class="error-message">
                La date de commande est requise
              </small>
            </div>

            <div class="field col-12 md:col-6">
              <label for="deliveryDate">
                <i class="pi pi-clock field-icon"></i>
                Date Livraison Estimée *
              </label>
              <div class="input-container">
                <p-calendar 
                  id="deliveryDate" 
                  [(ngModel)]="supplierInfo.deliveryDate" 
                  [showIcon]="true" 
                  dateFormat="dd/mm/yy"
                  placeholder="Sélectionnez la date"
                  [required]="true"
                  inputId="deliveryDate"
                  [minDate]="supplierInfo.orderDate || undefined"
                  [class.input-error]="submitted && !supplierInfo.deliveryDate"
                  styleClass="calendar-input">
                </p-calendar>
              </div>
              <small *ngIf="submitted && !supplierInfo.deliveryDate" class="error-message">
                La date de livraison est requise
              </small>
              <small *ngIf="supplierInfo.orderDate && supplierInfo.deliveryDate && supplierInfo.deliveryDate < supplierInfo.orderDate" 
                    class="error-message">
                La date de livraison doit être après la date de commande
              </small>
            </div>

            <div class="field col-12">
              <label for="paymentTerms">
                <i class="pi pi-money-bill field-icon"></i>
                Conditions de Paiement *
              </label>
              <div class="input-container">
                <i class="pi pi-credit-card input-icon"></i>
                <input id="paymentTerms" type="text" pInputText 
                      [(ngModel)]="supplierInfo.paymentTerms" 
                      placeholder="Ex: 30 jours fin de mois"
                      required
                      [class.input-error]="submitted && !supplierInfo.paymentTerms" />
              </div>
              <small *ngIf="submitted && !supplierInfo.paymentTerms" class="error-message">
                Les conditions de paiement sont requises
              </small>
            </div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button 
            pButton 
            label="Annuler" 
            icon="pi pi-times" 
            (click)="onCancel()" 
            class="cancel-button"
            pTooltip="Fermer sans enregistrer"
            tooltipPosition="top">
          </button>
          <button 
            pButton 
            label="Confirmer Commande" 
            icon="pi pi-check" 
            (click)="onConfirm()" 
            class="generate-button"
            [disabled]="submitted && !isFormValid()"
            pTooltip="Confirmer la commande"
            tooltipPosition="top">
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    /* Premium Dialog Styles */
    :host {
      --primary-color: #4361ee;
      --primary-hover: #3a0ca3;
      --secondary-color: #6c757d;
      --secondary-hover: #5a6268;
      --error-color: #ef4444;
      --border-color: #e5e7eb;
      --hover-border-color: #93c5fd;
      --focus-border-color: #3b82f6;
      --focus-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2);
      --error-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2);
      --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Dialog Content */
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding: 2rem;
    }

    /* Summary Card */
    .summary-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-left: 4px solid var(--primary-color);
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .summary-icon-container {
      background: rgba(67, 97, 238, 0.1);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-icon {
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .summary-title h4 {
      margin: 0;
      color: #1E293B;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .supplier-name {
      margin: 0.25rem 0 0 0;
      color: #64748B;
      font-size: 0.875rem;
    }

    .summary-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
    }

    .detail-label {
      font-size: 0.8125rem;
      color: #64748B;
      font-weight: 500;
      margin-bottom: 0.25rem;
      letter-spacing: 0.02em;
    }

    .detail-value {
      font-size: 0.9375rem;
      color: #1E293B;
      font-weight: 500;
    }

    .status-tag {
      font-weight: 500;
      padding: 0.25rem 0.75rem;
    }

    /* Form Section */
    .form-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .form-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #1E293B;
      margin: 0 0 1.5rem 0;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .form-title-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .form-grid {
      margin-top: 1rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .field-icon {
      color: var(--primary-color);
      font-size: 1rem;
    }

    .input-container {
      position: relative;
      width: 100%;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
      z-index: 1;
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .calendar-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      font-size: 0.875rem;
      color: #1E293B;
      background-color: #fff;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: var(--transition);
    }

    :host ::ng-deep .p-inputtext:hover,
    :host ::ng-deep .calendar-input:hover {
      border-color: var(--hover-border-color);
    }

    :host ::ng-deep .p-inputtext:focus,
    :host ::ng-deep .calendar-input:focus {
      border-color: var(--focus-border-color);
      box-shadow: var(--focus-shadow);
      outline: 0;
    }

    .input-error {
      border-color: var(--error-color) !important;
    }

    :host ::ng-deep .input-error:focus {
      box-shadow: var(--error-shadow) !important;
    }

    .error-message {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--error-color);
    }

    /* Dialog Footer */
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.25rem 2rem;
      border-top: 1px solid var(--border-color);
      background: #f8fafc;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .cancel-button {
      background-color: white !important;
      color: var(--secondary-color) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: var(--transition);
    }

    .cancel-button:hover {
      background-color: #f3f4f6 !important;
      color: var(--secondary-hover) !important;
      border-color: var(--secondary-hover) !important;
    }

    .generate-button {
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: var(--transition);
    }

    .generate-button:hover {
      background-color: var(--primary-hover) !important;
      border-color: var(--primary-hover) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2);
    }

    .generate-button:disabled {
      background-color: #e2e8f0 !important;
      border-color: #e2e8f0 !important;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Responsive Adjustments */
    @media (max-width: 960px) {
      .dialog-content {
        padding: 1.5rem;
      }

      .summary-details {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px) {
      .dialog-content {
        padding: 1.25rem;
      }

      .summary-details {
        grid-template-columns: 1fr;
      }

      .dialog-footer {
        padding: 1rem;
      }
    }

    @media (max-width: 640px) {
      .dialog-footer {
        flex-direction: column;
        gap: 0.75rem;
      }

      .cancel-button, .generate-button {
        width: 100%;
      }
    }
  `]
})
export class SupplierOrderDialogComponent {
  @Input() visible: boolean = false;
  @Input() receipt: GoodsReceipt | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<any>();

  submitted = false;
  supplierInfo: SupplierInfo = {
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    orderDate: null,
    deliveryDate: null,
    paymentTerms: ''
  };

  isFormValid(): boolean {
    return !!this.supplierInfo.name &&
           !!this.supplierInfo.phone &&
           !!this.supplierInfo.orderDate &&
           !!this.supplierInfo.deliveryDate &&
           !!this.supplierInfo.paymentTerms &&
           (!this.supplierInfo.orderDate || !this.supplierInfo.deliveryDate || 
            this.supplierInfo.deliveryDate >= this.supplierInfo.orderDate);
  }

  onConfirm() {
    this.submitted = true;
    
    if (!this.isFormValid()) {
      return;
    }

    this.confirm.emit({
      receipt: this.receipt,
      supplierInfo: this.supplierInfo
    });
    this.onCancel();
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  resetForm() {
    this.submitted = false;
    this.supplierInfo = {
      name: this.receipt?.supplierName || '',
      address: '',
      phone: '',
      email: '',
      taxId: '',
      orderDate: null,
      deliveryDate: null,
      paymentTerms: ''
    };
  }
}