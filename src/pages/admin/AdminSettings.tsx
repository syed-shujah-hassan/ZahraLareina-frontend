import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'Light Ivory', bg: 'bg-[hsl(45,33%,98%)]', fg: 'bg-[hsl(0,0%,8%)]', accent: 'bg-[hsl(43,74%,49%)]' },
  { name: 'Dark Noir', bg: 'bg-[hsl(0,0%,5%)]', fg: 'bg-[hsl(45,33%,98%)]', accent: 'bg-[hsl(43,74%,55%)]' },
  { name: 'Warm Sand', bg: 'bg-[hsl(35,30%,95%)]', fg: 'bg-[hsl(25,20%,15%)]', accent: 'bg-[hsl(30,60%,50%)]' },
];

const AdminSettings = () => {
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [storeName, setStoreName] = useState('ZahraLareina');
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [currency, setCurrency] = useState('PKR');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError('');

        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) {
          setError('Not authorized');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load settings');
        }

        const s = data.settings || {};
        if (s.storeName) setStoreName(s.storeName);
        if (typeof s.themeIndex === 'number') setSelectedTheme(s.themeIndex);
        if (s.currency) setCurrency(s.currency);
      } catch (err: any) {
        setError(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [API_BASE]);

  const handleSave = async () => {
    try {
      setIsSaved(false);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        setError('Not authorized');
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeName,
          currency,
          themeIndex: selectedTheme,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your store settings</p>
      </div>

      {/* Error / Loading */}
      {loading ? (
        <div className="admin-card py-4 text-sm text-muted-foreground">Loading settings...</div>
      ) : error ? (
        <div className="admin-card py-4 text-sm text-destructive">{error}</div>
      ) : null}

      {/* Store Settings */}
      <div className="admin-card space-y-6">
        <h2 className="font-serif text-xl mb-4">Store Information</h2>
        
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.15em] mb-2 text-muted-foreground">
            Currency
          </label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground"
          >
            <option value="PKR">PKR (Rs)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="admin-card space-y-6">
        <h2 className="font-serif text-xl mb-4">Theme</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme, index) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(index)}
              className={cn(
                "p-4 border transition-all",
                selectedTheme === index ? "border-foreground" : "border-border hover:border-muted-foreground"
              )}
            >
              <div className="flex gap-2 mb-3">
                <div className={cn("w-8 h-8 rounded-full", theme.bg, "border border-border")} />
                <div className={cn("w-8 h-8 rounded-full", theme.fg)} />
                <div className={cn("w-8 h-8 rounded-full", theme.accent)} />
              </div>
              <p className="text-sm">{theme.name}</p>
            </button>
          ))}
        </div>

        {/* Theme Preview */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] mb-4 text-muted-foreground">
            Preview
          </label>
          <div className={cn("p-6 border border-border", themes[selectedTheme].bg)}>
            <div className={cn("font-serif text-2xl tracking-wide mb-4", 
              selectedTheme === 1 ? "text-[hsl(45,33%,98%)]" : "text-[hsl(0,0%,8%)]"
            )}>
              {storeName}
            </div>
            <div className="flex gap-4">
              <div className={cn("px-6 py-3 text-xs uppercase tracking-[0.15em]", 
                themes[selectedTheme].fg,
                selectedTheme === 1 ? "text-[hsl(0,0%,5%)]" : "text-[hsl(45,33%,98%)]"
              )}>
                Shop Now
              </div>
              <div className={cn("px-6 py-3 text-xs uppercase tracking-[0.15em]", 
                themes[selectedTheme].accent,
                "text-white"
              )}>
                New Arrivals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={cn(
          "btn-luxury transition-all",
          isSaved && "bg-green-600"
        )}
      >
        <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
      </button>
    </div>
  );
};

export default AdminSettings;
