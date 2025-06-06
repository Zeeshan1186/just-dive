import * as React from "react";
import type { CarouselApi } from "@/components/ui/carousel"; // ✅ use type-only import

export function useCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  return { api, setApi };
}
