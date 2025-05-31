import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-creation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    RippleModule,
    TooltipModule
  ],
  template: `
    <p-dialog [header]="title" 
              [(visible)]="visible" 
              [style]="{ width: dialogWidth }" 
              [modal]="true"
              [draggable]="false"
              [resizable]="false"
              [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
              [contentStyle]="{ 'border-radius': '12px', 'padding': '0' }"
              (onHide)="onClose()">
      
      <div class="dialog-content">
        <!-- Dynamic form fields -->
        <div *ngFor="let field of fields" class="field">
          <label [for]="field.key" class="field-label">
            {{ field.label }}<span *ngIf="field.required" class="required-asterisk"> *</span>
          </label>
          
          <div class="field-input-container">
            <!-- Text Input -->
            <div *ngIf="field.type === 'text'" class="input-wrapper">
              <i [class]="field.icon || 'pi pi-pencil'"></i>
              <input [id]="field.key"
                    type="text"
                    pInputText
                    [(ngModel)]="model[field.key]"
                    [placeholder]="field.placeholder || ''"
                    class="input-field"
                    [ngClass]="{ 'input-error': submitted && field.required && !model[field.key] }" />
            </div>

            <!-- Number Input -->
            <div *ngIf="field.type === 'number'" class="input-wrapper">
              <i [class]="field.icon || 'pi pi-calculator'"></i>
              <p-inputNumber [id]="field.key"
                            [(ngModel)]="model[field.key]"
                            [placeholder]="field.placeholder || ''"
                            [min]="field.min"
                            [max]="field.max"
                            mode="decimal"
                            inputClass="input-field"
                            [ngClass]="{ 'input-error': submitted && field.required && !model[field.key] }">
              </p-inputNumber>
            </div>

            <!-- Select Dropdown -->
            <div *ngIf="field.type === 'select'" class="input-wrapper">
              <i [class]="field.icon || 'pi pi-list'"></i>
              <p-dropdown [id]="field.key"
                         [options]="field.options || []"
                         [(ngModel)]="model[field.key]"
                         [optionLabel]="field.optionLabel || 'label'"
                         [optionValue]="field.optionValue || 'value'"
                         [placeholder]="field.placeholder || 'Select an option'"
                         class="dropdown-field"
                         [ngClass]="{ 'input-error': submitted && field.required && !model[field.key] }">
              </p-dropdown>
            </div>

            <!-- Date Picker -->
            <div *ngIf="field.type === 'date'" class="input-wrapper">
              <i [class]="field.icon || 'pi pi-calendar'"></i>
              <p-calendar [id]="field.key"
                          [(ngModel)]="model[field.key]"
                          [placeholder]="field.placeholder || 'Select date'"
                          dateFormat="dd/mm/yy"
                          [showIcon]="true"
                          inputClass="input-field"
                          [ngClass]="{ 'input-error': submitted && field.required && !model[field.key] }">
              </p-calendar>
            </div>

            <!-- Textarea -->
            <div *ngIf="field.type === 'textarea'" class="input-wrapper">
              <i [class]="field.icon || 'pi pi-align-left'"></i>
              <textarea [id]="field.key"
                      pInputTextarea
                      [(ngModel)]="model[field.key]"
                      [placeholder]="field.placeholder || ''"
                      [rows]="field.rows || 3"
                      class="textarea-field"
                      [ngClass]="{ 'input-error': submitted && field.required && !model[field.key] }">
              </textarea>
            </div>
          </div>

          <small *ngIf="submitted && field.required && !model[field.key]" 
                class="error-message">
            {{ field.label }} is required
          </small>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button pButton 
                  type="button" 
                  label="Cancel" 
                  icon="pi pi-times" 
                  severity="secondary"
                  (click)="onClose()"
                  pRipple
                  pTooltip="Close without saving"
                  tooltipPosition="top"
                  class="cancel-button">
          </button>
          
          <button pButton 
                  type="button" 
                  [label]="confirmButtonText" 
                  [icon]="confirmButtonIcon" 
                  severity="primary"
                  (click)="onSubmit()"
                  pRipple
                  pTooltip="Save changes"
                  tooltipPosition="top"
                  [loading]="isSubmitting"
                  class="confirm-button">
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

    /* Dialog Header */
    :host ::ng-deep .p-dialog .p-dialog-header {
      border-bottom: 1px solid var(--border-color);
      padding: 1.5rem 2rem;
      background: #f9fafb;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    /* Dialog Content */
    .dialog-content {
      padding: 2rem;
    }

    .field {
      margin-bottom: 1.75rem;
    }

    .field-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .required-asterisk {
      color: var(--error-color);
    }

    .field-input-container {
      position: relative;
    }

    /* Input Wrapper */
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper > i {
      position: absolute;
      left: 1rem;
      color: #6b7280;
      z-index: 1;
    }

    /* Input Fields */
    .input-field, .textarea-field {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      font-size: 0.875rem;
      color: #374151;
      background-color: #fff;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: var(--transition);
    }

    :host ::ng-deep .input-field:hover,
    :host ::ng-deep .textarea-field:hover {
      border-color: var(--hover-border-color);
    }

    :host ::ng-deep .input-field:focus,
    :host ::ng-deep .textarea-field:focus {
      border-color: var(--focus-border-color);
      box-shadow: var(--focus-shadow);
      outline: 0;
    }

    /* Textarea Specific */
    .textarea-field {
      min-height: 100px;
      resize: vertical;
    }

    /* Dropdown Specific */
    :host ::ng-deep .dropdown-field .p-dropdown {
      width: 100%;
      padding-left: 2.5rem;
    }

    :host ::ng-deep .dropdown-field .p-dropdown .p-dropdown-label {
      padding: 0.75rem 1rem;
    }

    /* Error States */
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
    :host ::ng-deep .p-dialog .p-dialog-footer {
      border-top: 1px solid var(--border-color);
      padding: 1.25rem 2rem;
      background: #f9fafb;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    /* Buttons */
    .cancel-button, .confirm-button {
      min-width: 100px;
      font-weight: 500;
      border-radius: 8px;
      transition: var(--transition);
    }

    .cancel-button {
      background-color: white !important;
      color: var(--secondary-color) !important;
      border: 1px solid var(--border-color) !important;
    }

    .cancel-button:hover {
      background-color: #f3f4f6 !important;
      color: var(--secondary-hover) !important;
      border-color: var(--secondary-hover) !important;
    }

    .confirm-button {
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }

    .confirm-button:hover {
      background-color: var(--primary-hover) !important;
      border-color: var(--primary-hover) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2);
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .dialog-content {
        padding: 1.5rem;
      }

      :host ::ng-deep .p-dialog .p-dialog-header,
      :host ::ng-deep .p-dialog .p-dialog-footer {
        padding: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .dialog-content {
        padding: 1rem;
      }

      .field {
        margin-bottom: 1.25rem;
      }

      .dialog-footer {
        flex-direction: column;
        gap: 0.75rem;
      }

      .cancel-button, .confirm-button {
        width: 100%;
      }
    }
  `]
})
export class CreationDialogComponent {
  @Input() title = 'Create New Item';
  @Input() fields: DialogField[] = [];
  @Input() model: any = {};
  @Input() dialogWidth = '500px';
  @Input() confirmButtonText = 'Save';
  @Input() confirmButtonIcon = 'pi pi-check';
  @Input() isSubmitting = false;
  
  @Output() submit = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  visible = false;
  submitted = false;

  show() {
    this.visible = true;
    this.submitted = false;
    this.resetModel();
  }

  hide() {
    this.visible = false;
    this.closed.emit();
  }

  onClose() {
    this.hide();
  }

  onSubmit() {
    this.submitted = true;
    
    // Check required fields
    const isValid = this.fields
      .filter(f => f.required)
      .every(f => this.model[f.key]);
    
    if (isValid) {
      this.submit.emit({...this.model});
    }
  }

  private resetModel() {
    this.model = {};
    this.fields.forEach(field => {
      this.model[field.key] = field.defaultValue || '';
    });
  }
}

export interface DialogField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  min?: number;
  max?: number;
  rows?: number;
  defaultValue?: any;
  icon?: string;
}