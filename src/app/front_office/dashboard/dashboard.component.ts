import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    AvatarModule,
    BadgeModule,
    ProgressBarModule,
    TableModule,
    TimelineModule,
    DropdownModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    KnobModule,
    TooltipModule,
    RippleModule
  ],
  template: `
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div>
          <h1>Business Dashboard</h1>
          <p>Welcome back, Mohamed Ali</p>
        </div>
        <div class="header-actions">
          <button pButton icon="pi pi-cog" class="p-button-text p-button-plain"></button>
          <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" 
                   size="large" shape="circle"></p-avatar>
        </div>
      </div>
    </div>

    <!-- Statistics Card -->
    <div class="statistics-container">
      <p-card class="statistics-card">
        <div class="flex flex-wrap justify-content-between gap-3">
          <!-- Total Products -->
          <div class="stat-item">
            <div class="stat-icon bg-blue-100">
              <i class="pi pi-box text-blue-500"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Products</span>
              <span class="stat-value">1,245</span>
              <p-tag severity="info" value="12% increase" class="mt-2"></p-tag>
            </div>
          </div>

          <p-divider layout="vertical"></p-divider>

          <!-- Monthly Sales -->
          <div class="stat-item">
            <div class="stat-icon bg-green-100">
              <i class="pi pi-shopping-cart text-green-500"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Monthly Sales</span>
              <span class="stat-value">$128K</span>
              <p-tag severity="success" value="8.2% increase" class="mt-2"></p-tag>
            </div>
          </div>

          <p-divider layout="vertical"></p-divider>

          <!-- New Clients -->
          <div class="stat-item">
            <div class="stat-icon bg-purple-100">
              <i class="pi pi-users text-purple-500"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">New Clients</span>
              <span class="stat-value">42</span>
              <p-tag severity="warning" value="5.3% increase" class="mt-2"></p-tag>
            </div>
          </div>

          <p-divider layout="vertical"></p-divider>

          <!-- Satisfaction -->
          <div class="stat-item">
            <div class="stat-icon bg-orange-100">
              <i class="pi pi-star text-orange-500"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Satisfaction</span>
              <span class="stat-value">94%</span>
              <p-tag severity="danger" value="1.2% decrease" class="mt-2"></p-tag>
            </div>
          </div>
        </div>
      </p-card>
    </div>

    <!-- First Row: Revenue & Performance -->
    <div class="card-row">
      <p-card class="dashboard-card equal-height-cards">
        <div class="card-header">
          <h2>Revenue Overview</h2>
          <div class="card-actions">
            <p-dropdown [options]="timePeriods" [(ngModel)]="selectedPeriod" 
                       optionLabel="name"></p-dropdown>
            <button pButton icon="pi pi-download" class="p-button-text"></button>
            <button pButton icon="pi pi-refresh" class="p-button-text"></button>
          </div>
        </div>
        <div class="card-content card-content-fixed chart-container">
          <p-chart type="line" [data]="revenueData" [options]="chartOptions"></p-chart>
        </div>
      </p-card>
    </div>

    <!-- Second Row: Orders & Products -->
    <div class="card-row">
      <p-card class="dashboard-card equal-height-cards">
        <div class="card-header">
          <h2>Recent Orders</h2>
        </div>
        <div class="card-content card-content-fixed">
          <p-table [value]="recentOrders" [rows]="5" [paginator]="true" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-order>
              <tr>
                <td>#{{order.id}}</td>
                <td>{{order.customer}}</td>
                <td>{{order.date | date:'shortDate'}}</td>
                <td><p-tag [severity]="getOrderStatusSeverity(order.status)" [value]="order.status"></p-tag></td>
                <td>{{order.amount | currency}}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <p-card class="dashboard-card equal-height-cards">
        <div class="card-header">
          <h2>Top Products</h2>
        </div>
        <div class="card-content card-content-fixed">
          <p-table [value]="topProducts" [rows]="5" [paginator]="true" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Stock</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr>
                <td class="product-cell">
                  <p-avatar [image]="product.image" shape="circle" size="normal"></p-avatar>
                  <span>{{product.name}}</span>
                </td>
                <td><p-tag [value]="product.category" severity="info"></p-tag></td>
                <td>{{product.sales}}</td>
                <td>{{product.revenue | currency}}</td>
                <td>
                  <p-progressBar [value]="product.stock" [showValue]="false" 
                               [styleClass]="getStockClass(product.stock)"></p-progressBar>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>
    </div>

    <!-- Third Row: Activity & Team -->
    <div class="card-row">
      <p-card class="dashboard-card equal-height-cards">
        <div class="card-header">
          <h2>Recent Activity</h2>
        </div>
        <div class="card-content card-content-fixed">
          <div class="activity-list">
            <div class="activity-item" *ngFor="let event of activities">
              <div class="activity-marker" [style.background]="event.color">
                <i [class]="event.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-header">
                  <h4>{{event.status}}</h4>
                  <span>{{event.date | date:'shortTime'}}</span>
                </div>
                <p>{{event.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </p-card>

      <p-card class="dashboard-card equal-height-cards">
        <div class="card-header">
          <h2>Team Members</h2>
        </div>
        <div class="card-content card-content-fixed">
          <div class="team-grid">
            <div class="team-member" *ngFor="let member of teamMembers">
              <p-avatar [image]="member.image" size="xlarge" shape="circle"></p-avatar>
              <div class="member-info">
                <h4>{{member.name}}</h4>
                <p>{{member.role}}</p>
                <p-tag [value]="member.status" [severity]="member.status === 'Active' ? 'success' : 'warning'"></p-tag>
              </div>
            </div>
          </div>
        </div>
      </p-card>
    </div>
  </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      background-color: #f8fafc;
      min-height: 100vh;
      max-width: 100vw;
      overflow-x: hidden;
    }

    /* Header Section */
    .header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
    }

    .header-content h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .header-content p {
      margin: 0.25rem 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Statistics Card */
    .statistics-container {
      margin-bottom: 1.5rem;
    }

    .statistics-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: none;
    }

    .statistics-card .p-card-body {
      padding: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      flex: 1;
      min-width: 200px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }

    .stat-icon i {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0.25rem 0;
    }

    .p-divider.p-divider-vertical {
      margin: 0 0.5rem;
      height: 60px;
      align-self: center;
    }

    /* Card Layout */
    .card-row {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .dashboard-card {
      flex: 1 1 45%;
      min-width: 300px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: none;
      display: flex;
      flex-direction: column;
    }

    .equal-height-cards {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-content-fixed {
      flex: 1;
      overflow: auto;
      min-height: 300px;
    }

    .dashboard-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .p-card .p-card-body {
      padding: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-content {
      padding: 1.5rem;
      width: 100%;
      overflow: hidden;
      flex: 1;
    }

    .chart-container {
      height: 100%;
      min-height: 300px;
      position: relative;
    }

    /* Tables */
    .card-content p-table {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-content ::ng-deep .p-datatable-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .p-table {
      font-size: 0.875rem;
    }

    .p-table th {
      background-color: #f3f4f6;
      color: #4b5563;
      font-weight: 600;
      padding: 0.75rem 1rem;
    }

    .p-table td {
      padding: 0.75rem 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .product-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
    }

    .activity-marker {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .activity-header h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }

    .activity-header span {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .activity-content p {
      margin: 0;
      font-size: 0.85rem;
      color: #4b5563;
    }

    /* Team Grid */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .team-member {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.75rem;
    }

    .member-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .member-info h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .member-info p {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
    }

    /* Chart specific styles */
    :host ::ng-deep canvas {
      width: 100% !important;
      max-width: 100%;
    }

    :host ::ng-deep .chart-container canvas {
      width: 100% !important;
      height: 100% !important;
    }

    /* Responsive Adjustments */
    @media screen and (max-width: 992px) {
      .card-row {
        flex-direction: column;
      }

      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media screen and (max-width: 768px) {
      .stat-item {
        min-width: 100%;
      }
      
      .p-divider.p-divider-vertical {
        display: none;
      }
    }

    @media screen and (max-width: 576px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }

      .team-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-card {
        min-width: 100%;
      }
    }
  `]
})
export class DashboardComponent {
  timePeriods = [
    { name: 'Last 7 Days', code: '7d' },
    { name: 'Last 30 Days', code: '30d' },
    { name: 'Last Quarter', code: 'qtr' },
    { name: 'Last Year', code: 'yr' }
  ];
  selectedPeriod = this.timePeriods[1];

