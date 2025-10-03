import { z } from "zod";
import { AvailabilityRepository } from "./Availability.repository";

const SlotsSchema = z.object({
  providerId: z.string().min(1),
  slots: z
    .array(z.object({ iso: z.string().datetime() }))
    .min(1),
});

export const AvailabilityService = {
  async saveSlots(payload: unknown) {
    const data = SlotsSchema.parse(payload);
    const slots = data.slots
      .map((s) => new Date(s.iso))
      .filter((d) => !Number.isNaN(d.getTime()));
    const inserted = await AvailabilityRepository.upsertSlots(
      data.providerId,
      slots
    );
    return { inserted };
  },

  async list(providerId: string) {
    console.log(`🔍 Service: Recherche des créneaux pour providerId: ${providerId}`);
    const result = await AvailabilityRepository.listByProvider(providerId);
    console.log(`📊 Service: ${result.length} créneaux trouvés`);
    return result;
  },

  async removeSlot(providerId: string, iso: string) {
    return AvailabilityRepository.deleteSlot(providerId, iso);
  },
};


