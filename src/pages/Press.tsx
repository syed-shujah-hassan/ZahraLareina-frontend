import { Layout } from "@/components/layout/Layout";

const Press = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">For Media & Collaborations</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Press
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Discover official ZahraLareina information, brand assets, and collaboration inquiries.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Media Enquiries
              </h2>
              <p>
                For features, interviews, or press-related questions, please contact our media team with details about your publication or platform.
              </p>
              <p className="font-serif text-base text-foreground">press@zahralareina.com</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Collaborations
              </h2>
              <p>
                We selectively collaborate with creators, stylists, and brands that align with our aesthetic and values. When reaching out, please include links to your work and a brief collaboration concept.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Brand Assets
              </h2>
              <p>
                Official logos, imagery, and brand guidelines can be shared upon request for approved press and partnership use.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Press;
