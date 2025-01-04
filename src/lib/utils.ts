import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ScenarioBackend, ScenarioFrontend } from "@/types"
import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertScenarioToFrontend(scenario: ScenarioBackend): ScenarioFrontend {
  return {
    ...scenario,
    createdAt: (scenario.createdAt as Timestamp).toDate(),
    updatedAt: (scenario.updatedAt as Timestamp).toDate(),
  }
}
