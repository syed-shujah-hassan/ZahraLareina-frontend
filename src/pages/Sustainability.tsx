import { Layout } from "@/components/layout/Layout";

const Sustainability = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Thoughtful Choices</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Sustainability
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              While we are a growing online boutique, ZahraLareina is committed to making considered choices in how we source, package, and deliver our pieces.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Mindful Quantities
              </h2>
              <p>
                We work in limited quantities to reduce excess inventory and encourage more intentional purchasing, focusing on pieces designed to be worn beyond one season.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Packaging
              </h2>
              <p>
                Our packaging choices aim to balance protection and presentation with reduced waste, using fewer unnecessary materials wherever possible.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Continuous Improvement
              </h2>
              <p>
                Sustainability is an ongoing journey. As ZahraLareina grows, we will continue exploring ways to improve our practices, from supplier choices to logistics.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Transparency
              </h2>
              <p>
                We believe in honest communication. Any major updates to our sustainability efforts will be shared here so you can shop with clarity and trust.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sustainability;
