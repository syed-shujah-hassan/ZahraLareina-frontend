import { Layout } from "@/components/layout/Layout";

const faqs = [
  {
    question: "Where do you ship from?",
    answer:
      "All orders are prepared and dispatched from within Pakistan via our trusted courier partners.",
  },
  {
    question: "How long will delivery take?",
    answer:
      "Major cities typically receive orders within 2–5 business days after dispatch, while other locations may take 3–7 business days.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "If your order has not yet been processed or dispatched, we may be able to help. Please contact us as soon as possible with your order ID.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes, selected items may be eligible under our Returns & Exchanges policy. Please review the full details on the Returns page.",
  },
  {
    question: "Are all items original and authentic?",
    answer:
      "Every ZahraLareina piece is curated with care and is intended to reflect a refined, luxury aesthetic. Product details are clearly mentioned on each item page.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our team via the Contact page or by emailing contact@zahralareina.com.",
  },
];

const Faqs = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-luxury-subtitle mb-3">Questions & Guidance</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.18em] uppercase mb-4">
              FAQs
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Find quick answers to the most common questions about ZahraLareina&apos;s online boutique, orders, and policies.
            </p>
            <div className="flex justify-center mt-6">
              <div className="gold-line" />
            </div>
          </div>

          <div className="space-y-6">
            {faqs.map((item, index) => (
              <div
                key={item.question}
                className="bg-card border border-border px-6 py-5 shadow-soft hover:shadow-luxury transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <h2 className="text-sm md:text-base font-semibold text-foreground mb-2">
                  {item.question}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faqs;
