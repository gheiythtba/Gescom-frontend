import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { Invoice } from '../devis.component';

interface DeliveryInfo {
  driverName: string;
  truckNumber: string;
  exitDate: Date | null;
  arrivalDate: Date | null;
  destination: string;
}

@Component({
  selector: 'app-delivery-dialog',
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
      header="Créer un Bon de Sortie" 
      [(visible)]="visible" 
      [modal]="true"
      [style]="{ width: '50vw', minWidth: '400px' }"
      [draggable]="false"
      [resizable]="false"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
      [contentStyle]="{ 'border-radius': '12px', 'padding': '0' }"
      [closeOnEscape]="true">
      
      <div class="dialog-content">
        <!-- Invoice Summary Card -->
        <div class="summary-card">
          <div class="summary-header">
            <div class="summary-icon-container">
              <i class="pi pi-file-invoice summary-icon"></i>
            </div>
            <div class="summary-title">
              <h4>Facture {{ invoice?.invoiceNumber }}</h4>
              <p class="client-name">{{ invoice?.clientName }}</p>
            </div>
          </div>
          
          <div class="summary-details">
            <div class="detail-row">
              <span class="detail-label">Date Facture</span>
              <span class="detail-value">{{ invoice?.invoiceDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total TTC</span>
              <span class="detail-value">{{ invoice?.totalTTC | currency:'TND':'symbol':'1.3-3' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Statut</span>
              <span class="detail-value">
                <p-tag [severity]="getStatusSeverity(invoice?.status)" 
                      [value]="getStatusLabel(invoice?.status)"
                      styleClass="status-tag">
                </p-tag>
              </span>
            </div>
          </div>
        </div>

        <!-- Delivery Form Section -->
        <div class="form-section">
          <h5 class="form-title">
            <i class="pi pi-truck form-title-icon"></i>
            Informations de Livraison
          </h5>
          
          <div class="p-fluid grid form-grid">
            <div class="field col-12 md:col-6">
              <label for="driverName">
                <i class="pi pi-user field-icon"></i>
                Nom du Conducteur *
              </label>
              <div class="input-container">
                <i class="pi pi-id-card input-icon"></i>
                <input id="driverName" type="text" pInputText 
                      [(ngModel)]="deliveryInfo.driverName" 
                      placeholder="Entrez le nom du conducteur"
                      required
                      [class.input-error]="submitted && !deliveryInfo.driverName" />
              </div>
              <small *ngIf="submitted && !deliveryInfo.driverName" class="error-message">
                Le nom du conducteur est requis
              </small>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="truckNumber">
                <i class="pi pi-car field-icon"></i>
                Numéro de Camion *
              </label>
              <div class="input-container">
                <i class="pi pi-barcode input-icon"></i>
                <input id="truckNumber" type="text" pInputText 
                      [(ngModel)]="deliveryInfo.truckNumber" 
                      placeholder="Entrez le numéro de camion"
                      required
                      [class.input-error]="submitted && !deliveryInfo.truckNumber" />
              </div>
              <small *ngIf="submitted && !deliveryInfo.truckNumber" class="error-message">
                Le numéro de camion est requis
              </small>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="exitDate">
                <i class="pi pi-calendar field-icon"></i>
                Date de Sortie *
              </label>
              <div class="input-container">
                <p-calendar 
                  id="exitDate" 
                  [(ngModel)]="deliveryInfo.exitDate" 
                  [showIcon]="true" 
                  dateFormat="dd/mm/yy"
                  placeholder="Sélectionnez la date"
                  [required]="true"
                  inputId="exitDate"
                  [class.input-error]="submitted && !deliveryInfo.exitDate"
                  styleClass="calendar-input">
                </p-calendar>
              </div>
              <small *ngIf="submitted && !deliveryInfo.exitDate" class="error-message">
                La date de sortie est requise
              </small>
            </div>
            
            <div class="field col-12 md:col-6">
              <label for="arrivalDate">
                <i class="pi pi-clock field-icon"></i>
                Date d'Arrivée Estimée *
              </label>
              <div class="input-container">
                <p-calendar 
                  id="arrivalDate" 
                  [(ngModel)]="deliveryInfo.arrivalDate" 
                  [showIcon]="true" 
                  dateFormat="dd/mm/yy"
                  placeholder="Sélectionnez la date"
                  [required]="true"
                  inputId="arrivalDate"
                  [minDate]="deliveryInfo.exitDate || undefined"
                  [class.input-error]="submitted && !deliveryInfo.arrivalDate"
                  styleClass="calendar-input">
                </p-calendar>
              </div>
              <small *ngIf="submitted && !deliveryInfo.arrivalDate" class="error-message">
                La date d'arrivée est requise
              </small>
              <small *ngIf="deliveryInfo.exitDate && deliveryInfo.arrivalDate && deliveryInfo.arrivalDate < deliveryInfo.exitDate" 
                    class="error-message">
                La date d'arrivée doit être après la date de sortie
              </small>
            </div>
            
            <div class="field col-12">
              <label for="destination">
                <i class="pi pi-map-marker field-icon"></i>
                Destination *
              </label>
              <div class="input-container">
                <i class="pi pi-compass input-icon"></i>
                <input id="destination" type="text" pInputText 
                      [(ngModel)]="deliveryInfo.destination" 
                      placeholder="Entrez la destination"
                      required
                      [class.input-error]="submitted && !deliveryInfo.destination" />
              </div>
              <small *ngIf="submitted && !deliveryInfo.destination" class="error-message">
                La destination est requise
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
            label="Générer Bon de Sortie" 
            icon="pi pi-print" 
            (click)="onGenerate()" 
            class="generate-button"
            [disabled]="!isFormValid() && submitted"
            pTooltip="Générer le bon de sortie"
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

    .client-name {
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
export class DeliveryDialogComponent {
  @Input() visible: boolean = false;
  @Input() invoice: Invoice | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() generate = new EventEmitter<any>();

  submitted = false;
  deliveryInfo: DeliveryInfo = {
    driverName: '',
    truckNumber: '',
    exitDate: null,
    arrivalDate: null,
    destination: ''
  };

  getStatusLabel(status?: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'paid': 'Payé',
      'unpaid': 'Non Payé',
      'cancelled': 'Annulé',
      'exonerated': 'Exonéré'
    };
    return statusMap[status || 'draft'] || status || '';
  }

  getStatusSeverity(status?: string): string {
    const severityMap: Record<string, string> = {
      'draft': 'info',
      'paid': 'success',
      'unpaid': 'danger',
      'cancelled': 'warning',
      'exonerated': 'info'
    };
    return severityMap[status || 'draft'] || 'info';
  }

  isFormValid(): boolean {
    return !!this.deliveryInfo.driverName &&
           !!this.deliveryInfo.truckNumber &&
           !!this.deliveryInfo.exitDate &&
           !!this.deliveryInfo.arrivalDate &&
           !!this.deliveryInfo.destination &&
           (!this.deliveryInfo.exitDate || !this.deliveryInfo.arrivalDate || 
            this.deliveryInfo.arrivalDate >= this.deliveryInfo.exitDate);
  }

  onGenerate() {
    this.submitted = true;
    
    if (!this.isFormValid()) {
      return;
    }

    this.generate.emit({
      ...this.invoice,
      ...this.deliveryInfo
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
    this.deliveryInfo = {
      driverName: '',
      truckNumber: '',
      exitDate: null,
      arrivalDate: null,
      destination: ''
    };
  }
}