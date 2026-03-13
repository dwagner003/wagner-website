import { useState } from 'react';
import { useCreateTrip } from '../../hooks/useCampingTrips';
import type { User } from '@supabase/supabase-js';
import type { CampingTripInsert } from '../../services/trips';

interface CampingAdminBarProps {
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

const emptyForm: CampingTripInsert = {
  location: '',
  latitude: null,
  longitude: null,
  rec_gov_url: null,
  start_date: '',
  end_date: '',
  status: 'planned',
};

export function CampingAdminBar({
  isAdmin,
  user,
  loading,
  onSignIn,
  onSignOut,
}: CampingAdminBarProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CampingTripInsert>(emptyForm);
  const createMutation = useCreateTrip();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm(emptyForm);
        setShowForm(false);
      },
    });
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="mb-6 sm:mb-8">
        <button
          onClick={onSignIn}
          className="font-mono text-xs sm:text-sm px-4 py-2 border border-[var(--color-neon-cyan)]/30 text-[var(--color-text-secondary)] rounded hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)] transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mb-6 sm:mb-8">
        <button
          onClick={onSignOut}
          className="font-mono text-xs sm:text-sm px-4 py-2 border border-[var(--color-text-muted)]/30 text-[var(--color-text-muted)] rounded hover:border-[var(--color-text-muted)] transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-xs sm:text-sm px-4 py-2 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] border border-[var(--color-neon-cyan)]/30 rounded hover:bg-[var(--color-neon-cyan)]/20 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Trip'}
        </button>
        <button
          onClick={onSignOut}
          className="font-mono text-xs sm:text-sm px-4 py-2 border border-[var(--color-text-muted)]/30 text-[var(--color-text-muted)] rounded hover:border-[var(--color-text-muted)] transition-colors"
        >
          Sign Out
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-4 sm:p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="trip-location"
              className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
            >
              Location
            </label>
            <input
              id="trip-location"
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Rocky Mountain National Park"
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="trip-start-date"
                className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
              >
                Start Date
              </label>
              <input
                id="trip-start-date"
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <label
                htmlFor="trip-end-date"
                className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
              >
                End Date
              </label>
              <input
                id="trip-end-date"
                type="date"
                required
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="trip-status"
              className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
            >
              Status
            </label>
            <select
              id="trip-status"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as CampingTripInsert['status'] })
              }
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
            >
              <option value="planned">planned</option>
              <option value="confirmed">confirmed</option>
              <option value="completed">completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="trip-rec-gov-url"
              className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
            >
              Recreation.gov URL (optional)
            </label>
            <input
              id="trip-rec-gov-url"
              type="url"
              value={form.rec_gov_url ?? ''}
              onChange={(e) => setForm({ ...form, rec_gov_url: e.target.value || null })}
              placeholder="https://www.recreation.gov/..."
              className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="trip-latitude"
                className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
              >
                Latitude (optional)
              </label>
              <input
                id="trip-latitude"
                type="number"
                step="any"
                value={form.latitude ?? ''}
                onChange={(e) =>
                  setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })
                }
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <label
                htmlFor="trip-longitude"
                className="block font-mono text-xs text-[var(--color-text-muted)] mb-1"
              >
                Longitude (optional)
              </label>
              <input
                id="trip-longitude"
                type="number"
                step="any"
                value={form.longitude ?? ''}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })
                }
                className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="font-mono text-sm px-6 py-2 bg-[var(--color-neon-cyan)]/20 text-[var(--color-neon-cyan)] border border-[var(--color-neon-cyan)]/30 rounded hover:bg-[var(--color-neon-cyan)]/30 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Trip'}
          </button>
        </form>
      )}
    </div>
  );
}
