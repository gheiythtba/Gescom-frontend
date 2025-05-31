import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderBarComponent } from '../Reusable-component/header-bar.component';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [HeaderBarComponent],
  template: `
    <div class="reports-dashboard">
      <div class="header-section">
        <app-header-bar
          [title]="'Gestion des Rapports'"
          [buttons]="headerButtons"
          [subtitle]="'Gérez vos rapports efficacement'"
          (buttonClick)="onHeaderButtonClick($event)">
        </app-header-bar>
      </div>

      <div class="cards-grid">
        <!-- Sales Report Card -->
        <div class="report-card card-sales">
          <div class="card-header">
            <i class="icon-trending-up"></i>
            <h2>Rapport de Vente</h2>
          </div>
          <div class="card-content">
            <ul>
              <li (click)="navigateToReport('sales-by-client')">
                <i class="icon-user"></i> 
                <span class="report-link">Vente par client</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('sales-by-product-line')">
                <i class="icon-list"></i> 
                <span class="report-link">Détail ventes par ligne produit</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('client-transactions')">
                <i class="icon-exchange"></i> 
                <span class="report-link">Transactions clients</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('sales-tax')">
                <i class="icon-receipt"></i> 
                <span class="report-link">TVA ventes</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('client-withholdings')">
                <i class="icon-percent"></i> 
                <span class="report-link">Total des retenues pour les clients</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('sales')">
              Générer tout <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Purchase Report Card -->
        <div class="report-card card-purchase">
          <div class="card-header">
            <i class="icon-trending-down"></i>
            <h2>Rapport d'Achat</h2>
          </div>
          <div class="card-content">
            <ul>
              <li (click)="navigateToReport('purchase-by-supplier')">
                <i class="icon-truck"></i> 
                <span class="report-link">Achat par fournisseur</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('purchase-by-product-line')">
                <i class="icon-box"></i> 
                <span class="report-link">Détails d'achat par ligne produit</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('supplier-transactions')">
                <i class="icon-exchange"></i> 
                <span class="report-link">Transactions Fournisseurs</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('purchase-tax')">
                <i class="icon-receipt"></i> 
                <span class="report-link">TVA achats</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('supplier-withholdings')">
                <i class="icon-percent"></i> 
                <span class="report-link">Total des retenues pour les Fournisseurs</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('purchases')">
              Générer tout <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Client Report Card -->
        <div class="report-card card-client">
          <div class="card-header">
            <i class="icon-users"></i>
            <h2>Rapport Clients</h2>
          </div>
          <div class="card-content">
            <div class="checkbox-container">
              <label class="checkbox-item">
                <input type="checkbox" (change)="toggleClientReport($event)"> Rapport Clients
              </label>
            </div>
            <ul>
              <li (click)="navigateToReport('client-balances')">
                <i class="icon-credit-card"></i> 
                <span class="report-link">Soldes Client</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('client-revenue')">
                <i class="icon-activity"></i> 
                <span class="report-link">Chiffre d'affaires par client</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('clients')" [disabled]="!clientReportEnabled">
              Analyser <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Supplier Report Card -->
        <div class="report-card card-supplier">
          <div class="card-header">
            <i class="icon-truck"></i>
            <h2>Rapport Fournisseur</h2>
          </div>
          <div class="card-content">
            <ul>
              <li (click)="navigateToReport('supplier-balances')">
                <i class="icon-credit-card"></i> 
                <span class="report-link">Soldes Fournisseur</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('supplier-revenue')">
                <i class="icon-activity"></i> 
                <span class="report-link">Chiffre d'affaires par Fournisseur</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('suppliers')">
              Analyser <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Historical Report Card -->
        <div class="report-card card-historical">
          <div class="card-header">
            <i class="icon-calendar"></i>
            <h2>Historique</h2>
          </div>
          <div class="card-content">
            <div class="checkbox-container">
              <label class="checkbox-item">
                <input type="checkbox" (change)="toggleHistoricalReport($event)"> Réponse à une date antérieure
              </label>
            </div>
            <ul>
              <li (click)="navigateToReport('stock-movement')">
                <i class="icon-database"></i> 
                <span class="report-link">Mouvement détaillé de stock</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('stock-status')">
                <i class="icon-archive"></i> 
                <span class="report-link">Etat de stock à une date antérieure</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('historical')" [disabled]="!historicalReportEnabled">
              Vérifier <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Payment Report Card -->
        <div class="report-card card-payment">
          <div class="card-header">
            <i class="icon-dollar-sign"></i>
            <h2>Rapport Paiement</h2>
          </div>
          <div class="card-content">
            <ul>
              <li (click)="navigateToReport('client-payments')">
                <i class="icon-user"></i> 
                <span class="report-link">Paiement Client</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('supplier-payments')">
                <i class="icon-truck"></i> 
                <span class="report-link">Paiements fournisseurs</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('overdue-invoices')">
                <i class="icon-alert"></i> 
                <span class="report-link">Facture clients non payé depuis plus d'un mois</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('payments')">
              Vérifier <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Profit Report Card -->
        <div class="report-card card-profit">
          <div class="card-header">
            <i class="icon-bar-chart"></i>
            <h2>Rapport Bénéfices</h2>
          </div>
          <div class="card-content">
            <ul>
              <li (click)="navigateToReport('profit-by-item')">
                <i class="icon-package"></i> 
                <span class="report-link">Bénéfice commerciale par pièce</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('monthly-profit')">
                <i class="icon-calendar"></i> 
                <span class="report-link">Bénéfice commerciale mensuel</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('profit-by-line')">
                <i class="icon-list"></i> 
                <span class="report-link">Bénéfice commerciale par ligne</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
              <li (click)="navigateToReport('profit-by-product')">
                <i class="icon-tag"></i> 
                <span class="report-link">Bénéfice commerciale par produit</span>
                <i class="icon-arrow-right link-arrow"></i>
              </li>
            </ul>
            <button class="card-action" (click)="generateReport('profits')">
              Analyser <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Premium Dashboard Styles */
    :host {
      --primary-color: #4361ee;
      --primary-light: rgba(67, 97, 238, 0.1);
      --secondary-color: #3a0ca3;
      --success-color: #4cc9f0;
      --success-light: rgba(76, 201, 240, 0.1);
      --warning-color: #f8961e;
      --warning-light: rgba(248, 150, 30, 0.1);
      --danger-color: #f72585;
      --danger-light: rgba(247, 37, 133, 0.1);
      --info-color: #4895ef;
      --info-light: rgba(72, 149, 239, 0.1);
      --dark-color: #212529;
      --light-color: #f8f9fa;
      --border-radius: 16px;
      --box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .reports-dashboard {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f8fafc;
      min-height: 100vh;
      padding: 2rem;
    }

    .header-section {
      margin-bottom: 2.5rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
      padding: 0.5rem;
    }

    .report-card {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      transition: var(--transition);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .report-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0,0,0,0.12);
    }

    .card-header {
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--dark-color);
      letter-spacing: -0.02em;
    }

    .card-content {
      padding: 2rem;
    }

    .card-content ul {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    .card-content li {
      padding: 1rem 0;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      color: #495057;
      font-size: 0.95rem;
      border-bottom: 1px solid rgba(0,0,0,0.03);
      cursor: pointer;
      transition: var(--transition);
      position: relative;
    }

    .card-content li:last-child {
      border-bottom: none;
    }

    .card-content li:hover {
      background-color: rgba(0,0,0,0.02);
      padding-left: 1rem;
      padding-right: 1rem;
      margin-left: -1rem;
      margin-right: -1rem;
      border-radius: 8px;
    }

    .card-content li:hover .report-link {
      color: var(--primary-color);
      font-weight: 500;
    }

    .card-content li:hover .link-arrow {
      opacity: 1;
      transform: translateX(5px);
    }

    .report-link {
      flex: 1;
      transition: var(--transition);
    }

    .link-arrow {
      opacity: 0;
      transition: var(--transition);
      color: var(--primary-color);
      font-size: 0.9em;
    }

    .checkbox-container {
      margin-bottom: 1.5rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: #495057;
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0.5rem 0;
    }

    .checkbox-item input {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    .card-action {
      width: 100%;
      padding: 1rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      transition: var(--transition);
      margin-top: 0.5rem;
    }

    .card-action:hover {
      background-color: var(--secondary-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
    }

    .card-action:disabled {
      background-color: #e9ecef !important;
      color: #adb5bd !important;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Card Color Variants */
    .card-sales .card-header {
      background: linear-gradient(90deg, var(--primary-light) 0%, rgba(255,255,255,1) 100%);
      color: var(--primary-color);
    }

    .card-purchase .card-header {
      background: linear-gradient(90deg, var(--warning-light) 0%, rgba(255,255,255,1) 100%);
      color: var(--warning-color);
    }

    .card-client .card-header {
      background: linear-gradient(90deg, var(--success-light) 0%, rgba(255,255,255,1) 100%);
      color: var(--success-color);
    }

    .card-supplier .card-header {
      background: linear-gradient(90deg, var(--danger-light) 0%, rgba(255,255,255,1) 100%);
      color: var(--danger-color);
    }

    .card-historical .card-header {
      background: linear-gradient(90deg, rgba(108, 117, 125, 0.1) 0%, rgba(255,255,255,1) 100%);
      color: #6c757d;
    }

    .card-payment .card-header {
      background: linear-gradient(90deg, rgba(40, 167, 69, 0.1) 0%, rgba(255,255,255,1) 100%);
      color: #28a745;
    }

    .card-profit .card-header {
      background: linear-gradient(90deg, rgba(111, 66, 193, 0.1) 0%, rgba(255,255,255,1) 100%);
      color: #6f42c1;
    }

    /* Icons */
    .icon-trending-up:before { content: "📈"; }
    .icon-trending-down:before { content: "📉"; }
    .icon-user:before { content: "👤"; }
    .icon-list:before { content: "📋"; }
    .icon-exchange:before { content: "🔄"; }
    .icon-receipt:before { content: "🧾"; }
    .icon-percent:before { content: "%"; }
    .icon-users:before { content: "👥"; }
    .icon-credit-card:before { content: "💳"; }
    .icon-activity:before { content: "📊"; }
    .icon-truck:before { content: "🚚"; }
    .icon-box:before { content: "📦"; }
    .icon-calendar:before { content: "📅"; }
    .icon-database:before { content: "🗄️"; }
    .icon-archive:before { content: "📦"; }
    .icon-dollar-sign:before { content: "💲"; }
    .icon-alert:before { content: "⚠️"; }
    .icon-bar-chart:before { content: "📊"; }
    .icon-package:before { content: "📦"; }
    .icon-tag:before { content: "🏷️"; }
    .icon-arrow-right:before { content: "→"; }
  `]
})
export class RapportsComponent {
  clientReportEnabled = false;
  historicalReportEnabled = false;
  
  headerButtons = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    },
    {
      key: 'export',
      label: 'Exporter',
      icon: 'pi pi-file-export',
      style: {'background-color': '#007AFF', 'border-color': '#007AFF','color': '#ffffff'}
    }
  ];

  constructor(private router: Router) {}

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.router.navigate(['/dashboard']);
    } else if (key === 'export') {
      this.exportReports();
    }
  }

  navigateToReport(reportType: string) {
    console.log(`Navigating to ${reportType} report`);
    // Example: this.router.navigate([`/reports/${reportType}`]);
    // Implement your actual navigation logic here
  }

  generateReport(reportCategory: string) {
    console.log(`Generating ${reportCategory} report`);
    // Implement report generation logic here
  }

  toggleClientReport(event: Event) {
    this.clientReportEnabled = (event.target as HTMLInputElement).checked;
  }

  toggleHistoricalReport(event: Event) {
    this.historicalReportEnabled = (event.target as HTMLInputElement).checked;
  }

  exportReports() {
    console.log('Exporting all reports');
    // Implement export logic here
  }
}