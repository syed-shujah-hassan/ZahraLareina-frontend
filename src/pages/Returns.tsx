import { Layout } from "@/components/layout/Layout";

const Returns = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Shop With Confidence</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              We want every ZahraLareina piece to feel perfect. Please review our returns guidelines before placing your order.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Eligibility
              </h2>
              <p>
                To qualify for a return or exchange, items must be unused, unworn, and in their original condition with all tags and packaging intact.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Time Window
              </h2>
              <p>
                Requests for returns or exchanges should be raised within 3 days of receiving your order. After this period, we may not be able to accommodate the request.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Non-Returnable Items
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Items marked as final sale or non-returnable at the time of purchase</li>
                <li>Accessories that have been worn or show signs of use</li>
                <li>Customized or made-to-order pieces</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Return Process
              </h2>
              <ol className="list-decimal list-inside space-y-1">
                <li>Contact our support team via the Contact page or email with your order ID.</li>
                <li>Once approved, you will receive guidance on how to ship the item back to us.</li>
                <li>After inspection, we will process your exchange or credit as per our policy.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Refunds & Store Credit
              </h2>
              <p>
                Depending on the nature of your order and the condition of the returned item, you may be eligible for an exchange, store credit, or, in limited cases, a refund. Exact details will be communicated during the support process.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Need Assistance?
              </h2>
              <p>
                Our team is here to help. If you have any concerns about sizing, colors, or materials, we recommend reaching out before placing your order so we can guide you.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Returns;
