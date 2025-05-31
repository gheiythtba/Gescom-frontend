import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { AvatarModule } from 'primeng/avatar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    HeaderBarComponent,
    CardModule,
    DividerModule,
    ToastModule,
    InputMaskModule,
    PasswordModule,
    CheckboxModule,
    InputSwitchModule,
    TabViewModule,
    AvatarModule,
    FileUploadModule,
    TooltipModule,
    BadgeModule,
    ProgressBarModule
  ],
  template: `
    <div class="user-create-premium-container">
      <!-- Header Section -->
      <app-header-bar
        [title]="'Nouvel Utilisateur'"
        [buttons]="headerButtons"
        [subtitle]="'Configurez un nouveau compte utilisateur'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <!-- Progress Indicator -->
      <div class="progress-container">
        <p-progressBar [value]="formProgress" [showValue]="false" class="progress-bar"></p-progressBar>
        <div class="progress-steps">
          <span [class.active]="currentTabIndex === 0" [class.completed]="currentTabIndex > 0">
            <i class="pi pi-user"></i> Informations
          </span>
          <span [class.active]="currentTabIndex === 1" [class.completed]="currentTabIndex > 1">
            <i class="pi pi-map-marker"></i> Coordonnées
          </span>
          <span [class.active]="currentTabIndex === 2" [class.completed]="currentTabIndex > 2">
            <i class="pi pi-lock"></i> Sécurité
          </span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid mt-3">
        <!-- Left Column - Form Sections -->
        <div class="col-12 lg:col-8">
          <p-tabView [(activeIndex)]="currentTabIndex" class="premium-tabview" (onChange)="onTabChange()">
            <!-- Basic Information Tab -->
            <p-tabPanel header="Informations de Base" leftIcon="pi pi-user mr-2">
              <div class="grid formgrid p-fluid">
                <div class="field col-12 md:col-6">
                  <label for="code">
                    <i class="pi pi-id-card mr-2"></i>Code Utilisateur
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <input pInputText id="code" [(ngModel)]="user.code" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="USR-001" class="w-full" />
                  <small class="text-500">Généré automatiquement si vide</small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="matricule">
                    <i class="pi pi-building mr-2"></i>Matricule Fiscale
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <input pInputText id="matricule" [(ngModel)]="user.matriculeFiscale" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="12345678" class="w-full" />
                </div>

                <div class="field col-12">
                  <label for="nom">
                    <i class="pi pi-user-edit mr-2"></i>Nom/Raison Sociale
                    <span class="required-badge">Requis</span>
                  </label>
                  <input pInputText id="nom" [(ngModel)]="user.nomRaisonSociale" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="Nom complet ou raison sociale" class="w-full" />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="email">
                    <i class="pi pi-envelope mr-2"></i>Email
                    <span class="required-badge">Requis</span>
                  </label>
                  <input pInputText id="email" type="email" [(ngModel)]="user.email" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="email@example.com" class="w-full" />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="telephone">
                    <i class="pi pi-phone mr-2"></i>Téléphone
                    <span class="required-badge">Requis</span>
                  </label>
                  <p-inputMask id="telephone" [(ngModel)]="user.telephone" 
                              (onComplete)="onFieldChange()"
                              mask="99 999 999" placeholder="71 234 567" class="w-full"></p-inputMask>
                </div>
              </div>
            </p-tabPanel>

            <!-- Contact & Address Tab -->
            <p-tabPanel header="Coordonnées" leftIcon="pi pi-map-marker mr-2">
              <div class="grid formgrid p-fluid">
                <div class="field col-12">
                  <label for="adresse">
                    <i class="pi pi-home mr-2"></i>Adresse Complète
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <textarea pInputText id="adresse" [(ngModel)]="user.adresse" 
                            (ngModelChange)="onFieldChange()"
                            rows="3" placeholder="Adresse, Code Postal, Ville" class="w-full"></textarea>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="pays">
                    <i class="pi pi-globe mr-2"></i>Pays
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <input pInputText id="pays" [(ngModel)]="user.pays" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="Tunisie" class="w-full" />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="ville">
                    <i class="pi pi-building mr-2"></i>Ville
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <input pInputText id="ville" [(ngModel)]="user.ville" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="Tunis" class="w-full" />
                </div>
              </div>
            </p-tabPanel>

            <!-- Security & Access Tab -->
            <p-tabPanel header="Sécurité" leftIcon="pi pi-lock mr-2">
              <div class="grid formgrid p-fluid">
                <div class="field col-12 md:col-6">
                  <label for="role">
                    <i class="pi pi-shield mr-2"></i>Rôle
                    <span class="required-badge">Requis</span>
                  </label>
                  <p-dropdown id="role" [(ngModel)]="user.role" [options]="roles" 
                              (onChange)="onFieldChange()"
                              optionLabel="label" optionValue="value" placeholder="Sélectionnez un rôle"
                              class="w-full"></p-dropdown>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="department">
                    <i class="pi pi-sitemap mr-2"></i>Département
                    <span class="optional-badge">Optionnel</span>
                  </label>
                  <input pInputText id="department" [(ngModel)]="user.department" 
                        (ngModelChange)="onFieldChange()"
                        placeholder="Département" class="w-full" />
                </div>

                <div class="field col-12 md:col-6">
                  <label for="password">
                    <i class="pi pi-key mr-2"></i>Mot de passe
                    <span class="required-badge">Requis</span>
                  </label>
                  <p-password id="password" [(ngModel)]="user.password" 
                              (onChange)="onFieldChange()"
                              [toggleMask]="true" placeholder="Entrez un mot de passe"
                              [feedback]="true" [promptLabel]="getPasswordPrompt()"
                              [weakLabel]="'Faible'" [mediumLabel]="'Moyen'" 
                              [strongLabel]="'Fort'" class="w-full"></p-password>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="confirmPassword">
                    <i class="pi pi-key mr-2"></i>Confirmation
                    <span class="required-badge">Requis</span>
                  </label>
                  <p-password id="confirmPassword" [(ngModel)]="confirmPassword" 
                              (onChange)="onFieldChange()"
                              [toggleMask]="true" placeholder="Confirmez le mot de passe"
                              class="w-full"></p-password>
                </div>

                <div class="field col-12">
                  <div class="flex align-items-center gap-3">
                    <p-inputSwitch [(ngModel)]="user.active" id="active" 
                                  (onChange)="onFieldChange()"
                                  [style]="{'width': '3.5rem'}"></p-inputSwitch>
                    <label for="active" class="mb-0">Compte Actif</label>
                    <i class="pi pi-info-circle ml-2" 
                       pTooltip="Désactivez pour créer un compte inactif" 
                       tooltipPosition="right"></i>
                  </div>
                </div>
              </div>
            </p-tabPanel>
          </p-tabView>
        </div>

        <!-- Right Column - Profile & Actions -->
        <div class="col-12 lg:col-4">
          <!-- Profile Card -->
          <p-card header="Profil" class="profile-card" [style]="{'box-shadow': '0 4px 20px rgba(0,0,0,0.08)'}">
            <div class="flex flex-column align-items-center p-4">
              <!-- Avatar Container -->
              <div class="avatar-container" (click)="triggerFileUpload()" pTooltip="Cliquez pour changer la photo" tooltipPosition="top">
                <div class="avatar-wrapper">
                  <p-avatar *ngIf="!selectedImage" [label]="getInitials()" size="xlarge" 
                            [style]="{'background-color':'#4f46e5', 'color': '#ffffff', 
                                    'font-size': '2rem', 'font-weight': '600'}"></p-avatar>
                  <p-avatar *ngIf="selectedImage" [image]="selectedImage" size="xlarge" shape="circle"
                            styleClass="profile-avatar"></p-avatar>
                  <div class="avatar-overlay">
                    <i class="pi pi-camera"></i>
                  </div>
                </div>
              </div>
              
              <!-- Hidden File Upload -->
              <p-fileUpload #fileUpload mode="basic" name="avatar" accept="image/*" 
                          (onSelect)="onImageSelect($event)" auto="true" 
                          [showUploadButton]="false" [showCancelButton]="false"
                          styleClass="hidden-upload"></p-fileUpload>
              
              <!-- User Info -->
              <div class="user-info text-center w-full mt-3">
                <h4 class="mb-1">{{user.nomRaisonSociale || 'Nouvel Utilisateur'}}</h4>
                <p class="text-500 mb-3">{{ getRoleLabel() }}</p>
                
                <div class="user-meta">
                  <span class="meta-item">
                    <i class="pi pi-envelope"></i>
                    {{user.email || 'email@example.com'}}
                  </span>
                  <span class="meta-item">
                    <i class="pi pi-phone"></i>
                    {{user.telephone || 'Non spécifié'}}
                  </span>
                </div>
              </div>
              
              <!-- Status Indicator -->
              <div class="status-indicator" [ngClass]="{'active': user.active, 'inactive': !user.active}">
                <i class="pi" [class.pi-check-circle]="user.active" [class.pi-times-circle]="!user.active"></i>
                {{ user.active ? 'Actif' : 'Inactif' }}
              </div>
            </div>
          </p-card>

          <!-- Added margin between profile and actions sections -->
          <div class="actions-section">
            <!-- Actions Card -->
            <p-card header="Actions Rapides" [style]="{'box-shadow': '0 4px 20px rgba(0,0,0,0.08)'}">
              <div class="flex flex-column gap-3">
                <button pButton label="Enregistrer" icon="pi pi-save" 
                        class="p-button-success w-full" (click)="onSave()"
                        [disabled]="formProgress < 100"></button>
                
                <button pButton label="Enregistrer et Nouveau" icon="pi pi-plus-circle" 
                        class="p-button-info w-full" (click)="onSaveAndNew()"
                        [disabled]="formProgress < 100"></button>
                
                <button pButton label="Réinitialiser" icon="pi pi-refresh" 
                        class="p-button-outlined w-full" (click)="resetForm()"></button>
                
                <button pButton label="Annuler" icon="pi pi-times" 
                        class="p-button-outlined p-button-danger w-full" (click)="onCancel()"></button>
              </div>

              <p-divider></p-divider>

              <div class="completion-status">
                <p-progressBar [value]="formProgress" [showValue]="false"></p-progressBar>
                <div class="flex justify-content-between mt-2">
                  <span class="text-500">Progression du formulaire</span>
                  <span class="font-medium">{{formProgress}}%</span>
                </div>
              </div>

              <p-divider></p-divider>

              <div class="text-center">
                <small class="text-500">
                  <i class="pi pi-info-circle mr-1"></i>
                  * Champs obligatoires
                </small>
              </div>
            </p-card>
          </div>
        </div>
      </div>
    </div>

    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .user-create-premium-container {
      padding: 2rem;
      background-color: #f8fafc;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    /* Header spacing */
    app-header-bar {
      margin-bottom: 1.5rem;
    }

    /* Progress Indicator */
    .progress-container {
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .progress-bar .p-progressbar {
      height: 8px;
      border-radius: 4px;
      background: #e2e8f0;
    }

    .progress-bar .p-progressbar-value {
      background: linear-gradient(90deg, #4f46e5, #8b5cf6);
      transition: width 0.5s ease;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      position: relative;
    }

    .progress-steps:before {
      content: '';
      position: absolute;
      top: 15px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e2e8f0;
      z-index: 1;
    }

    .progress-steps span {
      position: relative;
      z-index: 2;
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-steps span i {
      font-size: 1rem;
    }

    .progress-steps span.active {
      color: #4f46e5;
      font-weight: 500;
      background: #e0e7ff;
    }

    .progress-steps span.completed {
      color: #10b981;
    }

    /* Main grid adjustments */
    .grid {
      gap: 1.5rem;
    }

    /* Tab View Styling */
    .premium-tabview {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);

      .p-tabview-nav {
        background: linear-gradient(to right, #f9fafb, #f3f4f6);
        border-bottom: none;
        margin-bottom: 0;
        padding: 0 1.5rem;
        
        li .p-tabview-nav-link {
          padding: 1.25rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-color-secondary);
          font-weight: 500;
          margin-right: 0;
          border-radius: 0;
          transition: all 0.3s;
          position: relative;
          
          &:not(.p-disabled):focus {
            box-shadow: none;
          }

          &:hover {
            color: var(--primary-color);
            background: rgba(255,255,255,0.7);
          }
        }
        
        li.p-highlight .p-tabview-nav-link {
          color: var(--primary-color);
          background: white;
          font-weight: 600;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(to right, #4f46e5, #8b5cf6);
          }
        }
      }
      
      .p-tabview-panels {
        background: white;
        padding: 2rem;
      }
    }

    /* Form Field Styling */
    .field {
      margin-bottom: 1.75rem;
      
      label {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
        font-weight: 500;
        color: #334155;
        font-size: 0.875rem;
        
        i {
          font-size: 0.875rem;
          margin-right: 0.5rem;
          color: #64748b;
        }
      }
      
      input, textarea, .p-dropdown, .p-password {
        width: 100%;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        transition: all 0.3s;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.9375rem;
        
        &:hover {
          border-color: #a5b4fc;
        }
        
        &:focus, &:focus-within {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
          border-color: #4f46e5;
        }
      }
      
      textarea {
        min-height: 100px;
        resize: vertical;
      }
      
      small {
        display: block;
        margin-top: 0.5rem;
        color: #64748b;
        font-size: 0.75rem;
      }

      .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider {
        background: #4f46e5;
      }
    }

    /* Badges for required/optional fields */
    .required-badge, .optional-badge {
      font-size: 0.6875rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      margin-left: 0.5rem;
      font-weight: 500;
    }

    .required-badge {
      background: #fee2e2;
      color: #dc2626;
    }

    .optional-badge {
      background: #e0f2fe;
      color: #0369a1;
    }

    /* Profile Card Styling */
    .profile-card {
      border: none;
      border-radius: 12px;
      
      .p-card-header {
        font-size: 1.125rem;
        font-weight: 600;
        padding: 1.25rem;
        border-bottom: 1px solid #f1f5f9;
        color: #1e293b;
        background: linear-gradient(to right, #f9fafb, #f3f4f6);
      }
      
      .p-card-body {
        padding: 0;
      }
    }

    /* Added margin between profile and actions sections */
    .actions-section {
      margin-top: 1.5rem;
    }

    .avatar-container {
      position: relative;
      width: fit-content;
      cursor: pointer;
      margin-bottom: 1rem;
      
      .avatar-wrapper {
        position: relative;
        width: fit-content;
      }

      .p-avatar {
        width: 140px;
        height: 140px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 4px solid white;
        transition: all 0.3s;
      }
      
      .profile-avatar {
        object-fit: cover;
      }
      
      .avatar-overlay {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #4f46e5;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        
        i {
          font-size: 1.125rem;
        }
        
        &:hover {
          transform: scale(1.1);
          background: #4338ca;
        }
      }

      &:hover .p-avatar {
        transform: scale(1.02);
      }
    }

    .hidden-upload {
      display: none;
    }

    .user-info {
      width: 100%;
      h4 {
        font-size: 1.25rem;
        color: #1e293b;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      p {
        color: #64748b;
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      margin-bottom: 1.5rem;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        color: #64748b;
        padding: 0.5rem;
        background: #f8fafc;
        border-radius: 6px;

        i {
          color: #94a3b8;
        }
      }
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 500;
      margin-top: 0.5rem;
      
      i {
        font-size: 1rem;
      }
      
      &.active {
        background-color: #ecfdf5;
        color: #059669;
      }
      
      &.inactive {
        background-color: #fee2e2;
        color: #dc2626;
      }
    }

    /* Button Styling */
    .p-button {
      transition: all 0.3s;
      font-weight: 500;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      
      &:not(.p-button-outlined) {
        border: none;
      }

      &.p-button-success {
        background: linear-gradient(to right, #10b981, #34d399);
        border: none;
      }

      &.p-button-info {
        background: linear-gradient(to right, #3b82f6, #60a5fa);
        border: none;
      }

      &.p-button-danger {
        background: linear-gradient(to right, #ef4444, #f87171);
        border: none;
      }

      &:hover:not(.p-disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      &:active:not(.p-disabled) {
        transform: translateY(0);
      }
    }

    .p-button-outlined {
      background: transparent;
      border: 1px solid #e2e8f0;
      color: #64748b;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
    }

    /* Completion Status */
    .completion-status {
      .p-progressbar {
        height: 6px;
        border-radius: 3px;
      }

      .p-progressbar-value {
        background: linear-gradient(to right, #4f46e5, #8b5cf6);
      }
    }

    /* Responsive Adjustments */
    @media screen and (max-width: 992px) {
      .user-create-premium-container {
        padding: 1.5rem;
      }
      
      .p-card {
        margin-bottom: 1.5rem;
      }
      
      .field {
        margin-bottom: 1.5rem;
      }

      .premium-tabview .p-tabview-panels {
        padding: 1.5rem;
      }
    }

    @media screen and (max-width: 768px) {
      .user-create-premium-container {
        padding: 1rem;
      }
      
      .premium-tabview .p-tabview-nav {
        flex-direction: column;
        padding: 0;

        li .p-tabview-nav-link {
          padding: 1rem;
          justify-content: flex-start;
        }

        li.p-highlight .p-tabview-nav-link:after {
          top: 0;
          left: auto;
          right: 0;
          width: 3px;
          height: 100%;
        }
      }

      .progress-steps {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .progress-steps:before {
        display: none;
      }

      .avatar-container .p-avatar {
        width: 100px;
        height: 100px;
      }
    }
  `],
  providers: [MessageService]
})
export class UserCreateComponent {
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  user: User = this.getDefaultUser();
  confirmPassword: string = '';
  selectedImage: string | null = null;
  currentTabIndex: number = 0;
  formProgress: number = 0;

