import { supabase } from './supabase';

export interface CampingTrip {
  id: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  rec_gov_url: string | null;
  start_date: string;
  end_date: string;
  status: 'planned' | 'confirmed' | 'completed';
  created_at: string;
  updated_at: string;
}

export type CampingTripInsert = Omit<CampingTrip, 'id' | 'created_at' | 'updated_at'>;
export type CampingTripUpdate = Partial<CampingTripInsert>;

export async function fetchTrips(): Promise<CampingTrip[]> {
  const { data, error } = await supabase
    .from('camping_trips')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTrip(trip: CampingTripInsert): Promise<CampingTrip> {
  const { data, error } = await supabase.from('camping_trips').insert([trip]).select().single();

  if (error) throw error;
  return data;
}

export async function updateTrip(id: string, updates: CampingTripUpdate): Promise<CampingTrip> {
  const { data, error } = await supabase
    .from('camping_trips')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('camping_trips').delete().eq('id', id);

  if (error) throw error;
}
