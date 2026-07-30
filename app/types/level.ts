// src/types/level.ts

export interface GenerationParams {
  numColors: number;
  numEmpty: number;
  shuffleSteps: number;
}

export interface EconomyParams {
  unlockCost: number;
  lockedBottlesCount: number;
}

export interface CustomLayout {
  enabled: boolean;
  state: string[][];
}

export interface WaterSortLevelData {
  id: number | string;
  name: string;
  generation: GenerationParams;
  economy: EconomyParams;
  customLayout?: CustomLayout;
}
