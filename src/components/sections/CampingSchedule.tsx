import { SectionHeading } from '../ui';
import { useCampingTrips, useDeleteTrip, useUpdateTrip } from '../../hooks/useCampingTrips';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import type { CampingTrip } from '../../services/trips';
import { useState } from 'react';

function TripSkeleton() {
  return (
    <div className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-4 sm:p-6 animate-pulse">
      <div className="h-5 bg-[var(--color-text-muted)]/10 rounded w-48 mb-3" />
      <div className="h-4 bg-[var(--color-text-muted)]/10 rounded w-32 mb-2" />
      <div className="h-5 bg-[var(--color-neon-cyan)]/5 rounded w-20" />
    </div>
  );
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' };

  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', opts)} - ${endDate.toLocaleDateString('en-US', yearOpts)}`;
  }
  return `${startDate.toLocaleDateString('en-US', yearOpts)} - ${endDate.toLocaleDateString('en-US', yearOpts)}`;
}

const statusColors: Record<CampingTrip['status'], string> = {
  planned: 'bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)]',
  confirmed: 'bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]',
  completed: 'bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]',
};

interface CampingScheduleProps {
  isAdmin: boolean;
}

export function CampingSchedule({ isAdmin }: CampingScheduleProps) {
  const { ref, isVisible } = useIntersectionObserver(0.1);
  const { data: trips, isLoading, isError } = useCampingTrips();
  const deleteMutation = useDeleteTrip();
  const updateMutation = useUpdateTrip();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CampingTrip>>({});

  const handleEdit = (trip: CampingTrip) => {
    setEditingId(trip.id);
    setEditForm({
      location: trip.location,
      start_date: trip.start_date,
      end_date: trip.end_date,
      status: trip.status,
      rec_gov_url: trip.rec_gov_url,
      latitude: trip.latitude,
      longitude: trip.longitude,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateMutation.mutate({ id, updates: editForm }, { onSuccess: () => setEditingId(null) });
  };

  return (
    <div ref={ref}>
      <SectionHeading>camping_schedule</SectionHeading>

      {isError && (
        <p className="font-mono text-sm text-[var(--color-text-muted)] text-center">
          Unable to load camping trips.
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" aria-busy="true">
          <TripSkeleton />
          <TripSkeleton />
          <TripSkeleton />
        </div>
      )}

      {!isLoading && !isError && trips?.length === 0 && (
        <p className="font-mono text-sm text-[var(--color-text-muted)] text-center">
          No trips scheduled yet.
        </p>
      )}

      {!isLoading && !isError && trips && trips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              className={`
                bg-[var(--color-bg-card)]
                backdrop-blur-sm
                border border-[var(--color-neon-cyan)]/20
                rounded-lg
                p-4 sm:p-6
                transition-all duration-500
                hover:border-[var(--color-neon-cyan)]
                hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {editingId === trip.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.location ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={editForm.start_date ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                      className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
                    />
                    <input
                      type="date"
                      value={editForm.end_date ?? ''}
                      onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                      className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
                    />
                  </div>
                  <select
                    value={editForm.status ?? 'planned'}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as CampingTrip['status'],
                      })
                    }
                    className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-neon-cyan)]/30 rounded px-3 py-2 font-mono text-sm text-[var(--color-text-primary)]"
                  >
                    <option value="planned">planned</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(trip.id)}
                      className="font-mono text-xs px-3 py-1 bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)] rounded hover:bg-[var(--color-neon-green)]/30 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="font-mono text-xs px-3 py-1 bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)] rounded hover:bg-[var(--color-text-muted)]/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono text-sm sm:text-base text-[var(--color-text-primary)] font-medium truncate mr-2">
                      {trip.location}
                    </h3>
                    <span
                      className={`font-mono text-[10px] sm:text-xs px-2 py-1 rounded flex-shrink-0 ${statusColors[trip.status]}`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-[var(--color-text-secondary)] mb-3">
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </p>

                  {trip.rec_gov_url && (
                    <a
                      href={trip.rec_gov_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-mono text-[10px] sm:text-xs text-[var(--color-neon-cyan)] hover:underline"
                    >
                      recreation.gov
                    </a>
                  )}

                  {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--color-neon-cyan)]/10">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="font-mono text-xs px-3 py-1 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded hover:bg-[var(--color-neon-cyan)]/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(trip.id)}
                        className="font-mono text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
