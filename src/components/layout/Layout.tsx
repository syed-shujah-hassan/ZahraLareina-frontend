import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zahralareina',
    alternateName: [
      'Zahralareina',
      'Zahralarina',
      'Zahralareina',
      'Zahra La Reina',
      'Zahra La Reina',
      'Zahra La Reina',
      'ZahraLareina',
      'ZahraLareina Luxe',
      'Zahralareina Luxe',
      'Zahralarina',
      'Zahra Larina',
      'Zahra Reina',
      'Zahra Laraina',
      'Zahra Lareina',
      'Zahra Raina',
    ],
    url: 'https://zahralareina.com',
  };

  // Exact heights for precise layout control
  const ANNOUNCEMENT_BAR_HEIGHT = 32; // 2rem? No, py-2 is 8px*2 = 16px, but let's make it precise 32px

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>
      
      {/* Top Announcement Bar - Always fixed at absolute top */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 bg-black text-white text-center py-2 text-xs uppercase tracking-widest overflow-hidden"
        style={{ height: `${ANNOUNCEMENT_BAR_HEIGHT}px` }}
      >
        <div className="inline-block animate-marquee whitespace-nowrap">
          <span className="mx-8">Delivery All Over Pakistan</span>
          <span className="mx-8">Cash On Delivery</span>
          <span className="mx-8">Support 24/7</span>
          <span className="mx-8">Easy Exchange & Return</span>
          <span className="mx-8">Delivery All Over Pakistan</span>
          <span className="mx-8">Cash On Delivery</span>
          <span className="mx-8">Support 24/7</span>
          <span className="mx-8">Easy Exchange & Return</span>
        </div>
      </div>
      
      {/* Navbar - Always fixed RIGHT below the announcement bar */}
      <div 
        className="fixed left-0 right-0 z-40"
        style={{ top: `${ANNOUNCEMENT_BAR_HEIGHT}px` }}
      >
        <Navbar />
      </div>
      
      {/* Main Content - NO padding-top so hero reaches top */}
      <main className="flex-1">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};
