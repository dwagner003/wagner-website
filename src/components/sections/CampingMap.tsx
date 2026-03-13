import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CampingTrip } from '../../services/trips';
import { formatDateRange } from '../../utils/formatDateRange';
import { useEffect } from 'react';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface FitBoundsProps {
  trips: CampingTrip[];
}

function FitBounds({ trips }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      trips.map((t) => [t.latitude!, t.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, trips]);

  return null;
}

interface CampingMapProps {
  trips: CampingTrip[];
}

function groupByLocation(trips: CampingTrip[]) {
  const groups = new Map<string, CampingTrip[]>();
  for (const trip of trips) {
    const key = `${trip.latitude},${trip.longitude}`;
    const group = groups.get(key) ?? [];
    group.push(trip);
    groups.set(key, group);
  }
  return Array.from(groups.values());
}

export default function CampingMap({ trips }: CampingMapProps) {
  if (trips.length === 0) return null;

  const grouped = groupByLocation(trips);

  return (
    <div
      className="mb-6 rounded-lg border border-[var(--color-neon-cyan)]/20 overflow-hidden"
      role="img"
      aria-label="Map showing camping trip locations"
    >
      <MapContainer center={[39.5, -105.5]} zoom={7} className="h-64 sm:h-80 md:h-96 w-full">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <FitBounds trips={trips} />
        {grouped.map((group) => (
          <Marker
            key={`${group[0].latitude},${group[0].longitude}`}
            position={[group[0].latitude!, group[0].longitude!]}
            icon={defaultIcon}
          >
            <Popup>
              <div>
                <strong>{group[0].location}</strong>
                {group.map((trip) => (
                  <div key={trip.id}>
                    {formatDateRange(trip.start_date, trip.end_date)} — <em>{trip.status}</em>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
