import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../data/monitored_urls.json");

export const readFile = (): any[] => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const writeFile = (data: any[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
