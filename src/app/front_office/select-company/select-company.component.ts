import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-company',
  standalone: true,
  imports: [ 
    TableModule, 
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    DatePipe
  ],
  template: `
  <div class="flex flex-col mx-4 mt-4">
    <!-- Header Section -->
    <div class="card mb-4 p-4 border-b border-black border-opacity-50 border-b-[0.5px]">
      <div class="flex items-center gap-4">
        <h2 class="font-semibold text-3xl m-0 text-[#192F67]">Companies</h2>
        <button pButton type="button" 
                label="Create Company" 
                icon="pi pi-plus" 
                styleClass="ml-2 h-8"
                [style]="{'background-color': '#192F67', 'border-color': '#192F67'}"
                (click)="showCreateDialog()"></button>
      </div>
    </div>

    <!-- Create Company Dialog -->
   <!-- In your template section -->
<p-dialog header="Create New Company" 
          [(visible)]="displayCreateDialog" 
          [style]="{width: '500px'}" 
          [modal]="true"
          [draggable]="false"
          [resizable]="false">
  
  <!-- Dialog Content -->
  <div class="dialog-content">
    <!-- Company Name -->
    <div class="field mb-4">
      <label for="companyName" class="block mb-2 font-medium">Company Name *</label>
      <input id="companyName" type="text" pInputText [(ngModel)]="newCompany.name" 
             class="w-full" required />
      <small *ngIf="submitted && !newCompany.name" class="p-error block mt-1">
        Company name is required
      </small>
    </div>
    
    <!-- Activity -->
    <div class="field mb-4">
      <label for="companyActivity" class="block mb-2 font-medium">Activity *</label>
      <input id="companyActivity" type="text" pInputText [(ngModel)]="newCompany.activity" 
             class="w-full" required />
      <small *ngIf="submitted && !newCompany.activity" class="p-error block mt-1">
        Activity is required
      </small>
    </div>
    
    <!-- Two-column row -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Responsible -->
      <div class="field mb-4">
        <label for="responsiblePerson" class="block mb-2 font-medium">Responsible</label>
        <input id="responsiblePerson" type="text" pInputText [(ngModel)]="newCompany.responsible" 
               class="w-full" />
      </div>
      
      <!-- Location -->
      <div class="field mb-4">
        <label for="companyLocation" class="block mb-2 font-medium">Location</label>
        <input id="companyLocation" type="text" pInputText [(ngModel)]="newCompany.location" 
               class="w-full" />
      </div>
    </div>
  </div>

  <!-- Dialog Footer -->
  <ng-template pTemplate="footer">
    <div class="flex justify-between">
      <button pButton type="button" 
              label="Cancel" 
              icon="pi pi-times" 
              (click)="closeDialog()"
              class="p-button-text"></button>
      
      <button pButton type="button" 
              label="Create Company" 
              icon="pi pi-plus" 
              (click)="createCompany()"
              [style]="{'background-color': '#192F67', 'border-color': '#192F67'}"></button>
    </div>
  </ng-template>
</p-dialog>

    <!-- Search and Table Section -->
    <div class="card p-4">
      <div class="flex justify-start mb-4">
        <p-inputgroup [style]="{'width': '300px'}">
          <p-inputgroup-addon>
            <i class="pi pi-search"></i>
          </p-inputgroup-addon>
          <input pInputText 
                 type="text" 
                 [(ngModel)]="searchText"
                 (input)="filterCompanies()"
                 placeholder="Search companies..."
                 [style]="{'border-color': '#192F67'}"/>
        </p-inputgroup>
      </div>

      <p-table [value]="filteredCompanies" 
               [paginator]="true" 
               [rows]="7" 
               [rowsPerPageOptions]="[7,10,20]"
               styleClass="p-datatable-striped p-datatable-gridlines"
               selectionMode="single"
               [(selection)]="selectedCompany"
               (onRowSelect)="onCompanySelect($event)"
               [tableStyle]="{ 'min-width': '50rem', 'border': '1px solid #e5e7eb' }">
        <ng-template pTemplate="header">
          <tr class="bg-gray-100">
            <th style="width:15%; text-align: center">Logo</th>
            <th style="width:20%; text-align: center">Company</th>
            <th style="width:20%; text-align: center">Activity</th>
            <th style="width:15%; text-align: center">Responsible</th>
            <th style="width:15%; text-align: center">Location</th>
            <th style="width:15%; text-align: center">Creation Date</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-company>
          <tr [pSelectableRow]="company">
            <td style="text-align: center">
              <img [src]="getCompanyImage(company.code)" 
                   alt="Company Logo" 
                   class="w-10 h-10 object-contain">
            </td>
            <td style="text-align: center">{{ company.name }}</td>
            <td style="text-align: center">{{ company.activity }}</td>
            <td style="text-align: center">{{ company.responsible }}</td>
            <td style="text-align: center">{{ company.location }}</td>
            <td style="text-align: center">{{ company.creationDate | date:'mediumDate' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f3f4f6 !important;
      border: 1px solid #e5e7eb !important;
      text-align: center !important;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      border: 1px solid #e5e7eb !important;
    }
    :host ::ng-deep .p-inputtext:enabled:hover {
      border-color: #192F67 !important;
    }
    :host ::ng-deep .p-inputtext:enabled:focus {
      box-shadow: 0 0 0 0.2rem rgba(25, 47, 103, 0.2) !important;
      border-color: #192F67 !important;
    }
    :host ::ng-deep .p-inputgroup-addon {
      background-color: #192F67 !important;
      color: white !important;
      border-color: #192F67 !important;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr.p-highlight {
      background-color: #e6e9ff !important;
    }
  `]
})
export class SelectCompanyComponent {
  searchText: string = '';
  filteredCompanies: any[] = [];
  selectedCompany: any;
  displayCreateDialog: boolean = false;
  submitted: boolean = false;
  
