export class StockItem {
  constructor(
    public id: number | string,
    public name: string,
    public quantity: number,
    public category: string,

    public entrepotId?: string,
    // Links to Entrepot
    public seuil?: number,             // Threshold for alerts
    public code?: string,              // Article reference code
    public lastUpdated?: Date,
    public archived: boolean = false,
    public seuilMax?: number,    // Add Seuil Max field
    public seuilMin?: number,
    public price?: number,

  ) {
    // Default values
    this.lastUpdated = this.lastUpdated || new Date();
    this.seuil = this.seuil || 10;     // Default threshold
    this.archived = archived;          // Initialize archived
  }

  // Helper method for stock alerts
  needsRestock(): boolean {
    return this.quantity <= (this.seuil || 10);
  }

  // Optional: Helper method to toggle archive status
  toggleArchive(): void {
    this.archived = !this.archived;
  }
}