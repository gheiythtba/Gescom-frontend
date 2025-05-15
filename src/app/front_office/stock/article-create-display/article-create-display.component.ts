import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { HeaderBarComponent } from '../../Reusable-component/header-bar.component';

@Component({
  selector: 'app-article-create-display',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    HeaderBarComponent,
    FileUploadModule,
    CardModule,
    DividerModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './article-create-display.component.html',
  styleUrls: ['./article-create-display.component.scss'],
  providers: [MessageService]
})
export class ArticleCreateDisplayComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() article: Article = this.getDefaultArticle();
  @Output() save = new EventEmitter<Article>();
  @Output() cancel = new EventEmitter<void>();

  vatRates = [
    { label: '0%', value: 0 },
    { label: '5.5%', value: 5.5 },
    { label: '10%', value: 10 },
    { label: '20%', value: 20 }
  ];

  entrepots = [
    { label: 'Entrepôt Principal', value: 'main' },
    { label: 'Entrepôt Secondaire', value: 'secondary' },
    { label: 'Entrepôt Est', value: 'east' },
    { label: 'Entrepôt Ouest', value: 'west' }
  ];
  selectedEntrepot = 'main';

  uploadedFiles: any[] = [];
  loading = false;
  displayVatDialog = false;
  customVatRate: number | null = null;

  categories = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Food', value: 'Food' }
  ];

  headerButtons = [
    {
      key: 'back',
      label: 'Retour',
      icon: 'pi pi-arrow-left',
      style: {'background-color': '#000000', 'border-color': '#000000'}
    }
  ];

  constructor(private messageService: MessageService,    private router: Router
  ) {}

  showVatDialog() {
    this.customVatRate = null;
    this.displayVatDialog = true;
  }

  addCustomVatRate() {
    if (this.customVatRate !== null && !isNaN(this.customVatRate)) {
      const rateValue = this.customVatRate;
      if (rateValue >= 0 && rateValue <= 100) {
        const newRate = { label: `${rateValue}%`, value: rateValue };
        if (!this.vatRates.some(r => r.value === newRate.value)) {
          this.vatRates = [...this.vatRates, newRate].sort((a, b) => a.value - b.value);
          this.article.vatRate = rateValue;
          this.calculateVatAmount();
        }
        this.displayVatDialog = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter a valid VAT rate between 0 and 100'
        });
      }
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.article.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Image Uploaded'
    });
  }

  calculateSellingPrice(): void {
    if (this.article.purchasePrice && this.article.margin) {
      this.article.sellingPrice = this.article.purchasePrice * (1 + this.article.margin / 100);
      this.calculateVatAmount();
    }
  }

  calculateMargin(): void {
    if (this.article.purchasePrice && this.article.sellingPrice) {
      this.article.margin = ((this.article.sellingPrice - this.article.purchasePrice) / this.article.purchasePrice) * 100;
      this.calculateVatAmount();
    }
  }

  calculateVatAmount(): void {
    if (this.article.sellingPrice && this.article.vatRate) {
      this.article.vatAmount = this.article.sellingPrice * (this.article.vatRate / 100);
      this.article.priceIncludingVat = this.article.sellingPrice + this.article.vatAmount;
    }
  }

  onSave(): void {
    this.save.emit(this.article);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onHeaderButtonClick(key: string) {
    if (key === 'back') {
      this.onCancel();
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/Gescom/frontOffice/Stock/ArticleListe']);
  }

  resetForm(): void {
    this.article = this.getDefaultArticle();
    this.uploadedFiles = [];
  }

  private getDefaultArticle(): Article {
    return {
      id: '',
      designation: '',
      description: '',
      reference: '',
      category: '',
      purchasePrice: 0,
      sellingPrice: 0,
      margin: 20,
      vatRate: 20,
      vatAmount: 0,
      priceIncludingVat: 0,
      image: '',
      stockQuantity: 0,
      minimumStock: 0,
      active: true,
      creationDate: new Date()
    };
  }
}

export interface Article {
  id: string;
  designation: string;
  description: string;
  reference: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  margin: number;
  vatRate: number;
  vatAmount: number;
  priceIncludingVat: number;
  image: string;
  stockQuantity: number;
  minimumStock: number;
  active: boolean;
  creationDate: Date;
}