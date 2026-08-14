"use client";

import { useTheme } from "./theme";
import { HeroCanvas } from "./HeroCanvas";

export function ThemedHeroCanvas() {
  const { theme } = useTheme();
  // Reading/content pages get the quiet backdrop — sun + ripples only, no drifting particles.
  return <HeroCanvas theme={theme} quiet />;
}