  performanceValue = 84;

  revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Product Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#6366F1',
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Services',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: '#10B981',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  recentOrders = [
    { id: 1001, customer: 'Mohamed Ali', date: new Date(), status: 'Completed', amount: 1250 },
    { id: 1002, customer: 'Fatma Karray', date: new Date(Date.now() - 86400000), status: 'Processing', amount: 890 },
    { id: 1003, customer: 'Ahmed Ben Salah', date: new Date(Date.now() - 172800000), status: 'Completed', amount: 2450 },
    { id: 1004, customer: 'Leila Trabelsi', date: new Date(Date.now() - 259200000), status: 'Pending', amount: 750 },
    { id: 1001, customer: 'Mohamed Ali', date: new Date(), status: 'Completed', amount: 1250 },
    { id: 1002, customer: 'Fatma Karray', date: new Date(Date.now() - 86400000), status: 'Processing', amount: 890 },
    { id: 1003, customer: 'Ahmed Ben Salah', date: new Date(Date.now() - 172800000), status: 'Completed', amount: 2450 },
    { id: 1004, customer: 'Leila Trabelsi', date: new Date(Date.now() - 259200000), status: 'Pending', amount: 750 },
    { id: 1002, customer: 'Fatma Karray', date: new Date(Date.now() - 86400000), status: 'Processing', amount: 890 },
    { id: 1003, customer: 'Ahmed Ben Salah', date: new Date(Date.now() - 172800000), status: 'Completed', amount: 2450 },
  ];

  topProducts = [
    { name: 'Premium Widget', category: 'Widgets', sales: 245, revenue: 24500, stock: 85, image: 'https://primefaces.org/cdn/primeng/images/demo/product/widget-red.png' },
    { name: 'Ultra Processor', category: 'Electronics', sales: 189, revenue: 37800, stock: 45, image: 'https://primefaces.org/cdn/primeng/images/demo/product/processor.png' },
    { name: 'Ergonomic Chair', category: 'Furniture', sales: 132, revenue: 19800, stock: 32, image: 'https://primefaces.org/cdn/primeng/images/demo/product/chair.png' },
    { name: 'Wireless Earbuds Pro', category: 'Electronics', sales: 210, revenue: 31500, stock: 28, image: 'https://primefaces.org/cdn/primeng/images/demo/product/earbuds.png' },
    { name: 'Smart Watch X3', category: 'Wearables', sales: 178, revenue: 35600, stock: 15, image: 'https://primefaces.org/cdn/primeng/images/demo/product/watch.png' },
    { name: '4K Ultra HD TV', category: 'Electronics', sales: 92, revenue: 55200, stock: 8, image: 'https://primefaces.org/cdn/primeng/images/demo/product/tv.png' },
    { name: 'Bluetooth Speaker', category: 'Audio', sales: 156, revenue: 18720, stock: 42, image: 'https://primefaces.org/cdn/primeng/images/demo/product/speaker.png' },
    { name: 'Gaming Laptop', category: 'Computers', sales: 87, revenue: 104400, stock: 5, image: 'https://primefaces.org/cdn/primeng/images/demo/product/laptop.png' },
    { name: 'Fitness Tracker', category: 'Wearables', sales: 203, revenue: 16240, stock: 36, image: 'https://primefaces.org/cdn/primeng/images/demo/product/tracker.png' },
    { name: 'Wireless Keyboard', category: 'Accessories', sales: 134, revenue: 10720, stock: 52, image: 'https://primefaces.org/cdn/primeng/images/demo/product/keyboard.png' }
];

