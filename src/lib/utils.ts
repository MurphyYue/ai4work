import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanUpCode = (code: string): string => {
  // replace '```' with empty string
  // then replace 'jsx' with empty string
  // Remove the code before 'const Component'
  // Remove the code after 'export' including 'export'
  // Remove the code after '```' including '```'
  const newstr = code?.replace(/```tsx/g, "");
  const lines = newstr.split("\n");
  let start = false;
  let newLines = [];
  for (let line of lines) {
    if (line.includes("function Component()")) {
      start = true;
    }
    if (line.includes("export") || line.includes("```")) {
      start = false;
    }
    if (start) {
      newLines.push(line);
    }
  }
  let newCode = newLines.join("\n");
  newCode = newCode.replace(/export/g, "").replace(/function Component() { /g, "() => {");
  return newCode;
};
