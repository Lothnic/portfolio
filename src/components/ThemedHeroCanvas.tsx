"use client";

import { useTheme } from "./theme";
import { HeroCanvas } from "./HeroCanvas";

export function ThemedHeroCanvas() {
  const { theme } = useTheme();
  return <HeroCanvas theme={theme} />;
}
