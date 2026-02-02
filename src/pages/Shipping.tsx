import { Layout } from "@/components/layout/Layout";

const Shipping = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Delivery & Handling</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Shipping Policy
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Learn how your ZahraLareina pieces travel from our online boutique to your doorstep with care.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Shipping Regions
              </h2>
              <p>
                We currently ship across Pakistan. International shipping may be introduced in the future; updates will be shared on our official channels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Processing Time
              </h2>
              <p>
                Orders are typically processed within 1–3 business days. During launches or peak seasons, processing may take slightly longer, but our team will keep you informed wherever possible.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Estimated Delivery
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Major cities: 2–5 business days after dispatch</li>
                <li>Other locations within Pakistan: 3–7 business days after dispatch</li>
              </ul>
              <p>
                Delivery timelines are estimates and may vary slightly based on courier operations, weather, or public holidays.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Shipping Fees
              </h2>
              <p>
                Shipping charges will be displayed at checkout based on your delivery address and order value. From time to time, ZahraLareina may offer complimentary shipping promotions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Order Tracking
              </h2>
              <p>
                Once your order has been dispatched, you will receive a tracking reference via email or SMS from our courier partner so you can follow your parcel&apos;s journey.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Questions About Shipping
              </h2>
              <p>
                If you have any questions regarding delivery, or if you require special handling, please contact our support team via the Contact page before placing your order.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
