import express, { Request, Response } from "express";
import { urlMonitor } from "./urlMonitor";
import { validateMonitoredURL } from "./validators";

const router = express.Router();

/**
 * POST /api/monitor
 * Add a new URL to monitor
 */
router.post("/monitor", (req: Request, res: Response) => {
  try {
    const validatedData = validateMonitoredURL(req.body);
    urlMonitor.addURL(validatedData);

    res.status(201).json({
      success: true,
      message: "URL successfully added for monitoring.",
      data: validatedData,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("already being monitored") ? 409 : 422;

    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/monitor/trigger
 * Manually trigger a content check for a monitored URL
 */
router.post("/monitor/trigger", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new Error("URL is required to trigger a check.");
    }

    const result = await urlMonitor.triggerCheck(url);

    res.status(200).json({
      success: true,
      status: result.changed,
      message: result.message,
    });
  } catch (error: any) {
    res.status(422).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/monitor
 * Retrieve all monitored URLs
 */
router.get("/monitor", (_req: Request, res: Response) => {
  try {
    const monitoredURLs = urlMonitor.getMonitoredURLs();
    res.status(200).json({
      success: true,
      data: monitoredURLs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve monitored URLs.",
    });
  }
});

export default router;
