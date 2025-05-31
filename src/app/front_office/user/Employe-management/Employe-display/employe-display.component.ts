import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { TabViewModule } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderBarComponent } from '../../../Reusable-component/header-bar.component';

interface Employee {
  id: number;
  code: string;
  fullName: string;
  cin: string;
  telephone: string;
  email: string;
  department: string;
  position: string;
  hireDate: Date;
  lastLogin?: Date;
  active: boolean;
  avatar?: string;
  gender?: string;
  birthDate?: Date;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  secondaryEmail?: string;
  mobile?: string;
}


interface Activity {
  date: Date;
  action: string;
  module: string;
  ip: string;
  details: string;
}

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderBarComponent,
    PanelModule, DropdownModule,
    TableModule, DividerModule,
    TagModule, CardModule,
    InputTextModule, ButtonModule,
    DatePipe, BadgeModule,
    TooltipModule, ProgressBarModule,
    DialogModule, InputNumberModule,
    CalendarModule, AvatarModule,
    TabViewModule
  ],
  template: `
    <div class="employee-management-container">
      <app-header-bar
        [title]="'Employee Details'"
        [buttons]="headerButtons"
        [subtitle]="'View and manage employee information'"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

      <!-- Main Content -->
      <div class="content-section">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-section">
            <p-avatar 
              [label]="employee.fullName.charAt(0) || ''" 
              size="xlarge" 
              shape="circle"
              styleClass="employee-avatar">
            </p-avatar>
            <div class="status-badge">
              <p-tag 
                [value]="employee.active ? 'Active' : 'Inactive'" 
                [severity]="employee.active ? 'success' : 'danger'">
              </p-tag>
            </div>
          </div>

          <div class="profile-info">
            <div class="info-header">
              <h2>{{ employee.fullName || 'Loading...' }}</h2>
              <p-badge [value]="'ID: ' + employee.code" severity="info"></p-badge>
            </div>

            <div class="info-details">
              <div class="detail-item">
                <i class="pi pi-briefcase"></i>
                <span>{{ employee.position || '-' }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-building"></i>
                <span>{{ employee.department || '-' }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-envelope"></i>
                <span>{{ employee.email || '-' }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-phone"></i>
                <span>{{ employee.telephone || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="pi pi-calendar"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Hire Date</span>
                <span class="stat-value">{{ employee.hireDate ? (employee.hireDate | date:'mediumDate') : '-' }}</span>              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="pi pi-clock"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Last Login</span>
                <span class="stat-value">{{ employee.lastLogin ? (employee.lastLogin | date:'medium') : 'Never' }}</span>
                </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <button pButton label="Edit" icon="pi pi-user-edit" class="p-button-sm" (click)="editEmployee()"></button>
          <button pButton label="Reset Password" icon="pi pi-key" class="p-button-sm p-button-outlined"></button>
          <button pButton 
                  [label]="employee.active ? 'Deactivate' : 'Activate'" 
                  [icon]="employee.active ? 'pi pi-lock' : 'pi pi-lock-open'" 
                  class="p-button-sm p-button-outlined"
                  (click)="toggleEmployeeStatus()"></button>
          <button pButton label="Permissions" icon="pi pi-shield" class="p-button-sm p-button-outlined"></button>
        </div>

        <!-- Tab View -->
        <p-tabView class="details-tabs">
          <p-tabPanel header="Basic Information" leftIcon="pi pi-user mr-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Personal Info -->
              <p-card header="Personal Information">
                <div class="info-grid">
                  <div class="info-row">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">{{ employee.fullName || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">CIN:</span>
                    <span class="info-value">{{ employee.cin || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Gender:</span>
                    <span class="info-value">{{ employee.gender || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Birth Date:</span>
                    <span class="info-value">{{ employee.birthDate ? (employee.birthDate | date:'mediumDate') : '-' }}</span>                  </div>
                </div>
              </p-card>

              <!-- Employment Info -->
              <p-card header="Employment Information">
                <div class="info-grid">
                  <div class="info-row">
                    <span class="info-label">Employee Code:</span>
                    <span class="info-value">{{ employee.code || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Position:</span>
                    <span class="info-value">{{ employee.position || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Department:</span>
                    <span class="info-value">{{ employee.department || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Hire Date:</span>
                    <span class="stat-value">{{ employee.hireDate ? (employee.hireDate | date:'mediumDate') : '-' }}</span>
                    </div>
                </div>
              </p-card>
            </div>
          </p-tabPanel>

          <p-tabPanel header="Contact Information" leftIcon="pi pi-map-marker mr-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Address Info -->
              <p-card header="Address">
                <div class="info-grid">
                  <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">{{ employee.address || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">City:</span>
                    <span class="info-value">{{ employee.city || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Postal Code:</span>
                    <span class="info-value">{{ employee.postalCode || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Country:</span>
                    <span class="info-value">{{ employee.country || '-' }}</span>
                  </div>
                </div>
              </p-card>

              <!-- Contact Info -->
              <p-card header="Contact Details">
                <div class="info-grid">
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ employee.email || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Secondary Email:</span>
                    <span class="info-value">{{ employee.secondaryEmail || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{{ employee.telephone || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Mobile:</span>
                    <span class="info-value">{{ employee.mobile || '-' }}</span>
                  </div>
                </div>
              </p-card>
            </div>
          </p-tabPanel>

          <p-tabPanel header="Activity Log" leftIcon="pi pi-history mr-2">
            <div class="activity-controls">
              <div class="search-filter">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input pInputText type="text" placeholder="Search activities..." [(ngModel)]="searchText" (input)="filterActivities()" />
                </span>
                <p-dropdown 
                  [options]="activityTypes" 
                  [(ngModel)]="selectedActivityType" 
                  optionLabel="name" 
                  optionValue="code"
                  placeholder="Filter by type"
                  (onChange)="filterActivities()">
                </p-dropdown>
              </div>
            </div>

            <p-table 
              [value]="filteredActivities" 
              [paginator]="true" 
              [rows]="5"
              [rowsPerPageOptions]="[5, 10, 25]"
              styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th pSortableColumn="date">Date <p-sortIcon field="date"></p-sortIcon></th>
                  <th pSortableColumn="action">Action <p-sortIcon field="action"></p-sortIcon></th>
                  <th>Module</th>
                  <th>IP</th>
                  <th>Details</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-activity>
                <tr>
                  <td>{{ activity.date | date:'medium' }}</td>
                  <td>
                    <i [class]="getActionIcon(activity.action)" class="mr-2"></i>
                    {{ activity.action }}
                  </td>
                  <td><p-tag [value]="activity.module" [severity]="getModuleSeverity(activity.module)"></p-tag></td>
                  <td>{{ activity.ip }}</td>
                  <td>{{ activity.details }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="5" class="text-center py-4">
                    No activities found
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: [`
    .employee-management-container {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .content-section {
      margin-top: 1.5rem;
    }

    .profile-header {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 1.5rem;
    }

    .avatar-section {
      position: relative;
      flex-shrink: 0;
    }

    .employee-avatar {
      width: 120px;
      height: 120px;
      font-size: 3rem;
      background-color: #3b82f6;
      color: white;
    }

    .status-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(50%);
    }

    .profile-info {
      flex: 1;
      min-width: 300px;
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #1e293b;
    }

    .info-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
    }

    .detail-item i {
      color: #94a3b8;
    }

    .profile-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 250px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 8px;
    }

    .stat-icon {
      background: #e2e8f0;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .stat-icon i {
      font-size: 1.25rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .quick-actions {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .details-tabs {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .info-label {
      color: #64748b;
      font-weight: 500;
    }

    .info-value {
      color: #1e293b;
      font-weight: 600;
    }

    .activity-controls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .search-filter {
      display: flex;
      gap: 1rem;
      width: 100%;
    }

    /* Table Styles */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8fafc;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: #f8fafc !important;
    }
  `]
})
export class ViewUserComponent {
  employee: Employee = {
    id: 0,
    code: '',
    fullName: '',
    cin: '',
    telephone: '',
    email: '',
    department: '',
    position: '',
    hireDate: new Date(),
    active: false
  };  headerButtons = [
    {
      key: 'back',
      label: 'Back',
      icon: 'pi pi-arrow-left',
      style: { 'background-color': '#000000', 'border-color': '#000000' }
    }
  ];

  // Activity Log
  activityTypes = [
    { code: 'LOGIN', name: 'Logins' },
    { code: 'ACTION', name: 'Actions' },
    { code: 'SETTING', name: 'Settings' },
    { code: 'SECURITY', name: 'Security' }
  ];
  selectedActivityType: string = '';
  searchText: string = '';
  filteredActivities: Activity[] = [];
  activities: Activity[] = [
    {
      date: new Date('2023-10-28T14:32:00'),
      action: 'Login',
      module: 'Authentication',
      ip: '192.168.1.45',
      details: 'Successful login from Chrome on Windows'
    },
    {
      date: new Date('2023-10-28T10:15:00'),
      action: 'Update',
      module: 'Users',
      ip: '192.168.1.45',
      details: 'Updated user permissions for ID: 42'
    },
    {
      date: new Date('2023-10-27T16:45:00'),
      action: 'Create',
      module: 'Products',
      ip: '192.168.1.45',
      details: 'Created new product: Heating System'
    },
    {
      date: new Date('2023-10-26T09:20:00'),
      action: 'Delete',
      module: 'Customers',
      ip: '192.168.1.45',
      details: 'Deleted customer: ID 1234'
    },
    {
      date: new Date('2023-10-25T11:05:00'),
      action: 'Login',
      module: 'Authentication',
      ip: '192.168.1.45',
      details: 'Successful login from Firefox on Windows'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filteredActivities = [...this.activities];
  }

  ngOnInit() {
    // Mock data - in real app, you'd get this from a service
    const mockData = {
      id: 1,
      code: 'EMP-001',
      fullName: 'Mohamed Ben Ali',
      cin: '12345678',
      telephone: '70123456',
      email: 'mohamed.ali@company.com',
      department: 'IT',
      position: 'Senior Developer',
      hireDate: new Date('2022-01-15'),
      lastLogin: new Date('2023-10-28'),
      active: true,
      gender: 'Male',
      birthDate: new Date('1985-03-15'),
      address: '12 Rue Habib Bourguiba',
      city: 'Tunis',
      postalCode: '1002',
      country: 'Tunisia',
      secondaryEmail: 'm.benali@personal.com',
      mobile: '98123456'
    };
  
    this.employee = {
      ...this.employee, // Defaults
      ...mockData      // Override with mock data
    };
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/User']);
  }

  editEmployee() {
    if (this.employee) {
      this.router.navigate(['/Gescom/frontOffice/User/edit', this.employee.id]);
    }
  }

  toggleEmployeeStatus() {
    if (this.employee) {
      this.employee.active = !this.employee.active;
    }
  }

  filterActivities() {
    this.filteredActivities = this.activities.filter(item => {
      const matchesType = !this.selectedActivityType || item.module === this.selectedActivityType;
      const matchesSearch = !this.searchText || 
        item.action.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.module.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesType && matchesSearch;
    });
  }

  getActionIcon(action: string): string {
    switch(action) {
      case 'Login': return 'pi pi-sign-in text-green-500';
      case 'Update': return 'pi pi-pencil text-blue-500';
      case 'Create': return 'pi pi-plus-circle text-purple-500';
      case 'Delete': return 'pi pi-trash text-red-500';
      default: return 'pi pi-info-circle text-gray-500';
    }
  }

  getModuleSeverity(module: string): string {
    switch(module) {
      case 'Authentication': return 'success';
      case 'Users': return 'info';
      case 'Products': return 'warning';
      case 'Customers': return 'danger';
      case 'Settings': return '';
      case 'Security': return 'danger';
      default: return '';
    }
  }
}