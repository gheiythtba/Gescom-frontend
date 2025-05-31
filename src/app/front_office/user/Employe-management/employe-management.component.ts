import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';
import { DataTableComponent } from '../../Reusable-component/data-table.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router } from '@angular/router';

interface StatusTab extends MenuItem {
  key: 'all' | 'active' | 'inactive';
}

interface Permission {
  name: string;
  code: string;
  category: string;
  description?: string;
}

interface Employee {
  id: number;
  code: string;
  fullName: string;
  cin: string;
  telephone: string;
  email: string;
  department: string;
  position: string;
  permissions: Permission[];
  hireDate: Date;
  lastLogin?: Date;
  active: boolean;
  avatar?: string;
}

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TooltipModule,
    TabMenuModule, CardModule, ProgressBarModule,
    HeaderBarComponent, DataTableComponent, TagModule,
    DialogModule, MultiSelectModule, FormsModule,
    DropdownModule, AvatarModule, InputSwitchModule,
    BadgeModule, DividerModule
  ],
  template: `
    <div class="employee-management-container">
      <!-- Header Section -->
      <div class="header-section">
        <app-header-bar
          [title]="'Employee Management'"
          [buttons]="headerButtons"
          [subtitle]="'Manage employee access and permissions'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <!-- Total Employees -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Total Employees</span>
              <span class="stat-value">{{ totalEmployees }}</span>
              <div class="stat-meta">
                <span class="active-count">{{ activeEmployees }} active</span>
                <span class="inactive-count">{{ inactiveEmployees }} inactive</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-users"></i>
            </div>
          </div>
        </div>

        <!-- New Hires -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">New Hires (30d)</span>
              <span class="stat-value">{{ newEmployeesThisMonth }}</span>
              <div class="stat-progress">
                <p-progressBar 
                  [value]="newHiresPercentage" 
                  [showValue]="false" 
                  styleClass="h-1">
                </p-progressBar>
                <span class="progress-text">{{ newHiresPercentage }}% of total</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-user-plus"></i>
            </div>
          </div>
        </div>

        <!-- Departments -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Departments</span>
              <span class="stat-value">{{ departments.length }}</span>
              <div class="stat-meta">
                <span class="main-department">Main: {{ largestDepartment.name }}</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-sitemap"></i>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-text">
              <span class="stat-label">Active Permissions</span>
              <span class="stat-value">{{ totalActivePermissions }}</span>
              <div class="stat-meta">
                <span class="admin-count">{{ adminCount }} admins</span>
              </div>
            </div>
            <div class="stat-icon">
              <i class="pi pi-key"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="table-section">
        <app-data-table
          [data]="filteredEmployees"
          [columns]="tableColumns"
          [tabs]="statusTabs"
          [activeTab]="activeStatusTab"
          (tabChanged)="onStatusFilterChange($event)"
          (search)="onSearch($event)">
          
          <ng-template #actionTemplate let-row>
            <div class="action-buttons">
              <button pButton severity="info" icon="pi pi-eye" 
                      class="action-button view-button"
                      (click)="viewEmployee(row)"></button>
              <button pButton severity="warn" icon="pi pi-pencil" 
                      class="action-button edit-button"
                      (click)="editEmployee(row)"></button>
              <button pButton icon="pi pi-key" 
                      class="action-button permissions-button"
                      (click)="managePermissions(row)"></button>
              <p-inputSwitch [(ngModel)]="row.active" 
                            (onChange)="toggleEmployeeStatus(row)"
                            class="status-switch"></p-inputSwitch>
            </div>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Permission Management Dialog -->
      <p-dialog header="Manage Permissions" 
                [(visible)]="showPermissionDialog" 
                [style]="{width: '50vw'}"
                [modal]="true"
                [dismissableMask]="true"
                [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
                styleClass="permission-dialog">
        <ng-template pTemplate="header">
          <div class="dialog-header">
            <p-avatar *ngIf="selectedEmployee" 
                     [label]="selectedEmployee.fullName.charAt(0)" 
                     size="large" 
                     shape="circle"
                     styleClass="employee-avatar"></p-avatar>
            <div class="employee-info">
              <h3>{{ selectedEmployee?.fullName || '' }}</h3>
              <span class="employee-position">{{ selectedEmployee?.position }}</span>
            </div>
          </div>
        </ng-template>

        <div *ngIf="selectedEmployee" class="dialog-content">
          <!-- Basic Information Section -->
          <div class="section">
            <h4 class="section-title">Employee Information</h4>
            <p-divider></p-divider>
            <div class="form-grid">
              <div class="field">
                <label>Department</label>
                <p-dropdown [options]="departments" 
                           [(ngModel)]="selectedEmployee.department" 
                           optionLabel="name"
                           optionValue="value"
                           placeholder="Select department"
                           [showClear]="true"
                           appendTo="body">
                </p-dropdown>
              </div>
              <div class="field">
                <label>Position</label>
                <input pInputText [(ngModel)]="selectedEmployee.position" 
                      placeholder="Enter position">
              </div>
              <div class="field status-field">
                <label>Status</label>
                <p-tag [value]="selectedEmployee.active ? 'Active' : 'Inactive'" 
                      [severity]="selectedEmployee.active ? 'success' : 'danger'"
                      class="status-tag">
                </p-tag>
              </div>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="section">
            <h4 class="section-title">Access Permissions</h4>
            <p-divider></p-divider>
            <div class="permissions-selector">
              <p-multiSelect [options]="groupedPermissions" 
                            [(ngModel)]="selectedEmployee.permissions" 
                            optionLabel="name"
                            [group]="true"
                            [filter]="true"
                            display="chip"
                            placeholder="Select permissions"
                            appendTo="body"
                            [panelStyle]="{minWidth: '100%'}">
                <ng-template let-group pTemplate="group">
                  <div class="permission-group">
                    <span class="group-label">{{ group.label }}</span>
                    <p-badge [value]="group.items.length" 
                            severity="info" 
                            size="small"
                            class="group-badge">
                    </p-badge>
                  </div>
                </ng-template>
                <ng-template let-permission pTemplate="item">
                  <div class="permission-item">
                    <span class="permission-name">{{ permission.name }}</span>
                    <span *ngIf="permission.description" class="permission-description">
                      {{ permission.description }}
                    </span>
                  </div>
                </ng-template>
              </p-multiSelect>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button pButton label="Reset" 
                    icon="pi pi-refresh"
                    class="p-button-text reset-button"
                    (click)="resetPermissions()"></button>
            <div class="action-buttons">
              <button pButton label="Cancel" 
                      icon="pi pi-times"
                      class="p-button-outlined cancel-button"
                      (click)="showPermissionDialog = false"></button>
              <button pButton label="Save" 
                      icon="pi pi-check"
                      class="save-button"
                      (click)="savePermissions()"></button>
            </div>
          </div>
        </ng-template>
      </p-dialog>
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .stat-text {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
    }

    .active-count {
      color: #10b981;
    }

    .inactive-count {
      color: #64748b;
    }

    .main-department {
      color: #6366f1;
    }

    .admin-count {
      color: #f59e0b;
    }

    .stat-progress {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .stat-icon {
      background-color: #f1f5f9;
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

    .table-section {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .action-button {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-switch {
      margin-left: 0.5rem;
    }

    /* Permission Dialog Styles */
    .permission-dialog .p-dialog-header {
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .employee-avatar {
      background-color: #6366f1;
      color: white;
    }

    .employee-info {
      display: flex;
      flex-direction: column;
    }

    .employee-info h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .employee-position {
      color: #64748b;
      font-size: 0.875rem;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-title {
      margin: 0;
      font-size: 1rem;
      color: #1e293b;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .status-field {
      align-items: flex-start;
    }

    .status-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .permissions-selector {
      width: 100%;
    }

    .permission-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .group-label {
      font-weight: 600;
      color: #1e293b;
    }

    .group-badge {
      font-size: 0.625rem;
    }

    .permission-item {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
    }

    .permission-name {
      font-weight: 500;
    }

    .permission-description {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .reset-button {
      color: #64748b;
    }

    .cancel-button {
      color: #64748b;
      border-color: #cbd5e1;
    }

    .save-button {
      background-color: #3b82f6;
      border-color: #3b82f6;
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
      background-color: #f8fafc;
    }

    /* Progress Bar */
    :host ::ng-deep .p-progressbar {
      background-color: #e2e8f0;
      height: 6px;
      border-radius: 3px;
    }

    :host ::ng-deep .p-progressbar .p-progressbar-value {
      background-color: #10b981;
      border-radius: 3px;
    }
  `]
})
export class EmployeeManagementComponent {
  constructor(
    private route: ActivatedRoute,  
    private router: Router
  ) {}

