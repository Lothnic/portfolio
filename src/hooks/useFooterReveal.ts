"use client";

import { useEffect } from "react";

export function useFooterReveal(): void {
  useEffect(() => {
    const scrollElement = document.querySelector(".hw-scroll");
    const root = document.documentElement;

    if (!scrollElement) return;

    let ticking = false;
    let animationFrame = 0;

    const update = (): void => {
      const rect = scrollElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollPast = viewportHeight - rect.bottom;
      const progress = Math.max(0, Math.min(1, scrollPast / viewportHeight));

      root.style.setProperty("--hw-footer-opacity", String(progress));
      root.style.setProperty(
        "--hw-footer-pe",
        progress >= 0.95 ? "auto" : "none"
      );
      root.style.setProperty(
        "--hw-scroll-pe",
        progress >= 0.95 ? "none" : "auto"
      );
    };

    const handleScroll = (): void => {
      if (ticking) return;
      ticking = true;
      animationFrame = requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    // Use ResizeObserver to handle layout shifts, image loading, and font rendering dynamically
    const resizeObserver = new ResizeObserver(() => {
      update();
    });
    resizeObserver.observe(scrollElement);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);

      // Do not leak the previous page's reveal state into the next route.
      root.style.removeProperty("--hw-footer-opacity");
      root.style.removeProperty("--hw-footer-pe");
      root.style.removeProperty("--hw-scroll-pe");
    };
  }, []);
}
