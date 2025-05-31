import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';

interface Supplier {
  id: number;
  code: string;
  matriculeFiscale: string;
  nomRaisonSociale: string;
  telephone: string;
  adresse: string;
  email: string;
  commandesLivrees: number;
  commandesEnAttente: number;
  montantTotalCommandes: number;
  numeroCamion: string[];
  delaiLivraisonMoyen: number;
  conditionsPaiement: string;
  active: boolean;
  dateCreation: Date;
  dernierLivraison?: Date;
}

@Component({
  selector: 'app-supplier-edit-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DialogModule, 
    AvatarModule, TagModule, DividerModule, 
    ButtonModule, DropdownModule, InputGroupModule,
    InputGroupAddonModule, InputSwitchModule,
    InputNumberModule, DatePipe, ChipsModule,
    InputTextModule
  ],
  template: `
    <p-dialog header="Modifier Fournisseur" 
              [(visible)]="visible" 
              [style]="{width: '50vw', minWidth: '320px'}"
              [modal]="true"
              [dismissableMask]="true"
              [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
              styleClass="supplier-dialog">
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <p-avatar *ngIf="supplier" 
                   [label]="supplier.nomRaisonSociale.charAt(0)" 
                   size="xlarge" 
                   shape="circle"
                   [style]="{
                     'background-color': supplier.active ? '#10b981' : '#ef4444',
                     'color': '#ffffff'
                   }"
                   styleClass="supplier-avatar"></p-avatar>
          <div class="supplier-info">
            <h3>Modifier {{ supplier?.nomRaisonSociale || '' }}</h3>
            <div class="supplier-meta">
              <p-tag *ngIf="supplier" 
                    [value]="supplier.active ? 'Actif' : 'Inactif'" 
                    [severity]="supplier.active ? 'success' : 'danger'"
                    class="status-tag"></p-tag>
              <span class="supplier-code">{{ supplier?.code }}</span>
            </div>
          </div>
        </div>
      </ng-template>

      <div *ngIf="supplier" class="dialog-content">
        <!-- Basic Information Section -->
        <div class="section">
          <div class="section-header">
            <i class="pi pi-info-circle section-icon"></i>
            <h4 class="section-title">Informations de Base</h4>
          </div>
          <p-divider></p-divider>
          <div class="form-grid">
            <div class="field">
              <label><i class="pi pi-id-card"></i> Matricule Fiscale</label>
              <input pInputText [(ngModel)]="supplier.matriculeFiscale" 
                    placeholder="Matricule fiscale"
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-phone"></i> Téléphone</label>
              <input pInputText [(ngModel)]="supplier.telephone" 
                    placeholder="Téléphone"
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-envelope"></i> Email</label>
              <input pInputText [(ngModel)]="supplier.email" 
                    placeholder="Email"
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-map-marker"></i> Adresse</label>
              <input pInputText [(ngModel)]="supplier.adresse" 
                    placeholder="Adresse"
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-truck"></i> Numéros de Camion</label>
              <p-chips [(ngModel)]="supplier.numeroCamion" 
                      placeholder="Ajouter un numéro"
                      class="input-field">
              </p-chips>
            </div>
            
            <div class="field status-field">
              <label><i class="pi pi-circle-on"></i> Statut</label>
              <div class="status-container">
                <p-inputSwitch [(ngModel)]="supplier.active" 
                              class="status-switch"></p-inputSwitch>
                <p-tag [value]="supplier.active ? 'Actif' : 'Inactif'" 
                      [severity]="supplier.active ? 'success' : 'danger'"
                      class="status-tag">
                </p-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Information Section -->
        <div class="section">
          <div class="section-header">
            <i class="pi pi-shopping-cart section-icon"></i>
            <h4 class="section-title">Informations des Commandes</h4>
          </div>
          <p-divider></p-divider>
          <div class="form-grid">
            <div class="field">
              <label><i class="pi pi-calendar"></i> Date de Création</label>
              <input pInputText [value]="supplier.dateCreation | date:'dd/MM/yyyy'" 
                    placeholder="Date de création" readonly
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-truck"></i> Dernière Livraison</label>
              <input pInputText [value]="supplier.dernierLivraison | date:'dd/MM/yyyy'" 
                    placeholder="Dernière livraison" readonly
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-clock"></i> Délai Livraison Moyen</label>
              <input type="number" pInputText [(ngModel)]="supplier.delaiLivraisonMoyen" 
                    placeholder="Délai moyen en jours"
                    class="input-field">
            </div>
            
            <div class="field">
              <label><i class="pi pi-credit-card"></i> Conditions de Paiement</label>
              <input pInputText [(ngModel)]="supplier.conditionsPaiement" 
                    placeholder="Ex: NET-30"
                    class="input-field">
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-check-circle"></i> Commandes Livrées
                </div>
                <div class="financial-value">
                  {{ supplier.commandesLivrees }}
                </div>
              </div>
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-exclamation-circle"></i> Commandes en Attente
                </div>
                <div class="financial-value" [class.text-orange-500]="supplier.commandesEnAttente > 0">
                  {{ supplier.commandesEnAttente }}
                </div>
              </div>
            </div>
            
            <div class="field">
              <label><i class="pi pi-money-bill"></i> Montant Total Commandes</label>
              <input type="number" pInputText [(ngModel)]="supplier.montantTotalCommandes" 
                    placeholder="Montant total"
                    class="input-field">
            </div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button pButton label="Annuler" 
                  icon="pi pi-times"
                  class="p-button-outlined cancel-button"
                  (click)="onCancel()"></button>
          <button pButton label="Enregistrer" 
                  icon="pi pi-check"
                  class="save-button"
                  (click)="onSave()"></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .supplier-dialog .p-dialog-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background-color: #f8fafc;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .supplier-avatar {
      width: 64px;
      height: 64px;
      font-size: 1.5rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .supplier-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .supplier-info h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1e293b;
      font-weight: 600;
    }

    .supplier-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .supplier-code {
      font-size: 0.875rem;
      color: #64748b;
      background-color: #f1f5f9;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .status-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: white;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-icon {
      color: #3b82f6;
      font-size: 1.25rem;
    }

    .section-title {
      margin: 0;
      font-size: 1.125rem;
      color: #1e293b;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .field label i {
      font-size: 1rem;
      color: #64748b;
    }

    .input-field {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      transition: border-color 0.2s;
      font-size: 0.875rem;
    }

    .input-field:hover {
      border-color: #cbd5e1;
    }

    .input-field:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .p-chips.input-field ::ng-deep .p-chips-multiple-container {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }

    .p-chips.input-field ::ng-deep .p-chips-multiple-container:hover {
      border-color: #cbd5e1;
    }

    .p-chips.input-field ::ng-deep .p-chips-multiple-container:focus-within {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .status-field {
      grid-column: span 2;
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .financial-card {
      background-color: #f8fafc;
      border-radius: 6px;
      padding: 1rem;
      border-left: 4px solid #e2e8f0;
    }

    .financial-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .financial-label {
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .financial-label i {
      font-size: 1rem;
    }

    .financial-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
    }

    .text-orange-500 {
      color: #f59e0b;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
      gap: 0.75rem;
    }

    .cancel-button {
      color: #64748b;
      border-color: #cbd5e1;
    }

    .save-button {
      background-color: #3b82f6;
      border-color: #3b82f6;
    }

    @media (max-width: 768px) {
      .dialog-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .status-field {
        grid-column: span 1;
      }
    }
  `]
})
export class SupplierEditDialogComponent {
  @Input() supplier: Supplier | null = null;
  @Input() visible: boolean = false;
  @Output() save = new EventEmitter<Supplier>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    if (this.supplier) {
      this.save.emit(this.supplier);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}