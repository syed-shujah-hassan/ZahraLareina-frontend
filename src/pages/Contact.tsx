import { Layout } from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">We'd Love to Hear From You</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              For bespoke assistance, order inquiries, or styling advice, our online ZahraLareina concierge team is here for you.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Details */}
            <div className="space-y-8 lg:col-span-1 animate-fade-up">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                  Boutique Support
                </h2>
                <p className="font-serif text-lg mb-2">contact@zahralareina.com</p>
                <p className="text-sm text-muted-foreground">
                  Our team typically responds within 24 hours, Monday to Saturday.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                  Phone
                </h2>
                <p className="font-serif text-lg mb-2">+92 339 4579758</p>
                <p className="text-sm text-muted-foreground">
                  10:00 AM – 7:00 PM (Pakistan Standard Time)
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                  Online Boutique</h2>
                <p className="text-sm text-muted-foreground">
                  ZahraLareina currently operates as an online-only luxury boutique. All orders and support are handled digitally with care.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-fade-up">
              <div className="bg-card border border-border px-8 py-10 shadow-soft">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                      placeholder="How may we assist you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none"
                      placeholder="Share details about your request, order, or styling question."
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>
                      By sending this form you agree to our boutique terms of service.
                    </p>
                  </div>

                  <button type="submit" className="w-full md:w-auto btn-luxury mt-4">
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
