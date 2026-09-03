import type { Metadata } from "next";
import { ScrollHeroStandalone } from "@/components/sections/ScrollHeroExperience";

export const metadata: Metadata = {
  title: "Scroll hero test 1 · Murmur",
  robots: { index: false, follow: false },
};

export default function ScrollHeroTest1Page() {
  return (
    <main>
      <ScrollHeroStandalone />
    </main>
  );
}
