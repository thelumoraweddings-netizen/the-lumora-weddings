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

  async saveInquiry(data) {
    try {
      let inquiries = [];
      try {
        const currentData = await fs.readFile(this.inquiriesFile, 'utf8');
        // Handle empty file by initializing with empty array
        if (currentData.trim() === '') {
          inquiries = [];
        } else {
          inquiries = JSON.parse(currentData);
        }
      } catch (parseError) {
        console.warn('[Storage Warning] Could not parse inquiries file, starting fresh:', parseError.message);
        inquiries = [];
      }

      // Add a unique ID and timestamp to mimic DB behavior
      const newEntry = {
        _id: Date.now().toString(), // Using timestamp as a simple ID for frontend keys
        timestamp: new Date().toISOString(),
        status: 'Pending',
        ...data
      };
      
      // Ensure inquiries is an array
      if (!Array.isArray(inquiries)) inquiries = [];
      
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
