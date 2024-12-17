import axios from "axios";
import { MonitoredURL } from "./types";
import { readFile, writeFile } from "./utils/fileHandler";

class URLMonitor {
  private monitoredURLs: MonitoredURL[] = [];

  constructor() {
    this.monitoredURLs = readFile();
  }

  /**
   * Add a new URL to monitor
   * @param urlData MonitoredURL
   */
  addURL(urlData: MonitoredURL): void {
    if (this.monitoredURLs.find((u) => u.url === urlData.url)) {
      throw new Error(`URL "${urlData.url}" is already being monitored.`);
    }

    this.monitoredURLs.push(urlData);
    writeFile(this.monitoredURLs);
    console.log(`[INFO] Added URL to monitor: ${urlData.url}`);
  }

  /**
   * Trigger a content check for a given URL
   * @param url string
   * @returns Result of the check
   */
  async triggerCheck(url: string): Promise<{ message: string; changed: string; data: MonitoredURL }> {
    const urlData = this.monitoredURLs.find((u) => u.url === url);
    if (!urlData) {
      throw new Error(`URL "${url}" is not being monitored.`);
    }

    try {
      const response = await axios.get(url);
      const content = response.data;

      // Detect content changes
      if (urlData.lastContent && urlData.lastContent !== content) {
        console.log(`[CHANGE DETECTED] ${url} at ${new Date().toISOString()}`);
        urlData.lastContent = content;
        urlData.lastChecked = new Date().toISOString();

        writeFile(this.monitoredURLs);
        return { message: "Change detected in content.", changed: "yes", data: urlData };
      }

      // No changes
      urlData.lastContent = content;
      urlData.lastChecked = new Date().toISOString();
      writeFile(this.monitoredURLs);

      return { message: "No changes detected.", changed: "no", data: urlData };
    } catch (err: any) {
      throw new Error(`Failed to check URL "${url}": ${err.message}`);
    }
  }

  /**
   * Retrieve all monitored URLs
   */
  getMonitoredURLs(): MonitoredURL[] {
    return this.monitoredURLs;
  }
}

export const urlMonitor = new URLMonitor();
