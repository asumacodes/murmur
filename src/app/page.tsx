import dynamic from "next/dynamic";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { features } from "@/config/features";

const FullLandingPage = dynamic(() =>
  import("@/components/FullLandingPage").then((mod) => mod.FullLandingPage),
);

export default function Home() {
  if (features.comingSoon) {
    return <ComingSoon />;
  }

  return <FullLandingPage />;
}