  newCompany: any = {
    name: '',
    activity: '',
    responsible: '',
    location: ''
  };

  companies = [
    {
      code: 'C001',
      name: 'Apple Inc.',
      activity: 'Technology',
      responsible: 'Tim Cook',
      location: 'Cupertino, CA',
      creationDate: new Date(1976, 3, 1),
      logo: 'https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg'
    },
    {
      code: 'C002',
      name: 'Samsung Electronics',
      activity: 'Electronics',
      responsible: 'Jong-Hee Han',
      location: 'Seoul, South Korea',
      creationDate: new Date(1969, 0, 13),
      logo: 'https://img.freepik.com/premium-vector/threads-icon-symbol-logo-vector_75079-151.jpg?ga=GA1.1.703581472.1746492322&w=740'   
    },
    {
      code: 'C003',
      name: 'Sony Corporation',
      activity: 'Entertainment',
      responsible: 'Kenichiro Yoshida',
      location: 'Tokyo, Japan',
      creationDate: new Date(1946, 4, 7),
      logo: 'https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg'
    },
    {
      code: 'C004',
      name: 'IKEA Group',
      activity: 'Retail',
      responsible: 'Jesper Brodin',
      location: 'Delft, Netherlands',
      creationDate: new Date(1943, 6, 28),
      logo: 'https://img.freepik.com/premium-vector/eh-calligraphic-signature-vector-logo-design-with-circle-gold-color-leaf-flower_1119385-142.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C005',
      name: 'Staples Inc.',
      activity: 'Office Supplies',
      responsible: 'John Lederer',
      location: 'Framingham, MA',
      creationDate: new Date(1986, 0, 1),
      logo: 'https://img.freepik.com/free-vector/luxurious-golden-logo-template_23-2148843539.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C006',
      name: 'Nespresso SA',
      activity: 'Food & Beverage',
      responsible: 'Guillaume Le Cunff',
      location: 'Lausanne, Switzerland',
      creationDate: new Date(1986, 0, 1),
      logo: 'https://img.freepik.com/free-psd/3d-mirror-logo-dark-concrete-background_47987-27879.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C007',
      name: 'Belkin International',
      activity: 'Consumer Electronics',
      responsible: 'Steve Malony',
      location: 'Playa Vista, CA',
      creationDate: new Date(1983, 0, 1),
      logo: 'https://img.freepik.com/free-vector/flat-design-nf-fn-logo-template_23-2149242948.jpg?t=st=1746492470~exp=1746496070~hmac=6b957c03f93a9eb5913dcea72505a0420326d46731fae9aa72636d87de0466cf&w=740'
    },
    {
      code: 'C001',
      name: 'Apple Inc.',
      activity: 'Technology',
      responsible: 'Tim Cook',
      location: 'Cupertino, CA',
      creationDate: new Date(1976, 3, 1),
      logo: 'https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg'
    },
    {
      code: 'C002',
      name: 'Samsung Electronics',
      activity: 'Electronics',
      responsible: 'Jong-Hee Han',
      location: 'Seoul, South Korea',
      creationDate: new Date(1969, 0, 13),
      logo: 'https://img.freepik.com/premium-vector/threads-icon-symbol-logo-vector_75079-151.jpg?ga=GA1.1.703581472.1746492322&w=740'   
    },
    {
      code: 'C003',
      name: 'Sony Corporation',
      activity: 'Entertainment',
      responsible: 'Kenichiro Yoshida',
      location: 'Tokyo, Japan',
      creationDate: new Date(1946, 4, 7),
      logo: 'https://img.freepik.com/premium-vector/twitch-icon-symbol-logo-vector_75079-153.jpg'
    },
    {
      code: 'C004',
      name: 'IKEA Group',
      activity: 'Retail',
      responsible: 'Jesper Brodin',
      location: 'Delft, Netherlands',
      creationDate: new Date(1943, 6, 28),
      logo: 'https://img.freepik.com/premium-vector/eh-calligraphic-signature-vector-logo-design-with-circle-gold-color-leaf-flower_1119385-142.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C005',
      name: 'Staples Inc.',
      activity: 'Office Supplies',
      responsible: 'John Lederer',
      location: 'Framingham, MA',
      creationDate: new Date(1986, 0, 1),
      logo: 'https://img.freepik.com/free-vector/luxurious-golden-logo-template_23-2148843539.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C006',
      name: 'Nespresso SA',
      activity: 'Food & Beverage',
      responsible: 'Guillaume Le Cunff',
      location: 'Lausanne, Switzerland',
      creationDate: new Date(1986, 0, 1),
      logo: 'https://img.freepik.com/free-psd/3d-mirror-logo-dark-concrete-background_47987-27879.jpg?ga=GA1.1.703581472.1746492322&semt=ais_hybrid&w=740'
    },
    {
      code: 'C007',
      name: 'Belkin International',
      activity: 'Consumer Electronics',
      responsible: 'Steve Malony',
      location: 'Playa Vista, CA',
      creationDate: new Date(1983, 0, 1),
      logo: 'https://img.freepik.com/free-vector/flat-design-nf-fn-logo-template_23-2149242948.jpg?t=st=1746492470~exp=1746496070~hmac=6b957c03f93a9eb5913dcea72505a0420326d46731fae9aa72636d87de0466cf&w=740'
    }
  ];
  constructor(private router: Router) {
    this.filteredCompanies = [...this.companies];
  }

