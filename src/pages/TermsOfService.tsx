import { Layout } from "@/components/layout/Layout";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Using Our Online Boutique</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              These terms outline how you may use the ZahraLareina website, place orders, and interact with our services.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Acceptance of Terms
              </h2>
              <p>
                By using the ZahraLareina website, you agree to these Terms of Service and to any additional policies referenced, such as our Privacy Policy and Returns Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Online Boutique Use
              </h2>
              <p>
                You agree to use this website for lawful purposes only and not to engage in any activity that could harm, disrupt, or misuse the platform or other users&apos; experience.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Orders & Availability
              </h2>
              <p>
                All orders are subject to availability and acceptance. We reserve the right to limit quantities, refuse orders, or cancel an order if there is an issue with payment, stock, or suspected misuse.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Pricing & Payment
              </h2>
              <p>
                Prices displayed on the site are in the applicable currency and may change without prior notice. We work with secure payment partners to process your transactions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Content & Intellectual Property
              </h2>
              <p>
                All content on the ZahraLareina website, including imagery, text, and branding, is owned or licensed by us and may not be used without permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Changes to These Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time. Continued use of the website after changes are posted will be considered acceptance of the updated terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Contact
              </h2>
              <p>
                If you have questions about these terms, please reach out via the Contact page or email us at <span className="font-serif text-foreground">contact@zahralareina.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