activities = [
    { status: 'New Order', description: 'Order #1007 placed by Mohamed Ali', date: new Date(), icon: 'pi pi-shopping-cart', color: '#6366F1' },
    { status: 'Payment', description: 'Payment received for order #1006', date: new Date(Date.now() - 3600000), icon: 'pi pi-dollar', color: '#10B981' },
    { status: 'Support Ticket', description: 'New ticket from Fatma Karray', date: new Date(Date.now() - 7200000), icon: 'pi pi-question-circle', color: '#F59E0B' },
    { status: 'New Customer', description: 'Ahmed Ben Salah registered as new customer', date: new Date(Date.now() - 10800000), icon: 'pi pi-user-plus', color: '#8B5CF6' },
    { status: 'Inventory Update', description: 'Premium Widget stock updated', date: new Date(Date.now() - 14400000), icon: 'pi pi-box', color: '#3B82F6' },
    { status: 'Order Shipped', description: 'Order #1005 shipped to Leila Trabelsi', date: new Date(Date.now() - 18000000), icon: 'pi pi-truck', color: '#EC4899' },
    { status: 'New Review', description: '5-star review received for Ultra Processor', date: new Date(Date.now() - 21600000), icon: 'pi pi-star', color: '#F59E0B' },
    { status: 'Refund Processed', description: 'Refund issued for order #1004', date: new Date(Date.now() - 25200000), icon: 'pi pi-money-bill', color: '#EF4444' },
    { status: 'Marketing Campaign', description: 'New summer sale campaign launched', date: new Date(Date.now() - 28800000), icon: 'pi pi-megaphone', color: '#10B981' },
    { status: 'System Update', description: 'Dashboard performance improvements deployed', date: new Date(Date.now() - 32400000), icon: 'pi pi-cog', color: '#6B7280' }
];

  teamMembers = [
    { name: 'Mohamed Ali', role: 'Lead Developer', status: 'Active', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png' },
    { name: 'Fatma Karray', role: 'UX Designer', status: 'Active', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png' },
    { name: 'Ahmed Ben Salah', role: 'Project Manager', status: 'In Meeting', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png' },
    { name: 'Leila Trabelsi', role: 'Marketing Specialist', status: 'Active', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png' }
  ];

  getOrderStatusSeverity(status: string) {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'info';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return null;
    }
  }

  getStockClass(stock: number) {
    if (stock > 70) return 'high-stock';
    if (stock > 30) return 'medium-stock';
    return 'low-stock';
  }
}