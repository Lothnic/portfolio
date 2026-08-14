import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly pin the project root so Next's workspace detection doesn't
  // pick up the stray lockfile in $HOME and resolve modules from there.
  // (Next 16's config loader resolves `__dirname` incorrectly, so use cwd.)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
