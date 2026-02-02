import { Layout } from "@/components/layout/Layout";

const Careers = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Join the Vision</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Careers
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Help shape the future of ZahraLareina as we grow our online luxury boutique and community.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Working With Us
              </h2>
              <p>
                ZahraLareina is a growing, online-first brand. We value creativity, responsibility, and a strong eye for detail. Our work often blends fashion, digital storytelling, and customer experience.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Current Opportunities
              </h2>
              <p>
                At this stage, we may not always have open full-time roles. However, we are open to hearing from talented individuals in areas such as content creation, styling, customer experience, and operations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                How to Reach Out
              </h2>
              <p>
                If you feel aligned with ZahraLareina&apos;s aesthetic and values, you can share your portfolio or CV with a short introduction via email:
              </p>
              <p className="font-serif text-base text-foreground">careers@zahralareina.com</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
