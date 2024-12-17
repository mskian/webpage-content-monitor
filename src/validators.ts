import { MonitoredURL } from "./types";

/**
 * Validates the input data for a MonitoredURL
 */
export function validateMonitoredURL(data: any): MonitoredURL {
  const { url } = data;

  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL: URL is required and must be a string.");
  }

  if (!isValidURL(url)) {
    throw new Error("Invalid URL format.");
  }

  return { url, lastContent: "", lastChecked: "" };
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
