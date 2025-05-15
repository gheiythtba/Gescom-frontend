export class Entrepot {
  constructor(
    public id: string,
    public name: string,
    public location: string,
    public activity?: string,          // Optional from creation dialog
    public responsible?: string,       // Optional from creation dialog
    public creationDate?: Date,        // Used in tables
    public logo?: string               // For image display
  ) {
    // Default values
    this.creationDate = this.creationDate || new Date();
    this.logo = this.logo || 'assets/Images/warehouse-default.png';
  }
}