  employees: Employee[] = [
    {
      id: 1,
      code: 'EMP-001',
      fullName: 'Mohamed Ben Ali',
      cin: '12345678',
      telephone: '70123456',
      email: 'mohamed.ali@company.com',
      department: 'IT',
      position: 'Senior Developer',
      permissions: [
        { name: 'Dashboard Access', code: 'dashboard_view', category: 'General' },
        { name: 'Edit Products', code: 'products_edit', category: 'Inventory' }
      ],
      hireDate: new Date('2022-01-15'),
      lastLogin: new Date('2023-10-28'),
      active: true
    },
    {
      id: 2,
      code: 'EMP-002',
      fullName: 'Fatma Karray',
      cin: '87654321',
      telephone: '98123456',
      email: 'fatma.karray@company.com',
      department: 'Finance',
      position: 'Accountant',
      permissions: [
        { name: 'Dashboard Access', code: 'dashboard_view', category: 'General' },
        { name: 'View Reports', code: 'reports_view', category: 'Finance' },
        { name: 'Export Data', code: 'data_export', category: 'Finance' }
      ],
      hireDate: new Date('2022-03-20'),
      active: true
    },
    {
      id: 3,
      code: 'EMP-003',
      fullName: 'System Admin',
      cin: '11223344',
      telephone: '23123456',
      email: 'admin@company.com',
      department: 'IT',
      position: 'Administrator',
      permissions: [
        { name: 'Full Access', code: 'admin_all', category: 'Administration' },
        { name: 'Manage Users', code: 'users_manage', category: 'Administration' }
      ],
      hireDate: new Date('2021-05-10'),
      lastLogin: new Date('2023-10-29'),
      active: true
    }
  ];

