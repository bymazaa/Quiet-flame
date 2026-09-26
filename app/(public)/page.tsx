import type { Metadata } from "next";
import { getSettings } from "@/services/settings.service";
import { Hero } from "@/app/components/home/Hero";
import { WhyChooseUs } from "../components/home/WhyChoosUs";
import { BrandAbout } from "../components/home/About";
import { FinalCTA } from "../components/home/CTA";
import { FeaturedProducts } from "../components/home/FeaturedProducts";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Hero brandName={settings.brandName} />
      <FeaturedProducts/>
      {/* Featured Products, Brand/About, Why Choose Us, and CTA sections come next */}
      <WhyChooseUs/>
      <BrandAbout brandName={settings.brandName}/>
      <FinalCTA brandName={settings.brandName} />
    </>
  );
}