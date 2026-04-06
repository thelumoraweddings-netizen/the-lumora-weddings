const fs = require('fs').promises;
const path = require('path');

/**
 * Storage Service
 * acts as a "Safety Net" by saving each inquiry to a local JSON file.
 * This ensures no data is lost even if notifications (Email/WhatsApp) fail.
 */
class StorageService {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.inquiriesFile = path.join(this.logsDir, 'inquiries.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
      try {
        await fs.access(this.inquiriesFile);
      } catch {
        // Create an empty array if file doesn't exist
        await fs.writeFile(this.inquiriesFile, JSON.stringify([], null, 2));
      }
    } catch (err) {
      console.error('[Storage Error] Could not initialize logs directory:', err.message);
    }
  }

  /**
   * Save a new inquiry to the JSON file
   */
  async saveInquiry(data) {
    try {
      const currentData = await fs.readFile(this.inquiriesFile, 'utf8');
      const inquiries = JSON.parse(currentData);

      // Add a unique ID and timestamp to mimic DB behavior
      const newEntry = {
        _id: Date.now().toString(), // Using timestamp as a simple ID for frontend keys
        timestamp: new Date().toISOString(),
        status: 'Pending',
        ...data
      };
      inquiries.push(newEntry);

      await fs.writeFile(this.inquiriesFile, JSON.stringify(inquiries, null, 2));
      
      console.log(`[Storage Success] Inquiry backed up in: logs/inquiries.json`);
      return true;
    } catch (err) {
      console.error('[Storage Error] Failed to save backup:', err.message);
      return false;
    }
  }

  /**
   * Retrieve all inquiries (for the Admin Panel)
   */
  async getAllInquiries() {
    try {
      const currentData = await fs.readFile(this.inquiriesFile, 'utf8');
      // Return sorted by newest first
      return JSON.parse(currentData).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (err) {
      console.error('[Storage Error] Failed to retrieve inquiries:', err.message);
      return [];
    }
  }
}

module.exports = new StorageService();
