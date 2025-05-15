import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderButton } from '../../../Reusable-component/header-bar.component';
import { HeaderBarComponent } from '../../../Reusable-component/header-bar.component';
import { InputNumberModule } from 'primeng/inputnumber';

interface Warehouse {
  code: string;
  name: string;
}

interface Article {
  id: number;
  code: string;
  designation: string;
  quantity: number;
  availableQuantity: number;
}

@Component({
  selector: 'app-create-new-transfer',
  standalone: true,
  imports: [
    CommonModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    TableModule,
    FormsModule,
    HeaderBarComponent,
    DialogModule,
    TooltipModule
  ],
  template: `
    <div class="page-container">
      <app-header-bar
        title="Nouveau Bon de Transfert"
        subtitle="Créez un nouveau transfert entre entrepôts"
        [buttons]="headerButtons"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <div class="content-grid">
        <!-- Main Form Column -->
        <div class="form-column">
          <div class="form-card">
            <div class="form-grid">
              <!-- Source Warehouse -->
              <div class="form-field">
                <label for="sourceWarehouse">Entrepôt Source</label>
                <p-dropdown 
                  id="sourceWarehouse"
                  [options]="warehouses" 
                  optionLabel="name"
                  [(ngModel)]="transfer.sourceWarehouse"
                  (onChange)="onSourceWarehouseChange()"
                  [filter]="true"
                  placeholder="Sélectionner un entrepôt"
                  class="w-full">
                </p-dropdown>
              </div>

              <!-- Destination Warehouse -->
              <div class="form-field">
                <label for="destinationWarehouse">Entrepôt Destination</label>
                <p-dropdown 
                  id="destinationWarehouse"
                  [options]="filteredDestinationWarehouses" 
                  optionLabel="name"
                  [(ngModel)]="transfer.destinationWarehouse"
                  [filter]="true"
                  placeholder="Sélectionner un entrepôt"
                  class="w-full">
                </p-dropdown>
              </div>

              <!-- Transfer Date -->
              <div class="form-field">
                <label for="transferDate">Date de Transfert</label>
                <p-calendar 
                  id="transferDate"
                  [(ngModel)]="transfer.date" 
                  [showIcon]="true"
                  dateFormat="dd/mm/yy"
                  [showButtonBar]="true"
                  class="w-full">
                </p-calendar>
              </div>

              <!-- Reference -->
              <div class="form-field">
                <label for="reference">Référence</label>
                <input 
                  id="reference"
                  type="text" 
                  pInputText 
                  [(ngModel)]="transfer.reference"
                  placeholder="Généré automatiquement"
                  readonly
                  class="w-full">
              </div>

              <!-- Notes -->
              <div class="form-field full-width">
                <label for="notes">Notes</label>
                <textarea 
                  id="notes"
                  pInputTextarea 
                  [(ngModel)]="transfer.notes"
                  rows="2"
                  placeholder="Ajouter des notes..."
                  class="w-full">
                </textarea>
              </div>
            </div>
          </div>

          <!-- Articles Table -->
          <div class="articles-card">
            <div class="articles-header">
              <h3>Articles à Transférer</h3>
              <button 
                pButton 
                icon="pi pi-plus" 
                label="Ajouter Article" 
                class="add-button"
                (click)="showAddArticleDialog = true">
              </button>
            </div>

            <p-table 
              [value]="transfer.items" 
              [rows]="10" 
              [paginator]="true"
              responsiveLayout="scroll"
              styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Code</th>
                  <th>Désignation</th>
                  <th>Quantité Disponible</th>
                  <th>Quantité à Transférer</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>{{item.code}}</td>
                  <td>{{item.designation}}</td>
                  <td>{{item.availableQuantity}}</td>
                  <td>
                    <p-inputNumber 
                      [(ngModel)]="item.quantity"
                      [min]="1"
                      [max]="item.availableQuantity"
                      mode="decimal"
                      [showButtons]="true"
                      inputId="quantity"
                      styleClass="quantity-input">
                    </p-inputNumber>
                  </td>
                  <td>
                    <button 
                      pButton 
                      icon="pi pi-trash" 
                      class="delete-button"
                      (click)="removeItem(item)">
                    </button>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="5" class="empty-message">
                    Aucun article ajouté. Cliquez sur "Ajouter Article" pour commencer.
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <!-- Summary Column -->
        <div class="summary-column">
          <div class="summary-card">
            <h3 class="summary-title">Résumé</h3>
            
            <div class="summary-section">
              <h4>Informations de Base</h4>
              <div class="summary-grid">
                <div class="summary-label">Référence:</div>
                <div class="summary-value">{{transfer.reference || '--'}}</div>
                
                <div class="summary-label">Date:</div>
                <div class="summary-value">{{transfer.date ? (transfer.date | date:'shortDate') : '--'}}</div>
                
                <div class="summary-label">Source:</div>
                <div class="summary-value">{{transfer.sourceWarehouse?.name || '--'}}</div>
                
                <div class="summary-label">Destination:</div>
                <div class="summary-value">{{transfer.destinationWarehouse?.name || '--'}}</div>
              </div>
            </div>

            <div class="summary-section">
              <h4>Articles</h4>
              <div class="summary-grid">
                <div class="summary-label">Total Articles:</div>
                <div class="summary-value">{{transfer.items.length}}</div>
                
                <div class="summary-label">Total Quantité:</div>
                <div class="summary-value">{{getTotalQuantity()}}</div>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                pButton 
                label="Annuler" 
                icon="pi pi-times" 
                class="cancel-button"
                (click)="cancel()">
              </button>
              <button 
                pButton 
                label="Enregistrer" 
                icon="pi pi-save" 
                class="save-button"
                [disabled]="!isFormValid()"
                (click)="save()">
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Article Dialog -->
   
      <!-- Add Article Dialog -->
      <p-dialog 
      header="Ajouter Article" 
      [(visible)]="showAddArticleDialog"
      [style]="{width: '50vw', 'min-height': '50vh'}" 
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [contentStyle]="{'height': '100%', 'display': 'flex', 'flex-direction': 'column'}">
      
      <div class="dialog-content" style="flex: 1; display: flex; flex-direction: column;">
        <div class="dialog-field" style="flex: 1; min-height: 300px;">
          <p-dropdown 
            [options]="availableArticles" 
            optionLabel="designation"
            [(ngModel)]="selectedArticle"
            [filter]="true"
            filterBy="designation,code"
            placeholder="Rechercher un article"
            [showClear]="true"
            [virtualScroll]="true"
            [virtualScrollItemSize]="44"
            styleClass="w-full h-full"
            [panelStyle]="{'max-height': '400px'}">
            <ng-template let-article pTemplate="item">
              <div class="dropdown-item" style="padding: 1rem; display: flex; align-items: center; height: 60px;">
                <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 0.25rem;">{{article.code}}</div>
                  <div style="color: #4a5568;">{{article.designation}}</div>
                </div>
                <div style="margin-left: auto; background: #edf2f7; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 500;">
                  {{article.availableQuantity}} disponible(s)
                </div>
              </div>
            </ng-template>
          </p-dropdown>
        </div>

        <div class="dialog-field" *ngIf="selectedArticle" style="margin-top: 2rem;">
          <label>Quantité à Transférer</label>
          <p-inputNumber 
            [(ngModel)]="selectedArticle.quantity"
            [min]="1"
            [max]="selectedArticle.availableQuantity"
            mode="decimal"
            [showButtons]="true"
            class="w-full">
          </p-inputNumber>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button 
          pButton 
          label="Annuler" 
          icon="pi pi-times" 
          (click)="showAddArticleDialog = false" 
          class="dialog-cancel-button">
        </button>
        <button 
          pButton 
          label="Ajouter" 
          icon="pi pi-check" 
          (click)="addItem()" 
          [disabled]="!selectedArticle"
          class="dialog-confirm-button">
        </button>
      </ng-template>
    </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      height: 100%;
    }

    .page-container {
      padding: 1.5rem;
      height: 100%;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    @media (min-width: 992px) {
      .content-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .form-card, .articles-card, .summary-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .form-field {
      margin-bottom: 1rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #4a5568;
    }

    textarea, input, p-dropdown, p-calendar {
      width: 100%;
    }

    .articles-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .add-button {
      background-color: #4299e1 !important;
      border-color: #4299e1 !important;
    }

    .quantity-input {
      width: 100px;
    }

    .delete-button {
      background: transparent !important;
      color: #e53e3e !important;
      border: none !important;
      box-shadow: none !important;
    }

    .delete-button:hover {
      background: #fff5f5 !important;
    }

    .empty-message {
      text-align: center;
      padding: 1.5rem;
      color: #718096;
    }

    .summary-title {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #2d3748;
    }

    .summary-section {
      margin-bottom: 1.5rem;
    }

    .summary-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #4a5568;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .summary-label {
      color: #718096;
      font-weight: 500;
    }

    .summary-value {
      color: #2d3748;
    }

    .action-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
    }

    .cancel-button {
      background-color: #e53e3e !important;
      border-color: #e53e3e !important;
    }

    .save-button {
      background-color: #38a169 !important;
      border-color: #38a169 !important;
    }

    .dialog-content {
      padding: 1rem 0;
    }

    .dialog-field {
      margin-bottom: 1.5rem;
    }

    .dropdown-item {
      transition: background-color 0.2s;
    }

    .dropdown-item:hover {
      background-color: #f7fafc;
    }

    .p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):hover {
      background: #f7fafc;
    }

    .p-dropdown-panel {
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .p-dropdown {
      height: 100%;
    }

    .p-dropdown .p-dropdown-label {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .item-code {
      font-weight: 600;
      margin-right: 0.5rem;
    }

    .item-designation {
      margin-right: 0.5rem;
    }

    .item-quantity {
      margin-left: auto;
      color: #718096;
    }

    .dialog-cancel-button {
      background: transparent !important;
      color: #4a5568 !important;
      border: none !important;
      box-shadow: none !important;
    }

    .dialog-confirm-button {
      background-color: #38a169 !important;
      border-color: #38a169 !important;
    }
  `]
})
export class CreateNewTransferComponent {
  constructor(private router: Router) {
    this.generateReference();
  }

