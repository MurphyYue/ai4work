import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanUpCode = (code: string): string => {
  // replace '```' with empty string
  // then replace 'jsx' with empty string
  // then replace 'const Page = ' with empty string
  // Remove the code before 'const Page'
  // Remove the code after 'export' including 'export'
  const newstr = code?.replace(/```/g, "").replace(/jsx/g, "").replace(/"use strict";/g, "");
  const lines = newstr.split("\n");
  let start = false;
  let newLines = [];
  for (let line of lines) {
    if (line.includes("const Page")) {
      start = true;
    }
    if (line.includes("export")) {
      start = false;
    }
    if (start) {
      newLines.push(line);
    }
  }
  let newCode = newLines.join("\n");
  newCode = newCode.replace(/export/g, "").replace(/const Page = /g, "");
  return newCode;
};
