// app/data/levels.ts
import { WaterSortLevelData } from '../types/level';

export const DEFAULT_LEVELS: WaterSortLevelData[] = [
  {
    id: 1,
    name: "System Boot (Tutorial)",
    generation: { numColors: 3, numEmpty: 2, shuffleSteps: 40 },
    economy: { unlockCost: 5, lockedBottlesCount: 1 }
  },
  {
    id: 2,
    name: "Economy Stress Test",
    generation: { numColors: 4, numEmpty: 2, shuffleSteps: 60 },
    economy: { unlockCost: 10, lockedBottlesCount: 1 }
  },
  {
    id: 3,
    name: "Hardcore Logic Challenge",
    generation: { numColors: 5, numEmpty: 3, shuffleSteps: 100 },
    economy: { unlockCost: 20, lockedBottlesCount: 2 }
  }
];
