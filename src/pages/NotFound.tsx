import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-luxury-subtitle mb-4">Error 404</p>
          <h1 className="font-serif text-6xl md:text-8xl tracking-wide mb-6">
            Page Not Found
          </h1>
          <div className="flex justify-center mb-8">
            <div className="gold-line" />
          </div>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-luxury inline-block">
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
