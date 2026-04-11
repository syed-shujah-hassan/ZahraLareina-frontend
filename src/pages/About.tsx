import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";

const About = () => {
  return (
    <Layout>
      <Seo
        title="About Zahralareina | Zahra La Reina | ZahraLareina Luxe"
        description="Learn the story behind Zahralareina (often searched as Zahra La Reina, ZahraLareina Luxe, Zahralarina, Zahra Reina, Zahra Laraina, Zahra Lareena, and Zahra Raina) — a curated luxury boutique for timeless pieces."
        canonicalPath="/about"
      />
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">The ZahraLareina Story</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              About Us
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              ZahraLareina is an online luxury boutique, curated for those who appreciate refined silhouettes, timeless palettes, and considered details.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Our Vision
              </h2>
              <p>
                ZahraLareina was created with a simple idea: to bring an elevated, boutique-like experience to the online space. Every piece is selected or designed to feel intentional, versatile, and quietly sophisticated.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                A Focus on Detail
              </h2>
              <p>
                From fabric choices and finishes to packaging and presentation, we pay close attention to the small details so that your order feels like a considered gift, whether for yourself or someone special.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Online-Only, Boutique Feel
              </h2>
              <p>
                As an online-only boutique based in Pakistan, ZahraLareina combines the convenience of digital shopping with the intimacy and care of a small, curated brand. Our team is constantly refining collections based on feedback and emerging inspirations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                For the Modern Muse
              </h2>
              <p>
                Whether you are building a capsule wardrobe or searching for a statement piece, ZahraLareina aims to be a destination you can return to for elevated essentials and occasion wear.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
