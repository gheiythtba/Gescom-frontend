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
              'has-icon': button.icon,
              'secondary-action': !button.primary
            }"
            [style]="button.style"
            (click)="buttonClick.emit(button.key)">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Premium Header Styles */
    :host {
      --primary-color: #4361ee;
      --primary-hover: #3a0ca3;
      --secondary-color: #6c757d;
      --secondary-hover: #5a6268;
      --text-color: #2b2d42;
      --text-light: #8d99ae;
      --border-color: rgba(0,0,0,0.08);
      --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Main container */
    .header-container {
      background: white;
      padding: 1.5rem 2.5rem;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
      margin-bottom: 2rem;
      position: relative;
      z-index: 10;
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
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 0.95rem;
      color: var(--text-light);
      margin-top: 0.5rem;
      font-weight: 400;
    }

    /* Actions section */
    .actions-section {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* Button styles */
    .action-button {
      transition: var(--transition);
      min-width: fit-content;
      border-radius: 10px !important;
      font-weight: 500 !important;
      letter-spacing: 0.01em;
      padding: 0.75rem 1.25rem !important;
      box-shadow: none !important;
    }

    .action-button.has-icon {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .primary-action {
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }

    .primary-action:hover {
      background-color: var(--primary-hover) !important;
      border-color: var(--primary-hover) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(67, 97, 238, 0.2) !important;
    }

    .secondary-action {
      background-color: transparent !important;
      color: var(--secondary-color) !important;
      border-color: var(--secondary-color) !important;
    }

    .secondary-action:hover {
      background-color: rgba(108, 117, 125, 0.05) !important;
      color: var(--secondary-hover) !important;
      border-color: var(--secondary-hover) !important;
      transform: translateY(-1px);
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .header-container {
        padding: 1.25rem 2rem;
      }
      
      .title {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
      }

      .actions-section {
        width: 100%;
        flex-wrap: wrap;
      }

      .action-button {
        flex: 1 1 auto;
        min-width: 100%;
        padding: 0.65rem 1rem !important;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        padding: 1rem;
      }

      .title {
        font-size: 1.4rem;
      }

      .subtitle {
        font-size: 0.85rem;
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