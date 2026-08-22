import type { Metadata } from "next";
import { ScrollHeroBeat1 } from "@/components/scrollhero-test/ScrollHeroBeat1";

export const metadata: Metadata = {
  title: "Scroll hero test 1 · Murmur",
  robots: { index: false, follow: false },
};

export default function ScrollHeroTest1Page() {
  return (
    <main>
      <ScrollHeroBeat1 />
    </main>
  );
}
