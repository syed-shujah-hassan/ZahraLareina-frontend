import { useEffect, useState } from 'react';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | string;
  createdAt: string;
}

const AdminContactMessages = () => {
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError('');

        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) {
          setError('Not authorized');
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/admin/contact-messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load messages');
        }

        const mapped: ContactMessage[] = (data.messages as any[]).map(m => ({
          id: m._id,
          fullName: m.fullName,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: m.status,
          createdAt: m.createdAt,
        }));

        setMessages(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [API_BASE]);

  const markAsRead = async (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, status: 'read' } : m)));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/contact-messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl tracking-wide mb-2">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage messages sent from the contact form.</p>
      </div>

      {/* Error / Loading */}
      {loading ? (
        <div className="admin-card py-6 text-center text-sm text-muted-foreground">Loading messages...</div>
      ) : error ? (
        <div className="admin-card py-6 text-center text-sm text-destructive">{error}</div>
      ) : null}

      {/* Messages Table */}
      {!loading && !error && (
        <div className="admin-card overflow-x-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contact messages yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Message</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => {
                  const created = new Date(msg.createdAt);
                  const statusClass =
                    msg.status === 'new'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-secondary text-foreground border-border';

                  return (
                    <tr
                      key={msg.id}
                      className="border-b border-border hover:bg-secondary/50 cursor-pointer"
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'new') {
                          markAsRead(msg.id);
                        }
                      }}
                    >
                      <td className="py-4 px-4 font-medium">{msg.fullName}</td>
                      <td className="py-4 px-4 text-muted-foreground">{msg.email}</td>
                      <td className="py-4 px-4">{msg.subject}</td>
                      <td className="py-4 px-4 max-w-md">
                        <p className="line-clamp-3 text-muted-foreground">{msg.message}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
                        >
                          {msg.status === 'new' ? 'New' : 'Read'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground text-xs">
                        {created.toLocaleDateString()} {created.toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Message detail modal */}
      {selectedMessage && (
        <>
          <div
            className="fixed inset-0 bg-foreground/30 z-50"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-background z-50 border border-border shadow-medium max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl mb-1">{selectedMessage.subject}</h2>
                <p className="text-xs text-muted-foreground">
                  From: {selectedMessage.fullName} ({selectedMessage.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs text-muted-foreground">
                {new Date(selectedMessage.createdAt).toLocaleDateString()} {" "}
                {new Date(selectedMessage.createdAt).toLocaleTimeString()}
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContactMessages;
