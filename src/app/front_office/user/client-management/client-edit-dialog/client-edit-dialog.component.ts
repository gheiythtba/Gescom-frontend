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


export interface Client {
  id: number;
  code: string;
  matriculeFiscale: string;
  nomRaisonSociale: string;
  telephone: string;
  adresse: string;
  email: string;
  category: 'particulier' | 'entreprise' | 'gouvernement';
  facturesPayees: number;
  facturesImpayees: number;
  montantDettesPayees: number;
  montantDettesImpayees: number;
  creditMax: number;
  active: boolean;
  dateCreation: Date;
  dernierAchat?: Date;
}


@Component({
  selector: 'app-client-edit-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DialogModule, 
    AvatarModule, TagModule, DividerModule, 
    ButtonModule, DropdownModule, InputGroupModule,
    InputGroupAddonModule, InputSwitchModule,
    DatePipe
  ],
  template: `
    <p-dialog header="Modifier Client" 
              [(visible)]="visible" 
              [style]="{width: '50vw', minWidth: '320px'}"
              [modal]="true"
              [dismissableMask]="true"
              [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
              styleClass="client-dialog">
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <p-avatar *ngIf="client" 
                   [label]="client.nomRaisonSociale.charAt(0)" 
                   size="xlarge" 
                   shape="circle"
                   [style]="{
                     'background-color': getClientColor(client.category),
                     'color': '#ffffff'
                   }"
                   styleClass="client-avatar"></p-avatar>
          <div class="client-info">
            <h3>Modifier {{ client?.nomRaisonSociale || '' }}</h3>
            <div class="client-meta">
              <p-tag *ngIf="client" 
                    [value]="client.category | titlecase" 
                    [severity]="getClientSeverity(client.category)"
                    class="category-tag"></p-tag>
              <span class="client-code">{{ client?.code }}</span>
            </div>
          </div>
        </div>
      </ng-template>

      <div *ngIf="client" class="dialog-content">
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
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-building"></i>
                </p-inputGroupAddon>
                <input pInputText [(ngModel)]="client.matriculeFiscale" 
                      placeholder="Matricule fiscale">
              </p-inputGroup>
            </div>
            
            <div class="field">
              <label><i class="pi pi-phone"></i> Téléphone</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-phone"></i>
                </p-inputGroupAddon>
                <input pInputText [(ngModel)]="client.telephone" 
                      placeholder="Téléphone">
              </p-inputGroup>
            </div>
            
            <div class="field">
              <label><i class="pi pi-envelope"></i> Email</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-envelope"></i>
                </p-inputGroupAddon>
                <input pInputText [(ngModel)]="client.email" 
                      placeholder="Email">
              </p-inputGroup>
            </div>
            
            <div class="field">
              <label><i class="pi pi-map-marker"></i> Adresse</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-map-marker"></i>
                </p-inputGroupAddon>
                <input pInputText [(ngModel)]="client.adresse" 
                      placeholder="Adresse">
              </p-inputGroup>
            </div>
            
            <div class="field">
              <label><i class="pi pi-tag"></i> Catégorie</label>
              <p-dropdown [options]="categories" 
                         [(ngModel)]="client.category" 
                         optionLabel="name"
                         optionValue="value"
                         placeholder="Sélectionner catégorie"
                         appendTo="body"
                         styleClass="w-full">
                <ng-template let-item pTemplate="item">
                  <div class="flex align-items-center gap-2">
                    <i [class]="getCategoryIcon(item.value)"></i>
                    <span>{{ item.name }}</span>
                  </div>
                </ng-template>
              </p-dropdown>
            </div>
            
            <div class="field status-field">
              <label><i class="pi pi-circle-on"></i> Statut</label>
              <div class="status-container">
                <p-inputSwitch [(ngModel)]="client.active" 
                              class="status-switch"></p-inputSwitch>
                <p-tag [value]="client.active ? 'Actif' : 'Inactif'" 
                      [severity]="client.active ? 'success' : 'danger'"
                      class="status-tag">
                </p-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Information Section -->
        <div class="section">
          <div class="section-header">
            <i class="pi pi-wallet section-icon"></i>
            <h4 class="section-title">Informations Financières</h4>
          </div>
          <p-divider></p-divider>
          <div class="form-grid">
            <div class="field">
              <label><i class="pi pi-credit-card"></i> Crédit Maximum</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-money-bill"></i>
                </p-inputGroupAddon>
                <input pInputText [(ngModel)]="client.creditMax" 
                      placeholder="Crédit maximum"
                      type="number">
                <p-inputGroupAddon>
                  TND
                </p-inputGroupAddon>
              </p-inputGroup>
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-check-circle"></i> Factures Payées
                </div>
                <div class="financial-value">
                  {{ client.facturesPayees }}
                </div>
              </div>
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-exclamation-circle"></i> Factures Impayées
                </div>
                <div class="financial-value" [class.text-red-500]="client.facturesImpayees > 0">
                  {{ client.facturesImpayees }}
                </div>
              </div>
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-check"></i> Dettes Payées
                </div>
                <div class="financial-value">
                  {{ client.montantDettesPayees | currency:'TND' }}
                </div>
              </div>
            </div>
            
            <div class="financial-card">
              <div class="financial-item">
                <div class="financial-label">
                  <i class="pi pi-times-circle"></i> Dettes Impayées
                </div>
                <div class="financial-value" [class.text-red-500]="client.montantDettesImpayees > 0">
                  {{ client.montantDettesImpayees | currency:'TND' }}
                </div>
              </div>
            </div>
            
            <div class="field">
              <label><i class="pi pi-calendar"></i> Date de Création</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-calendar"></i>
                </p-inputGroupAddon>
                <input pInputText [value]="client.dateCreation | date:'dd/MM/yyyy'" 
                      placeholder="Date de création" readonly>
              </p-inputGroup>
            </div>
            
            <div class="field">
              <label><i class="pi pi-shopping-cart"></i> Dernier Achat</label>
              <p-inputGroup>
                <p-inputGroupAddon>
                  <i class="pi pi-shopping-cart"></i>
                </p-inputGroupAddon>
                <input pInputText [value]="client.dernierAchat | date:'dd/MM/yyyy':'+01:00'" 
                      placeholder="Dernier achat" readonly>
              </p-inputGroup>
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
  /* Include all the dialog styles from your original component */
  .client-dialog .p-dialog-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .client-avatar {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  .client-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .client-info h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #1e293b;
    font-weight: 600;
  }

  .client-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .client-code {
    font-size: 0.875rem;
    color: #64748b;
    background-color: #f1f5f9;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .category-tag {
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

  .field-value {
    padding: 0.5rem;
    background-color: #f8fafc;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .status-field {
    grid-column: span 2;
  }

  .status-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .status-tag {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
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

  .text-red-500 {
    color: #ef4444;
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

  /* Responsive adjustments */
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
export class ClientEditDialogComponent {
  @Input() client: Client | null = null;
  @Input() visible: boolean = false;
  @Output() save = new EventEmitter<Client>();
  @Output() cancel = new EventEmitter<void>();

  categories = [
    { name: 'Particulier', value: 'particulier' },
    { name: 'Entreprise', value: 'entreprise' },
    { name: 'Gouvernement', value: 'gouvernement' }
  ];

  getClientColor(category: string): string {
    switch(category) {
      case 'particulier': return '#3b82f6';
      case 'entreprise': return '#10b981';
      case 'gouvernement': return '#8b5cf6';
      default: return '#64748b';
    }
  }

  getClientSeverity(category: string): string {
    switch(category) {
      case 'particulier': return 'info';
      case 'entreprise': return 'success';
      case 'gouvernement': return 'help';
      default: return 'contrast';
    }
  }

  getCategoryIcon(category: string): string {
    switch(category) {
      case 'particulier': return 'pi pi-user';
      case 'entreprise': return 'pi pi-building';
      case 'gouvernement': return 'pi pi-shield';
      default: return 'pi pi-tag';
    }
  }

  onSave() {
    if (this.client) {
      this.save.emit(this.client);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}