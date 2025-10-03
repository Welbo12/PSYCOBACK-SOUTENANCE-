export interface AvailabilitySlot {
  id: number;
  provider_id: string;
  slot_time: Date;
  is_booked: boolean;
  created_at: Date;
}

export interface CreateAvailabilityPayload {
  providerId: string;
  slots: Date[];
}