  filteredEmployees = [...this.employees];
  searchTerm: string = '';
  
  statusTabs: StatusTab[] = [
    { label: 'All', key: 'all' },
    { label: 'Active', key: 'active' },
    { label: 'Inactive', key: 'inactive' }
  ];
  activeStatusTab = this.statusTabs[0];

  // Permission Management
  showPermissionDialog = false;
  selectedEmployee: Employee | null = null;
  
  // All available permissions
  allPermissions: Permission[] = [
    // General Permissions
    { 
      name: 'Dashboard Access', 
      code: 'dashboard_view', 
      category: 'General',
      description: 'Access to main dashboard' 
    },
    { 
      name: 'Notifications', 
      code: 'notifications', 
      category: 'General',
      description: 'Receive system notifications' 
    },
    
    // Finance Permissions
    { 
      name: 'View Reports', 
      code: 'reports_view', 
      category: 'Finance',
      description: 'View financial reports' 
    },
    { 
      name: 'Export Data', 
      code: 'data_export', 
      category: 'Finance',
      description: 'Export data to CSV/Excel' 
    },
    { 
      name: 'Manage Invoices', 
      code: 'invoices_manage', 
      category: 'Finance',
      description: 'Create and edit invoices' 
    },
    
    // Inventory Permissions
    { 
      name: 'View Inventory', 
      code: 'inventory_view', 
      category: 'Inventory',
      description: 'View stock levels' 
    },
    { 
      name: 'Edit Products', 
      code: 'products_edit', 
      category: 'Inventory',
      description: 'Modify product catalog' 
    },
    { 
      name: 'Manage Stock', 
      code: 'stock_manage', 
      category: 'Inventory',
      description: 'Update stock quantities' 
    },
    
    // Sales Permissions
    { 
      name: 'View Clients', 
      code: 'clients_view', 
      category: 'Sales',
      description: 'View client list' 
    },
    { 
      name: 'Manage Orders', 
      code: 'orders_manage', 
      category: 'Sales',
      description: 'Create and edit orders' 
    },
    
    // Administration Permissions
    { 
      name: 'Manage Users', 
      code: 'users_manage', 
      category: 'Administration',
      description: 'Create/edit user accounts' 
    },
    { 
      name: 'System Settings', 
      code: 'system_settings', 
      category: 'Administration',
      description: 'Modify system settings' 
    },
    { 
      name: 'Full Access', 
      code: 'admin_all', 
      category: 'Administration',
      description: 'Complete access to all features' 
    }
  ];

