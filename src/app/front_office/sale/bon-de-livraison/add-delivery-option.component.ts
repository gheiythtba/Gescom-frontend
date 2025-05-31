import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delivery-options-dialog',
  template: `
    <div class="delivery-options-dialog">
      <div class="dialog-header">
        <i class="pi pi-truck dialog-icon"></i>
        <h3 class="dialog-title">Type de livraison</h3>
        <p class="dialog-subtitle">Sélectionnez le type de livraison à créer</p>
      </div>

      <div class="options-container">
        <button pButton 
                class="option-button with-invoice"
                (click)="selectWithInvoice()">
          <div class="button-content">
            <i class="pi pi-globe"></i>
            <div class="button-text">
              <span class="button-label">Facture/Devise en devise étrangère</span>
              <span class="button-description">Créer une livraison avec facture en devise différente du pays</span>
            </div>
          </div>
        </button>
              
        <button pButton 
                class="option-button without-invoice"
                (click)="selectWithoutInvoice()">
          <div class="button-content">
            <i class="pi pi-home"></i>
            <div class="button-text">
              <span class="button-label">Facture en devise locale</span>
              <span class="button-description">Créer une livraison avec facture dans la devise du pays</span>
            </div>
          </div>
        </button>

        <button pButton 
                class="option-button cancel-option"
                (click)="cancel()">
          <div class="button-content">
            <i class="pi pi-times"></i>
            <div class="button-text">
              <span class="button-label">Annuler</span>
              <span class="button-description">Retour à la liste des livraisons</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .delivery-options-dialog {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      width: 100%;
      max-width: 500px;
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .dialog-icon {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .dialog-title {
      margin: 0;
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .dialog-subtitle {
      margin: 0.25rem 0 0 0;
      color: var(--text-secondary-color);
      font-size: 0.875rem;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .option-button {
      display: flex;
      justify-content: flex-start;
      padding: 1rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      width: 100%;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .button-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;

        i {
          font-size: 1.5rem;
        }
      }

      .button-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }

      .button-label {
        font-weight: 600;
        font-size: 1rem;
      }

      .button-description {
        font-size: 0.75rem;
        color: var(--text-secondary-color);
        margin-top: 0.25rem;
      }
    }

    .with-invoice {
      background-color: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: var(--primary-color);

      i {
        color: var(--primary-color);
      }

      &:hover {
        background-color: rgba(59, 130, 246, 0.2);
      }
    }

    .without-invoice {
      background-color: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--green-600);

      i {
        color: var(--green-600);
      }

      &:hover {
        background-color: rgba(16, 185, 129, 0.2);
      }
    }

    .cancel-option {
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--red-600);

      i {
        color: var(--red-600);
      }

      &:hover {
        background-color: rgba(239, 68, 68, 0.2);
      }
    }
  `]
})
export class DeliveryOptionsDialogComponent {
  constructor(private dialogRef: DynamicDialogRef) {}

  selectWithInvoice(): void {
    this.dialogRef.close('/Gescom/frontOffice/Sale/devis/add');
  }

  selectWithoutInvoice(): void {
    this.dialogRef.close('/Gescom/frontOffice/Sale/facture/add');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}     