  roles = [
    { label: 'Client', value: 'client', icon: 'pi pi-user' },
    { label: 'Fournisseur', value: 'fournisseur', icon: 'pi pi-truck' },
    { label: 'Administrateur', value: 'admin', icon: 'pi pi-shield' },
    { label: 'Personnalisé', value: 'custom', icon: 'pi pi-cog' }
  ];

  headerButtons = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#1e293b', 'border-color': '#1e293b'}
    }
  ];

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calculateFormProgress();
  }

  triggerFileUpload() {
    this.fileUpload.advancedFileInput.nativeElement.click();
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.onFieldChange();
      };
      reader.readAsDataURL(file);
    }
    this.fileUpload.clear();
  }

  onFieldChange() {
    this.calculateFormProgress();
  }

  onTabChange() {
    this.calculateFormProgress();
  }

  getInitials(): string {
    if (!this.user.nomRaisonSociale) return 'NU';
    const names = this.user.nomRaisonSociale.split(' ');
    return names.length > 1 
      ? `${names[0].charAt(0)}${names[names.length-1].charAt(0)}`
      : names[0].substring(0, 2);
  }

  getRoleLabel(): string {
    if (!this.user.role) return 'Rôle non défini';
    const foundRole = this.roles.find(r => r.value === this.user.role);
    return foundRole ? foundRole.label : '';
  }

  getPasswordPrompt(): string {
    return 'Au moins 8 caractères avec des chiffres et symboles';
  }

  calculateFormProgress(): void {
    const requiredFields = [
      this.user.nomRaisonSociale,
      this.user.email,
      this.user.telephone,
      this.user.role,
      this.user.password,
      this.confirmPassword,
      (this.user.password && this.user.password === this.confirmPassword) ? 1 : 0
    ];

    const completedFields = requiredFields.filter(field => !!field).length;
    this.formProgress = Math.round((completedFields / requiredFields.length) * 100);
  }

  onSave(): void {
    if (this.validateForm()) {
      const userToSave = {
        ...this.user,
        profileImage: this.selectedImage
      };
      this.save.emit(userToSave);
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur créé avec succès',
        life: 3000
      });
    }
  }

  onSaveAndNew(): void {
    if (this.validateForm()) {
      this.onSave();
      this.resetForm();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.goBack();
  }

  resetForm(): void {
    this.user = this.getDefaultUser();
    this.confirmPassword = '';
    this.selectedImage = null;
    this.currentTabIndex = 0;
    this.calculateFormProgress();
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Formulaire réinitialisé',
      life: 2000
    });
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.onCancel();

    }
  }

  private validateForm(): boolean {
    const requiredFields = [
      { field: this.user.nomRaisonSociale, message: 'Le nom/raison sociale est requis' },
      { field: this.user.email, message: 'L\'email est requis' },
      { field: this.user.telephone, message: 'Le téléphone est requis' },
      { field: this.user.role, message: 'Le rôle est requis' },
      { field: this.user.password, message: 'Le mot de passe est requis' }
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: message,
          life: 3000
        });
        return false;
      }
    }

    if (this.user.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Les mots de passe ne correspondent pas',
        life: 3000
      });
      return false;
    }

    if (!this.validateEmail(this.user.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez entrer un email valide',
        life: 3000
      });
      return false;
    }

    return true;
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private getDefaultUser(): User {
    return {
      id: 0,
      code: '',
      matriculeFiscale: '',
      nomRaisonSociale: '',
      telephone: '',
      adresse: '',
      pays: '',
      ville: '',
      email: '',
      role: '',
      department: '',
      password: '',
      active: true,
      dateCreation: new Date()
    };
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/User']);
  }
}

export interface User {
  id: number;
  code: string;
  matriculeFiscale: string;
  nomRaisonSociale: string;
  telephone: string;
  adresse: string;
  pays: string;
  ville: string;
  email: string;
  role: string;
  department: string;
  password: string;
  active: boolean;
  dateCreation: Date;
  profileImage?: string | null;
}