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
      'Zahralareena',
      'Zahralaraina',
      'Zahralareinaa',
      'Zahralareyna',
      'Zahra La Reina',
      'Zahra La Reena',
      'Zahra La Raina',
      'Zahra La Reyna',
      'ZahraLareina',
      'ZahraLareina Luxe',
      'Zahralareina Luxe',
      'Zahralarina',
      'Zahra Larina',
      'Zahra Reina',
      'Zahra Laraina',
      'Zahra Lareena',
      'Zahra Raina',
    ],
    url: 'https://zahralareina.com',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
