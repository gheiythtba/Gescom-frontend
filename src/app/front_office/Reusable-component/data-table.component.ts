import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, TabMenuModule, CardModule, ButtonModule, RippleModule, TooltipModule],
  template: `
    <div class="data-table-wrapper">
      <div class="data-table-container">
        <!-- Header with tabs and actions -->
        <div class="table-header border-t-2">
          <div class="tab-menu-container">
            <p-tabMenu 
              [model]="tabs" 
              [activeItem]="activeTab"
              (activeItemChange)="onTabChange($event)"
              class="custom-tab-menu">
            </p-tabMenu>
          </div>
        </div>

        <!-- Table Container -->
        <div class="table-content">
          <p-table 
            [value]="data"  
            [columns]="columns"
            [paginator]="true"
            [rows]="rows"
            [rowsPerPageOptions]="[5, 10, 25, 50]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            styleClass="custom-table"
            [loading]="loading"
            [responsive]="true">
            
            <!-- Header -->
            <ng-template pTemplate="header">
              <tr>
                <th *ngFor="let col of columns" class="table-header-cell">
                  <span class="header-text">{{ col.header }}</span>
                </th>
              </tr>
            </ng-template>

            <!-- Loading State -->
            <ng-template pTemplate="loading">
              <tr>
                <td [colSpan]="columns.length" class="loading-cell">
                  <div class="loading-content">
                    <div class="spinner"></div>
                    <span class="loading-text">Loading data...</span>
                  </div>
                </td>
              </tr>
            </ng-template>

            <!-- Body -->
            <ng-template pTemplate="body" let-rowData let-rowIndex="rowIndex" let-columns="columns">
              <tr class="table-row">
                <td *ngFor="let col of columns" class="table-cell">
                  <ng-container *ngIf="!col.template && col.field !== 'actions'">
                    <span class="cell-text">{{ rowData[col.field] || '-' }}</span>
                  </ng-container>
                  
                  <ng-container *ngIf="col.template && col.field !== 'actions'">
                    <ng-container *ngTemplateOutlet="col.template; context: { $implicit: rowData, field: col.field }"></ng-container>
                  </ng-container>
                  
                  <ng-container *ngIf="col.field === 'actions'">
                    <div class="action-buttons">
                      <ng-container *ngIf="actionTemplate">
                        <ng-container *ngTemplateOutlet="actionTemplate; context: { $implicit: rowData }"></ng-container>
                      </ng-container>
                    </div>
                  </ng-container>
                </td>
              </tr>
            </ng-template>

            <!-- Empty State -->
            <ng-template pTemplate="empty">
              <tr>
                <td [colSpan]="columns.length" class="empty-cell">
                  <div class="empty-content">
                    <div class="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6M4 6L6 2H18L20 6M10 10V14M14 10V14" 
                              stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span class="empty-text">No records found</span>
                    <button *ngIf="showAddButton" 
                            pButton 
                            label="Add New Record" 
                            icon="pi pi-plus"
                            class="add-button"
                            (click)="addClick.emit()">
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Main container styles */
    .data-table-wrapper {
      display: block;
      width: 100%;
    }

    .data-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }

    .data-table-container:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Header styles */
    .table-header {
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background-color: #f8fafc;
    }

    .tab-menu-container {
      width: 100%;
    }

    /* Table content styles */
    .table-content {
      padding: 1rem;
    }

    /* Custom table styles */
    :host ::ng-deep .custom-table {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    :host ::ng-deep .custom-table .p-datatable-thead > tr > th {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 0.875rem 1rem;
    }

    :host ::ng-deep .custom-table .p-datatable-tbody > tr > td {
      border-color: #e2e8f0;
      padding: 0.875rem 1rem;
      color: #334155;
      font-size: 0.875rem;
    }

    :host ::ng-deep .custom-table .p-datatable-tbody > tr:nth-child(even) {
      background-color: #f9fafb;
    }

    :host ::ng-deep .custom-table .p-datatable-tbody > tr:hover {
      background-color: #f0f9ff !important;
    }

    /* Table cell styles */
    .table-header-cell {
      background: #f8fafc;
    }

    .table-row {
      transition: background-color 0.15s ease;
    }

    .table-cell {
      vertical-align: middle;
    }

    .cell-text {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Loading state */
    .loading-cell {
      padding: 3rem !important;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      color: #64748b;
      font-size: 0.875rem;
    }

    /* Empty state */
    .empty-cell {
      padding: 3rem !important;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .empty-icon {
      color: #cbd5e1;
      margin-bottom: 0.5rem;
    }

    .empty-text {
      color: #64748b;
      font-size: 0.875rem;
    }

    .add-button {
      margin-top: 0.75rem;
    }

    /* Action buttons */
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    /* Paginator styles */
    :host ::ng-deep .custom-table .p-paginator {
      background: transparent;
      border: none;
      padding: 1rem 0 0 0;
    }

    :host ::ng-deep .custom-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #3b82f6;
      border-color: #3b82f6;
    }

    /* Tab menu styles */
    :host ::ng-deep .custom-tab-menu .p-tabmenu-nav {
      background: transparent;
      border: none;
      padding: 0;
    }

    :host ::ng-deep .custom-tab-menu .p-tabmenuitem {
      margin-right: 1.5rem;
    }

    :host ::ng-deep .custom-tab-menu .p-tabmenuitem.p-highlight .p-menuitem-link {
      color: #3b82f6 !important;
      border-color: #3b82f6;
    }

    :host ::ng-deep .custom-tab-menu .p-menuitem-link {
      padding: 0.75rem 0;
      border-bottom-width: 2px;
      border-color: transparent;
      transition: all 0.2s ease;
      color: #64748b;
    }

    :host ::ng-deep .custom-tab-menu .p-menuitem-link:hover {
      color: #1e293b !important;
      border-color: rgba(59, 130, 246, 0.3);
    }

    /* Animation */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .table-header {
        padding: 0.75rem 1rem;
      }

      .table-content {
        padding: 0.75rem;
      }

      :host ::ng-deep .custom-table .p-datatable-thead > tr > th,
      :host ::ng-deep .custom-table .p-datatable-tbody > tr > td {
        padding: 0.75rem;
      }

      :host ::ng-deep .custom-tab-menu .p-tabmenuitem {
        margin-right: 1rem;
      }
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() tabs: MenuItem[] = [];
  @Input() activeTab: MenuItem = this.tabs[0];
  @Input() rows: number = 10;
  @Input() loading: boolean = false;
  @Input() showGlobalActions: boolean = true;
  @Input() showAddButton: boolean = true;
  @ContentChild('actionTemplate') actionTemplate!: TemplateRef<any>;
  @Output() tabChanged = new EventEmitter<MenuItem>();
  @Output() addClick = new EventEmitter<void>();

  onTabChange(item: MenuItem) {
    this.tabChanged.emit(item);
  }
}

export interface TableColumn {
  field: string;
  header: string;
  template?: TemplateRef<any>;
}