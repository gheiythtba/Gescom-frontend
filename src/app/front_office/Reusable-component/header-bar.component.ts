import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="header-container">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">{{ title }}</h1>
          <div *ngIf="subtitle" class="subtitle">{{ subtitle }}</div>
        </div>
        
        <div class="actions-section">
          <button 
            *ngFor="let button of buttons"
            pButton
            type="button"
            [label]="button.label"
            [icon]="button.icon"
            [iconPos]="button.iconPos || 'left'"
            [outlined]="button.outlined || false"
            [rounded]="button.rounded"
            class="action-button"
            [ngClass]="{
              'primary-action': button.primary,
              'has-icon': button.icon
            }"
            [style]="button.style"
            (click)="buttonClick.emit(button.key)">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Main container */
    .header-container {
      background: white;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
    }

    /* Header content layout */
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 100%;
      margin: 0 auto;
    }

    /* Title section */
    .title-section {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      line-height: 1.3;
    }

    .subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    /* Actions section */
    .actions-section {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    /* Button styles */
    .action-button {
      transition: all 0.2s ease;
      min-width: fit-content;
    }

    .action-button.has-icon {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .primary-action {
      background-color: #007AFF !important;
      border-color: #007AFF !important;
    }

    .primary-action:hover {
      background-color: #0066CC !important;
      border-color: #0066CC !important;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .header-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .actions-section {
        width: 100%;
        flex-wrap: wrap;
      }

      .action-button {
        flex: 1 1 auto;
        min-width: 100%;
      }
    }

    @media (max-width: 480px) {
      .title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class HeaderBarComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() buttons: HeaderButton[] = [];
  @Output() buttonClick = new EventEmitter<string>();
}

export interface HeaderButton {
  key: string;
  label: string;
  icon: string;
  iconPos?: 'left' | 'right';
  outlined?: boolean;
  rounded?: boolean;
  primary?: boolean;
  style?: any;
}