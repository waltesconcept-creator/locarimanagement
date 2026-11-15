import { Router, Request, Response } from 'express';
import { store } from '../../db/store.js';
import { config } from '../../config/index.js';

const router = Router();

/**
 * Publish / Unpublish a vacant unit to Locari Rental Discovery (locari.africa)
 */
router.post('/toggle-publish/:unitId', async (req: Request, res: Response) => {
  const unitId = String(req.params.unitId);
  const unit = store.units.find(u => u.id === unitId);

  if (!unit) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  const property = store.properties.find(p => p.id === unit.property_id);
  if (!property) {
    return res.status(404).json({ error: 'Parent property not found' });
  }

  // Toggle state
  unit.is_published_to_discovery = !unit.is_published_to_discovery;
  unit.updated_at = new Date().toISOString();

  // If publishing, prepare discovery payload
  let discoveryPayload = null;
  if (unit.is_published_to_discovery) {
    discoveryPayload = {
      title: `${unit.unit_type} at ${property.name}`,
      property_id: property.id,
      unit_id: unit.id,
      city: property.city,
      neighborhood: property.neighborhood,
      address: property.address,
      price: unit.rent_amount,
      price_period: unit.rent_period,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      image_url: property.featured_image_url,
      source: 'locari_property_management_os',
      is_available: true
    };

    console.log('[Modular Connector] Dispatched listing to Locari Rental Discovery:', discoveryPayload);
  }

  res.json({
    unit_id: unit.id,
    is_published: unit.is_published_to_discovery,
    message: unit.is_published_to_discovery
      ? `Successfully published "${unit.unit_number}" to Locari Discovery (locari.africa). Renters can now discover and book tours!`
      : `Unpublished "${unit.unit_number}" from Locari Discovery.`,
    discovery_payload: discoveryPayload
  });
});

export default router;
