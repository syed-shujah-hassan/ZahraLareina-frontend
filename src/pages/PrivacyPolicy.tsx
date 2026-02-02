import { Layout } from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Your Data, Handled With Care</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              This page explains how ZahraLareina (our online boutique) collects, uses, and protects your information when you interact with our website.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Information We Collect
              </h2>
              <p>
                We may collect basic information such as your name, email address, phone number, shipping address, and order details when you place an order, create an account, or contact us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                How We Use Your Information
              </h2>
              <p>
                Your information is used to process orders, communicate with you about purchases and support, improve our services, and share updates or offers where you have chosen to receive them.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Data Security
              </h2>
              <p>
                We take reasonable steps to protect your information and use reputable service providers for payments and hosting. However, no online platform can guarantee absolute security.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Cookies & Analytics
              </h2>
              <p>
                Our website may use cookies or similar technologies to understand site usage and enhance your experience. You can adjust your browser settings to manage cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Third-Party Services
              </h2>
              <p>
                We may rely on third-party tools for payments, analytics, or communication. These providers have their own privacy policies, and we recommend reviewing them when using their services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Your Choices
              </h2>
              <p>
                You can contact us to update certain personal details or ask questions about how your information is used. If you no longer wish to receive marketing messages, you may opt out via the link provided in those communications (where applicable).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Contact
              </h2>
              <p>
                For any privacy-related questions, please reach out via the Contact page or email us at <span className="font-serif text-foreground">contact@zahralareina.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
