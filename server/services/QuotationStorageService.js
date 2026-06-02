const fs = require('fs').promises;
const path = require('path');

class QuotationStorageService {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.quotationsFile = path.join(this.logsDir, 'quotations.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
      try {
        await fs.access(this.quotationsFile);
      } catch {
        await fs.writeFile(this.quotationsFile, JSON.stringify([], null, 2));
      }
    } catch (err) {
      console.error('[Storage Error] Could not initialize logs directory:', err.message);
    }
  }

  async saveQuotation(data) {
    try {
      let quotations = await this.getAllQuotations();
      
      // Check if updating existing
      const existingIdx = quotations.findIndex(q => q.id === data.id);
      if (existingIdx >= 0) {
        quotations[existingIdx] = data;
      } else {
        quotations.push(data);
      }

      await fs.writeFile(this.quotationsFile, JSON.stringify(quotations, null, 2));
      console.log(`[Storage Success] Quotation backed up in: logs/quotations.json`);
      return true;
    } catch (err) {
      console.error('[Storage Error] Failed to save quotation:', err.message);
      return false;
    }
  }

  async deleteQuotation(id) {
    try {
      let quotations = await this.getAllQuotations();
      quotations = quotations.filter(q => q.id !== id);
      await fs.writeFile(this.quotationsFile, JSON.stringify(quotations, null, 2));
      return true;
    } catch (err) {
      return false;
    }
  }

  async getAllQuotations() {
    try {
      const currentData = await fs.readFile(this.quotationsFile, 'utf8');
      if (currentData.trim() === '') return [];
      return JSON.parse(currentData);
    } catch (err) {
      console.error('[Storage Error] Failed to retrieve quotations:', err.message);
      return [];
    }
  }
}

module.exports = new QuotationStorageService();
