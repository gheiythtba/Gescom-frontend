import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
type SpecialPermissions = {
  canExport: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canAudit: boolean;
  canApprove: boolean;
};

type PermissionOption = {
  label: string;
  value: keyof SpecialPermissions;
};

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PanelModule, DropdownModule,
    DividerModule, CardModule,
    InputTextModule, ButtonModule,
    AvatarModule, TabViewModule,
    CalendarModule, CheckboxModule,
    ProgressBarModule,BadgeModule
  ],
  template: `
    <div class="max-w-[1200px] mx-auto bg-gray-50 p-4 md:p-6">
      <!-- Main Header Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row gap-4 md:gap-6">
          <!-- Editable User Avatar -->
          <div class="w-full sm:w-56 h-56 flex-shrink-0 mx-auto sm:mx-0 relative group">
            <div class="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              <p-avatar [image]="user.profileImage" size="xlarge" shape="circle" class="w-full h-full"></p-avatar>
            </div>
            <button
                pButton
                icon="pi pi-upload"
                class="absolute bottom-2 right-2 p-button-rounded p-button-sm p-button-text bg-white/80 hover:bg-white"
                pTooltip="Change image"
                tooltipPosition="top"
                (click)="openImageUploadDialog()">
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div class="min-w-0">
                <input pInputText type="text" [(ngModel)]="user.fullName" 
                      class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 w-full">
                
                <div class="flex items-center gap-2 flex-wrap mt-2">
                  <p-dropdown [options]="statusOptions" [(ngModel)]="user.status" 
                              optionLabel="label" optionValue="value" 
                              placeholder="Select Status">
                  </p-dropdown>
                  
                  <p-dropdown [options]="roleOptions" [(ngModel)]="user.role" 
                              optionLabel="label" optionValue="value" 
                              placeholder="Select Role">
                  </p-dropdown>
                </div>
              </div>
              
              <div class="flex items-center gap-2 sm:ml-4">
                <p-badge [value]="'ID: ' + user.id" severity="info"></p-badge>
              </div>
            </div>

            <h2 class="text-xl sm:text-2xl font-semibold text-primary-600 mt-4 mb-3">Personal Information</h2>

            <div class="flex flex-wrap gap-3 mb-4">
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-envelope text-gray-500"></i>
                <span class="text-gray-600">Email:</span>
                <input pInputText type="text" [(ngModel)]="user.email" class="font-medium flex-1 min-w-0">
              </div>
              
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-phone text-gray-500"></i>
                <span class="text-gray-600">Phone:</span>
                <input pInputText type="text" [(ngModel)]="user.phone" class="font-medium flex-1 min-w-0">
              </div>
              
              <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
                <i class="pi pi-id-card text-gray-500"></i>
                <span class="text-gray-600">Matricule:</span>
                <input pInputText type="text" [(ngModel)]="user.matricule" class="font-medium flex-1 min-w-0">
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500">
                <span class="block text-gray-500 text-sm">Department</span>
                <input pInputText type="text" [(ngModel)]="user.department" class="font-medium w-full">
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500">
                <span class="block text-gray-500 text-sm">Activity</span>
                <p-inputNumber [(ngModel)]="user.activity" min="0" max="100" suffix="%"></p-inputNumber>
              </div>

              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-primary-500">
                <span class="block text-gray-500 text-sm">2FA Status</span>
                <p-dropdown [options]="twoFactorOptions" [(ngModel)]="user.twoFactorEnabled"></p-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button pButton label="Save" icon="pi pi-save" class="p-button-sm" (click)="saveChanges()"></button>
        <button pButton label="Reset Password" icon="pi pi-key" class="p-button-sm p-button-outlined"></button>
        <button pButton label="Deactivate" icon="pi pi-lock" class="p-button-sm p-button-outlined"></button>
        <button pButton label="Cancel" icon="pi pi-times" class="p-button-sm p-button-outlined" (click)="cancelEdit()"></button>
      </div>

      <!-- User Details Section -->
      <div class="p-4 md:p-6 bg-white rounded-xl shadow-sm mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-primary-600">User Details</h2>
        </div>
        
        <p-tabView>
          <!-- Basic Info Tab -->
          <p-tabPanel header="Basic Information">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-5 rounded-xl">
                <h3 class="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <i class="pi pi-info-circle"></i> Identity
                </h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="text-gray-600">Full Name:</label>
                    <input pInputText [(ngModel)]="user.fullName" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Birth Date:</label>
                    <p-calendar [(ngModel)]="user.birthDate" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Gender:</label>
                    <p-dropdown [options]="genderOptions" [(ngModel)]="user.gender"></p-dropdown>
                  </div>
                  
                  <div class="form-group pt-2 border-t border-gray-200 mt-2">
                    <label class="font-semibold">Tax ID:</label>
                    <input pInputText [(ngModel)]="user.matricule" class="w-full">
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-xl flex flex-col">
                  <label class="text-gray-500 text-sm mb-1">Role</label>
                  <p-dropdown [options]="roleOptions" [(ngModel)]="user.role"></p-dropdown>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-xl flex flex-col">
                  <label class="text-gray-500 text-sm mb-1">Department</label>
                  <input pInputText [(ngModel)]="user.department" class="w-full">
                </div>
                
                <div class="bg-gray-50 p-4 rounded-xl flex flex-col col-span-2">
                  <label class="text-gray-500 text-sm mb-1">Account Status</label>
                  <p-progressBar [value]="user.activity" [showValue]="false"></p-progressBar>
                  <div class="flex justify-between mt-1">
                    <span class="text-sm">Activity Level</span>
                    <span class="text-sm">{{user.activity}}%</span>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Contact Tab -->
          <p-tabPanel header="Contact Information">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-5 rounded-xl">
                <h3 class="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <i class="pi pi-home"></i> Address
                </h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="text-gray-600">Address:</label>
                    <input pInputText [(ngModel)]="user.address" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">City:</label>
                    <input pInputText [(ngModel)]="user.city" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Postal Code:</label>
                    <input pInputText [(ngModel)]="user.postalCode" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Country:</label>
                    <input pInputText [(ngModel)]="user.country" class="w-full">
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-5 rounded-xl">
                <h3 class="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <i class="pi pi-phone"></i> Contact
                </h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="text-gray-600">Phone:</label>
                    <input pInputText [(ngModel)]="user.phone" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Mobile:</label>
                    <input pInputText [(ngModel)]="user.mobile" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Email:</label>
                    <input pInputText [(ngModel)]="user.email" class="w-full">
                  </div>
                  
                  <div class="form-group">
                    <label class="text-gray-600">Secondary Email:</label>
                    <input pInputText [(ngModel)]="user.secondaryEmail" class="w-full">
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Permissions Tab -->
          <p-tabPanel header="Permissions">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-5 rounded-xl">
                <h3 class="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <i class="pi pi-key"></i> Special Permissions
                </h3>
                <div class="space-y-4">
                  <div class="form-group">
                    <div class="flex flex-col gap-2">
                      <div *ngFor="let permission of specialPermissionOptions" class="flex items-center">
                        <p-checkbox 
                          [binary]="true" 
                          [(ngModel)]="user.specialPermissions[permission.value]">
                        </p-checkbox>
                        <label class="ml-2">{{permission.label}}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-600: #2563eb;
      --primary-500: #3b82f6;
      --primary-300: #93c5fd;
    }
    
    .text-primary-600 {
      color: var(--primary-600);
    }
    
    .border-primary-500 {
      border-color: var(--primary-500);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }
    
    label {
      color: #4b5563;
      font-size: 0.875rem;
    }
    
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    
    .rounded-xl {
      border-radius: 0.75rem;
    }
    
    .shadow-sm {
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-calendar,
    :host ::ng-deep .p-multiselect {
      width: 100%;
    }
    
    :host ::ng-deep .p-tabview .p-tabview-nav {
      margin-bottom: 1.5rem;
    }
  `]
})
export class UserEditComponent {
  user = {
    id: 'USR-00042',
    fullName: 'Mohamed Ben Ali',
    email: 'mohamed.benali@example.com',
    phone: '+216 71 234 567',
    mobile: '+216 98 765 432',
    matricule: '12345678',
    status: 'active',
    role: 'admin',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    birthDate: new Date('1985-03-15'),
    gender: 'male',
    department: 'IT',
    activity: 90,
    twoFactorEnabled: true,
    address: '12 Rue Habib Bourguiba',
    city: 'Tunis',
    postalCode: '1002',
    country: 'Tunisia',
    secondaryEmail: 'm.benali@personal.com',
    specialPermissions: {
      canExport: true,
      canDelete: false,
      canManageUsers: true,
      canAudit: false,
      canApprove: false
    } as SpecialPermissions
  };

  // Dropdown options
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

  roleOptions = [
    { label: 'Administrator', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Editor', value: 'editor' },
    { label: 'Manager', value: 'manager' }
  ];

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  twoFactorOptions = [
    { label: 'Enabled', value: true },
    { label: 'Disabled', value: false }
  ];

  specialPermissionOptions: PermissionOption[] = [
    { label: 'Can Export Data', value: 'canExport' },
    { label: 'Can Delete Records', value: 'canDelete' },
    { label: 'Can Manage Users', value: 'canManageUsers' },
    { label: 'Can Audit System', value: 'canAudit' },
    { label: 'Can Approve Requests', value: 'canApprove' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log('Editing user ID:', userId);
      // Load user data here in real app
    });
  }

  saveChanges() {
    console.log('User data to save:', this.user);
    // In real app, save to backend
    setTimeout(() => {
      this.router.navigate(['/users/view', this.user.id]);
    }, 500);
  }

  cancelEdit() {
    this.router.navigate(['/users/view', this.user.id]);
  }

  openImageUploadDialog() {
    console.log('Open image upload dialog');
    // Implement image upload logic
  }
}