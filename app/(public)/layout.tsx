import { getSettings } from "@/services/settings.service";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header brandName={settings.brandName} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}