  // Header buttons
  headerButtons: HeaderButton[] = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    }
  ];

  // Warehouses data
  warehouses: Warehouse[] = [
    { code: 'WH-001', name: 'Entrepôt Principal' },
    { code: 'WH-002', name: 'Entrepôt Nord' },
    { code: 'WH-003', name: 'Entrepôt Sud' },
    { code: 'WH-004', name: 'Entrepôt Est' },
    { code: 'WH-005', name: 'Entrepôt Ouest' }
  ];

  // Available articles data
  availableArticles: Article[] = [
    { id: 1, code: 'P-0001', designation: 'Système de chauffage central', quantity: 1, availableQuantity: 15 },
    { id: 2, code: 'P-0002', designation: 'Ventilateur industriel', quantity: 1, availableQuantity: 8 },
    { id: 3, code: 'P-0003', designation: 'Thermostat intelligent', quantity: 1, availableQuantity: 22 },
    { id: 4, code: 'P-0004', designation: 'Radiateur électrique', quantity: 1, availableQuantity: 7 },
    { id: 5, code: 'P-0005', designation: 'Climatiseur mural', quantity: 1, availableQuantity: 12 }
  ];

  // Transfer object
  transfer = {
    reference: '',
    sourceWarehouse: null as Warehouse | null,
    destinationWarehouse: null as Warehouse | null,
    date: new Date(),
    notes: '',
    items: [] as Article[]
  };

  // Dialog control
  showAddArticleDialog = false;
  selectedArticle: Article | null = null;
  filteredDestinationWarehouses: Warehouse[] = [];

  // Generate a reference number
  generateReference() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.transfer.reference = `TR-${year}${month}${day}-${randomNum}`;
  }

  // Filter destination warehouses based on source selection
  onSourceWarehouseChange() {
    if (this.transfer.sourceWarehouse) {
      this.filteredDestinationWarehouses = this.warehouses.filter(
        wh => wh.code !== this.transfer.sourceWarehouse?.code
      );
    } else {
      this.filteredDestinationWarehouses = [...this.warehouses];
    }
    // Reset destination if no longer valid
    if (this.transfer.destinationWarehouse && 
        this.transfer.destinationWarehouse.code === this.transfer.sourceWarehouse?.code) {
      this.transfer.destinationWarehouse = null;
    }
  }

  // Add selected article to transfer items
  addItem() {
    if (this.selectedArticle) {
      // Check if article already exists in transfer
      const existingItem = this.transfer.items.find(item => item.id === this.selectedArticle?.id);
      
      if (existingItem) {
        // Update quantity if already exists
        existingItem.quantity = this.selectedArticle.quantity;
      } else {
        // Add new item
        this.transfer.items.push({...this.selectedArticle});
      }
      
      this.showAddArticleDialog = false;
      this.selectedArticle = null;
    }
  }

  // Remove item from transfer
  removeItem(item: Article) {
    this.transfer.items = this.transfer.items.filter(i => i.id !== item.id);
  }

  // Calculate total quantity of items to transfer
  getTotalQuantity(): number {
    return this.transfer.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  // Check if form is valid
  isFormValid(): boolean {
    return !!this.transfer.sourceWarehouse && 
           !!this.transfer.destinationWarehouse && 
           this.transfer.items.length > 0;
  }

  // Save the transfer
  save() {
    console.log('Saving transfer:', this.transfer);
    // Here you would typically call an API to save the transfer
    this.router.navigate(['/Gescom/frontOffice/Stock/BonDeTransfert']);
  }

  // Cancel the transfer creation
  cancel() {
    this.router.navigate(['/Gescom/frontOffice/Stock/BonDeTransfert']);
  }

  // Handle header button clicks
  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.cancel();
    }
  }
}