import HeroSlider from "@/components/HeroSlider";
import Collections from "@/components/Collections";
import ProductSection from "@/components/ProductSection";
import SocialProof from "@/components/SocialProof";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <Collections />
      <ProductSection />
      <SocialProof />
    </main>
  );
}
