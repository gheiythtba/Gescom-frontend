import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    RippleModule,
    TooltipModule
  ],
  template: `
    <p-dialog [header]="title" 
              [(visible)]="visible" 
              [style]="{width: dialogWidth}" 
              [modal]="true"
              [draggable]="false"
              [resizable]="false"
              [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
              [contentStyle]="{ 'border-radius': '12px' }"
              (onHide)="onClose()">
      
      <div class="dialog-content p-4">
        <!-- Dynamic form fields -->
        <div *ngFor="let field of fields" class="field mb-5">
          <label [for]="field.key" class="block mb-2 text-sm font-medium text-gray-700">
            {{ field.label }}<span *ngIf="field.required" class="text-red-500"> *</span>
          </label>
          
          <div class="relative">
            <!-- Text Input -->
            <span *ngIf="field.type === 'text'" class="p-input-icon-left">
              <i [class]="field.icon || 'pi pi-pencil'"></i>
              <input [id]="field.key"
                    type="text"
                    pInputText
                    [(ngModel)]="model[field.key]"
                    [placeholder]="field.placeholder || ''"
                    [disabled]="field.disabled || false"
                    class="w-full text-sm border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                    [ngClass]="{'p-invalid': submitted && field.required && !model[field.key]}">
            </span>
                 
            <!-- Number Input -->
            <span *ngIf="field.type === 'number'" class="p-input-icon-left">
              <i [class]="field.icon || 'pi pi-calculator'"></i>
              <p-inputNumber [id]="field.key"
                            [(ngModel)]="model[field.key]"
                            [placeholder]="field.placeholder || ''"
                            [disabled]="field.disabled || false"
                            [min]="field.min"
                            [max]="field.max"
                            mode="decimal"
                            class="w-full"
                            inputClass="w-full text-sm border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                            [ngClass]="{'p-invalid': submitted && field.required && !model[field.key]}">
              </p-inputNumber>
            </span>
          
            <!-- Select Dropdown -->
            <span *ngIf="field.type === 'select'" class="p-input-icon-left">
              <i [class]="field.icon || 'pi pi-list'"></i>
              <p-dropdown [id]="field.key"
                         [options]="field.options || []"
                         [(ngModel)]="model[field.key]"
                         [optionLabel]="field.optionLabel || 'label'"
                         [optionValue]="field.optionValue || 'value'"
                         [placeholder]="field.placeholder || 'Select an option'"
                         [disabled]="field.disabled || false"
                         class="w-full text-sm"
                         [ngClass]="{'p-invalid': submitted && field.required && !model[field.key]}">
              </p-dropdown>
            </span>
          
            <!-- Date Picker -->
            <span *ngIf="field.type === 'date'" class="p-input-icon-left">
              <i [class]="field.icon || 'pi pi-calendar'"></i>
              <p-calendar [id]="field.key"
                         [(ngModel)]="model[field.key]"
                         [placeholder]="field.placeholder || 'Select date'"
                         [disabled]="field.disabled || false"
                         dateFormat="dd/mm/yy"
                         [showIcon]="true"
                         class="w-full"
                         inputClass="w-full text-sm border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
                         [ngClass]="{'p-invalid': submitted && field.required && !model[field.key]}">
              </p-calendar>
            </span>
          </div>
          
          <small *ngIf="submitted && field.required && !model[field.key]" 
                 class="p-error block mt-1 text-xs text-red-500">
            {{ field.label }} is required
          </small>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3">
          <button pButton 
                  type="button" 
                  label="Cancel" 
                  icon="pi pi-times" 
                  severity="secondary"
                  (click)="onClose()"
                  pRipple
                  pTooltip="Close without saving"
                  tooltipPosition="top"
                  class="px-4 py-2 text-sm font-medium border-gray-300 hover:bg-gray-50">
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
                  class="px-4 py-2 text-sm font-medium">
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .p-dialog .p-dialog-header {
      border-bottom: 1px solid #f3f4f6;
      padding: 1.25rem 1.5rem;
      background: #ffffff;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    
    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 0;
      background: #ffffff;
    }
    
    :host ::ng-deep .p-dialog .p-dialog-footer {
      border-top: 1px solid #f3f4f6;
      padding: 1rem 1.5rem;
      background: #ffffff;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    
    :host ::ng-deep .p-inputtext {
      transition: all 0.2s ease;
      border-radius: 6px;
    }
    
    :host ::ng-deep .p-inputtext:enabled:hover {
      border-color: #3b82f6;
    }
    
    :host ::ng-deep .p-inputtext:enabled:focus {
      box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2);
      border-color: #3b82f6;
    }
    
    :host ::ng-deep .p-invalid.p-inputtext {
      border-color: #ef4444;
    }
    
    :host ::ng-deep .p-invalid.p-inputtext:enabled:focus {
      box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2);
    }
    
    /* Icon styling */
    :host ::ng-deep .p-input-icon-left > i {
      color: #6b7280;
      z-index: 1;
      left: 1rem;
    }
    
    :host ::ng-deep .p-input-icon-left > .p-inputtext,
    :host ::ng-deep .p-input-icon-left > .p-inputnumber,
    :host ::ng-deep .p-input-icon-left > .p-dropdown,
    :host ::ng-deep .p-input-icon-left > .p-calendar {
      padding-left: 2.5rem;
    }
    
    /* Button styling */
    :host ::ng-deep .p-button {
      min-width: 2rem;
      height: 2.5rem;
      transition: all 0.2s ease;
    }
    
    :host ::ng-deep .p-button-icon {
      font-size: 1rem;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      :host ::ng-deep .p-dialog {
        margin: 0.5rem;
      }
      
      :host ::ng-deep .p-dialog .p-dialog-header,
      :host ::ng-deep .p-dialog .p-dialog-footer {
        padding: 1rem;
      }
      
      :host ::ng-deep .p-button {
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class UpdateDialogComponent {
  @Input() title = 'Update Item';
  @Input() fields: DialogField[] = [];
  @Input() model: any = {};
  @Input() dialogWidth = '500px';
  @Input() confirmButtonText = 'Update';
  @Input() confirmButtonIcon = 'pi pi-check';
  @Input() isSubmitting = false;
  
  @Output() submit = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  visible = false;
  submitted = false;

  show(model?: any) {
    this.visible = true;
    this.submitted = false;
    if (model) {
      this.model = {...model};
    }
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
      .every(f => this.model[f.key] !== undefined && this.model[f.key] !== null && this.model[f.key] !== '');
    
    if (isValid) {
      this.submit.emit({...this.model});
    }
  }
}

export interface DialogField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required?: boolean;
  disabled?: boolean;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  placeholder?: string;
  icon?: string;
}