  showCreateDialog() {
    this.submitted = false;
    this.displayCreateDialog = true;
  }
  closeDialog() {
    this.displayCreateDialog = false;
    this.submitted = false;
    this.resetForm();
  }
  resetForm() {
    this.newCompany = {
      name: '',
      activity: '',
      responsible: '',
      location: ''
    };}

  createCompany() {
    this.submitted = true;
    
    // Validate required fields
    if (!this.newCompany.name || !this.newCompany.activity) {
      return;
    }
  
    // Generate a new company code
    const newCode = 'C' + (this.companies.length + 1).toString().padStart(3, '0');
    
    // Add the new company
    this.companies.unshift({
      code: newCode,
      ...this.newCompany,
      creationDate: new Date(),
      logo: 'https://images2.imgbox.com/2b/6b/8Lft0q6W_o.png'
    });
  
    // Close and reset
    this.closeDialog();
    this.filterCompanies();
  }

  onCompanySelect(event: any) {
    this.router.navigate(['/Gescom/dashboard'], { 
      state: { selectedCompany: this.selectedCompany }
    });
  }

  getCompanyImage(code: string): string {
    const company = this.companies.find(c => c.code === code);
    return company?.logo || 'https://images2.imgbox.com/2b/6b/8Lft0q6W_o.png';
  }

  filterCompanies() {
    if (!this.searchText) {
      this.filteredCompanies = [...this.companies];
      return;
    }
    
    const searchTerm = this.searchText.toLowerCase();
    this.filteredCompanies = this.companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm) ||
      company.activity.toLowerCase().includes(searchTerm) ||
      company.responsible.toLowerCase().includes(searchTerm) ||
      company.location.toLowerCase().includes(searchTerm)
    );
  }
}