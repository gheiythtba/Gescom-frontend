import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferItem, TransferItemArticle } from '../bon-de-transfert.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { HeaderBarComponent, HeaderButton } from '../../../Reusable-component/header-bar.component';

@Component({
  selector: 'app-transfer-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePipe,HeaderBarComponent],
  template: `


<div class="p-4">
      <app-header-bar
        title="Bon de Transfert"
        subtitle="Visualisation du fichier d'entrepôt"
        [buttons]="headerButtons"
        (buttonClick)="onHeaderButtonClick($event)">
      </app-header-bar>

    <div class="transfer-document printable-content">
      <!-- Company Header -->
      <div class="company-header">
        <div class="company-name">ENCENTE LA CITY IVANDRY</div>
        <div class="company-address">Magasin Toamasina - Boulevard Ausagneur - Toamasina</div>
        <div class="company-contacts">
          <span>Tel: 020 22 499 00</span>
          <span>Mobile: 0320502829 - 0340202829</span>
          <span>Mobile: 0321143881 - 0332315060 - 0340245688</span>
        </div>
        <div class="company-email">Mail : compta&#64;sirr.mg</div>
        <div class="company-details">
          <div>CIF : 0243008 /DGI-K du 08/08/2023</div>
          <div>STAT : 24101 11 2000 0 10023 du 17/01/2000</div>
          <div>NIF : 10 000 22 111 du 17/01/2000</div>
        </div>
      </div>

      <!-- Document Title -->
      <div class="document-title">Bon de transfert</div>

      <!-- Document References -->
      <div class="document-references">
        <div><strong>Bon de transfert :</strong> {{transfer?.reference}}</div>
        <div><strong>Document d'origine :</strong> {{transfer?.originDocument}}</div>
      </div>

      <!-- Transfer Dates -->
      <table class="dates-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Date commande</th>
            <th>Date d'expédition</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{transfer?.reference}}</td>
            <td>{{transfer?.orderDate | date:'dd/MM/yyyy'}}</td>
            <td>{{transfer?.shipmentDate | date:'dd/MM/yyyy'}}</td>
          </tr>
        </tbody>
      </table>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Réf Fournisseur</th>
            <th>De</th>
            <th>A</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of transferItems">
            <td>
              <div class="item-code">[{{item.code}}]</div>
              <div class="item-description">{{item.designation}}</div>
            </td>
            <td>{{item.supplierReference}}</td>
            <td>{{transfer?.sourceWarehouse}}</td>
            <td>{{transfer?.destinationWarehouse}}</td>
            <td class="text-right">{{item.quantity}} {{item.unit}}</td>
          </tr>
        </tbody>
      </table>

      <!-- Validation Section -->
      <div class="validation-section">
        <div class="validation-row">
          <div class="validation-label">Dépôt source Magasinier</div>
          <div class="signature-line"></div>
          <div class="validation-date">Date: {{today | date:'dd/MM/yyyy'}}</div>
        </div>
        <div class="validation-row">
          <div class="validation-label">Dépôt source Sécurité</div>
          <div class="signature-line"></div>
          <div class="validation-date">Date: {{today | date:'dd/MM/yyyy'}}</div>
        </div>
        <div class="validation-row">
          <div class="validation-label">Dépôt destination Magasinier</div>
          <div class="signature-line"></div>
          <div class="validation-date">Date: {{today | date:'dd/MM/yyyy'}}</div>
        </div>
        <div class="validation-row">
          <div class="validation-label">Dépôt destination Sécurité</div>
          <div class="signature-line"></div>
          <div class="validation-date">Date: {{today | date:'dd/MM/yyyy'}}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="document-footer">
        Document généré le {{today | date:'dd/MM/yyyy à HH:mm'}}
      </div>
    </div>
    </div>

  `,
  styles: [`
 :host {
      display: block;
      background-color: #f8fafc;
    }


    .print-actions {
      margin-bottom: 20px;
      text-align: right;
      padding: 10px;
    }

    .transfer-document {
      background: white;
      padding: 15px;
      border: 1px solid #ddd;
      max-width: 210mm;
      margin: 0 auto;
    }

    .company-header {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
    }

    .company-name {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 5px;
    }

    .company-address {
      font-size: 14px;
      margin-bottom: 5px;
    }

    .company-contacts {
      font-size: 13px;
      margin-bottom: 5px;
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .company-email {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .company-details {
      font-size: 12px;
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .document-title {
      font-weight: bold;
      text-align: center;
      font-size: 16px;
      margin: 15px 0;
      text-decoration: underline;
    }

    .document-references {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 13px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }

    th, td {
      border: 1px solid #000;
      padding: 5px;
      text-align: left;
    }

    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .text-right {
      text-align: right;
    }

    .item-code {
      font-weight: bold;
    }

    .item-description {
      font-size: 11px;
    }

    .validation-section {
      margin-top: 30px;
    }

    .validation-row {
      display: flex;
      margin-bottom: 25px;
      align-items: flex-end;
    }

    .validation-label {
      width: 200px;
      font-weight: bold;
    }

    .signature-line {
      flex-grow: 1;
      border-bottom: 1px solid #000;
      margin: 0 10px;
      height: 1em;
    }

    .validation-date {
      width: 100px;
    }

    .document-footer {
      text-align: center;
      font-size: 11px;
      margin-top: 20px;
      border-top: 1px solid #000;
      padding-top: 5px;
    }

    @media print {
      /* Hide all non-printable elements */
      .non-printable {
        display: none !important;
      }

      /* Reset body styles */
      body, html, app-root {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }

      /* Style the printable content */
      .printable-content {
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .transfer-document {
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
      }

      /* Page settings */
      @page {
        size: A4;
        margin: 10mm;
      }

      /* Ensure tables don't break across pages */
      table {
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  `]
})
export class TransferDetailsComponent implements OnInit {
  transfer: TransferItem | null = null;
  transferItems: TransferItemArticle[] = [];
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const transferId = this.route.snapshot.paramMap.get('id');
    // Mock data - replace with actual API call
    this.transfer = {
      id: 1,
      reference: 'DPA/OUT/2414077',
      originDocument: 'TRAN/WH/32626',
      sourceWarehouse: 'Transition/Notifié',
      destinationWarehouse: 'Magasin Principal',
      status: 'completed',
      orderDate: new Date('2023-12-23'),
      shipmentDate: new Date(),
      creationDate: new Date('2023-12-22'),
      itemsCount: 2,
      items: [
        {
          id: 1,
          code: '50215',
          designation: 'MORTIER D IMPERMEABILISATION IZOLATEX PLUS - 20KG - A (POUDRE)',
          supplierReference: 'DPA/Slock',
          quantity: 2,
          unit: 'Sac'
        },
        {
          id: 2,
          code: '50216',
          designation: 'MORTIER D IMPERMEABILISATION IZOLATEX PLUS - 10L - B (LIQUIDE)',
          supplierReference: 'DPA/Slock',
          quantity: 1,
          unit: 'Eldon'
        }
      ],
      companyDetails: {
        name: 'ENCENTE LA CITY IVANDRY',
        address: 'Magasin Toamasina - Boulevard Ausagneur - Toamasina',
        phone: '020 22 499 00',
        mobiles: ['0320502829', '0340202829', '0321143881', '0332315060', '0340245688'],
        email: 'compta@sirr.mg',
        cif: '0243008 /DGI-K du 08/08/2023',
        stat: '24101 11 2000 0 10023 du 17/01/2000',
        nif: '10 000 22 111 du 17/01/2000'
      }
    };
    
    this.transferItems = this.transfer?.items || [];
  }

  print() {
    // Store original body content
    const originalContent = document.body.innerHTML;
    
    // Get printable content
    const printContent = document.querySelector('.printable-content')?.outerHTML;
    
    if (printContent) {
      // Replace body with only printable content
      document.body.innerHTML = printContent;
      
      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        body { margin: 0 !important; padding: 0 !important; }
        @page { size: A4; margin: 10mm; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
      `;
      document.head.appendChild(style);
      
      // Print and then restore
      setTimeout(() => {
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }, 100);
    } else {
      // Fallback to simple print if something goes wrong
      window.print();
    }
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/Stock/BonDeTransfert']);
  }

 headerButtons: HeaderButton[] = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    },
    {
      key: 'Print',
      label: 'Print',
      icon: 'pi pi-print',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF', 'color': '#ffffff'}
    },
  ];

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.goBack();
    }
    if (key === 'Print') {
      this.print();
    } 
  }

}