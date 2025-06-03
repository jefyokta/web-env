import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type StatusRT = {
  desc:string,
  color:string

}


class TemperatureRange {
  static evaluate(c: number): StatusRT {
    if (c < 18) {
      return { desc: "Too Cold", color: "bg-blue-500" }
    } else if (c >= 18 && c <= 27) {
      return { desc: "Normal", color: "bg-green-500" }
    } else if (c > 27 && c <= 35) {
      return { desc: "Warm", color: "bg-yellow-500" }
    } else {
      return { desc: "Too Hot", color: "bg-red-500" }
    }
  }
}

class LuxRange {
  static evaluate(l: number): StatusRT {
    if (l < 100) {
      return { desc: "Dark", color: "bg-gray-500" }
    } else if (l < 500) {
      return { desc: "Dim", color: "bg-blue-500" }
    } else if (l < 1000) {
      return { desc: "Bright", color: "bg-green-500" }
    } else {
      return { desc: "Too Bright", color: "bg-yellow-500" }
    }
  }
}

class DustRange {
  static evaluate(d: number): StatusRT {
    if (d < 300) {
      return { desc: "Clean", color: "bg-green-500" }
    } else if (d < 700) {
      return { desc: "Dusty", color: "orange" }
    } else {
      return { desc: "Very Dusty", color: "bg-red-500" }
    }
  }
}

class CrispRange {
  static evaluate(d: number): StatusRT {
    if (d > 25) {
      return { desc: "Good", color: "bg-green-500" }
     } else {
      return { desc: "Anomali", color: "bg-red-500" }
    }
  }
}

export const getStatus: Record<string, (val: number) => StatusRT> = {
  temp: TemperatureRange.evaluate,
  lux: LuxRange.evaluate,
  dust: DustRange.evaluate,
  crisp: CrispRange.evaluate
}