  headerButtons = [
    {
      key: 'back',
      label: 'Back',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    },
    {
      key: 'export',
      label: 'Export',
      icon: 'pi pi-file-export',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    },
    {
      key: 'add',
      label: 'Add',
      icon: 'pi pi-plus',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  tableColumns = [
    { field: 'code', header: 'Code' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'department', header: 'Department' },
    { field: 'position', header: 'Position' },
    { 
      field: 'lastLogin', 
      header: 'Last Login',
      body: (employee: Employee) => {
        if (!employee.lastLogin) return 'Never';
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(employee.lastLogin, 'MM/dd/yyyy HH:mm') || 'N/A';
      }
    },
    { 
      field: 'active', 
      header: 'Status',
      body: (employee: Employee) => {
        return employee.active ? 
          '<span class="text-green-500 font-medium">Active</span>' : 
          '<span class="text-red-500 font-medium">Inactive</span>';
      }
    },
    { field: 'actions', header: 'Actions', isTemplate: true }
  ];

  // Statistics
  get totalEmployees(): number {
    return this.employees.length;
  }

  get activeEmployees(): number {
    return this.employees.filter(e => e.active).length;
  }

  get inactiveEmployees(): number {
    return this.employees.filter(e => !e.active).length;
  }

  get departments(): {name: string, value: string}[] {
    const depts = Array.from(new Set(this.employees.map(e => e.department)));
    return depts.map(d => ({ name: d, value: d }));
  }

  get largestDepartment(): {name: string, count: number} {
    const counts = this.employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const [name, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { name, count };
  }

  get totalActivePermissions(): number {
    return this.employees.reduce((sum, emp) => sum + emp.permissions.length, 0);
  }

  get adminCount(): number {
    return this.employees.filter(emp => 
      emp.permissions.some(p => p.code === 'admin_all')).length;
  }

  get newEmployeesThisMonth(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.employees.filter(e => e.hireDate > oneMonthAgo).length;
  }

  get newHiresPercentage(): number {
    return Math.round((this.newEmployeesThisMonth / this.totalEmployees) * 100);
  }

  // Group permissions for the MultiSelect component
  get groupedPermissions(): any[] {
    const groups: any = {};
    
    this.allPermissions.forEach(permission => {
      if (!groups[permission.category]) {
        groups[permission.category] = {
          label: permission.category,
          items: []
        };
      }
      groups[permission.category].items.push(permission);
    });
    
    return Object.values(groups);
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/User']);
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
    this.applyFilters();
  }

  onStatusFilterChange(tab: MenuItem) {
    this.activeStatusTab = tab as StatusTab;
    this.applyFilters();
  }

  applyFilters() {
    // First apply status filter
    let filtered = [...this.employees];
    
    switch(this.activeStatusTab.key) {
      case 'active':
        filtered = filtered.filter(e => e.active);
        break;
      case 'inactive':
        filtered = filtered.filter(e => !e.active);
        break;
    }

    // Then apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(employee => 
        employee.code.toLowerCase().includes(this.searchTerm) ||
        employee.fullName.toLowerCase().includes(this.searchTerm) ||
        employee.cin.toLowerCase().includes(this.searchTerm) ||
        employee.telephone.toLowerCase().includes(this.searchTerm) ||
        employee.email.toLowerCase().includes(this.searchTerm) ||
        employee.department.toLowerCase().includes(this.searchTerm) ||
        employee.position.toLowerCase().includes(this.searchTerm) ||
        (employee.lastLogin && 
          employee.lastLogin.toLocaleDateString().toLowerCase().includes(this.searchTerm)) ||
        employee.permissions.some(p => 
          p.name.toLowerCase().includes(this.searchTerm) ||
          p.code.toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredEmployees = filtered;
  }

  viewEmployee(employee: Employee) {
    this.router.navigate(['/Gescom/frontOffice/User/view', employee.id]);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/Gescom/frontOffice/User/edit', employee.id]);
  }

  managePermissions(employee: Employee) {
    this.selectedEmployee = {...employee};
    this.showPermissionDialog = true;
  }

  savePermissions() {
    if (!this.selectedEmployee) return;
    
    const index = this.employees.findIndex(e => e.id === this.selectedEmployee!.id);
    if (index !== -1) {
      this.employees[index] = {...this.selectedEmployee};
      this.applyFilters();
    }
    
    this.showPermissionDialog = false;
    this.selectedEmployee = null;
  }

  resetPermissions() {
    if (this.selectedEmployee) {
      this.selectedEmployee.permissions = [];
    }
  }

  toggleEmployeeStatus(employee: Employee) {
    employee.active = !employee.active;
    this.applyFilters();
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.goBack();
    } else if (key === 'add') {
      console.log('Add new employee');
    } else if (key === 'export') {
      console.log('Export employees');
    }
  }
}