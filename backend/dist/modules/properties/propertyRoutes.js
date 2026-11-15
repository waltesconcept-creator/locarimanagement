import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
const router = Router();
/**
 * Get all properties with units and stats
 */
router.get('/', (req, res) => {
    const orgId = req.query.org_id || 'org-locari-01';
    const properties = store.getPropertiesByOrg(orgId);
    const enhanced = properties.map(p => {
        const units = store.getUnitsByProperty(p.id);
        const landlord = p.landlord_id ? store.findUserById(p.landlord_id) : undefined;
        const landlordProfile = p.landlord_id ? store.getLandlordProfile(p.landlord_id) : undefined;
        const occupiedCount = units.filter(u => u.status === 'occupied').length;
        const vacantCount = units.filter(u => u.status === 'vacant').length;
        const totalRent = units.reduce((sum, u) => sum + (u.status === 'occupied' ? u.rent_amount : 0), 0);
        return {
            ...p,
            units,
            stats: {
                total_units: units.length,
                occupied_units: occupiedCount,
                vacant_units: vacantCount,
                occupancy_rate: units.length > 0 ? Math.round((occupiedCount / units.length) * 100) : 0,
                annual_rent_roll: totalRent
            },
            landlord: landlord ? {
                id: landlord.id,
                name: landlord.full_name,
                phone: landlord.phone,
                is_diaspora: landlord.is_diaspora,
                country: landlord.country,
                profile: landlordProfile
            } : null
        };
    });
    res.json(enhanced);
});
/**
 * Add a new property and auto-generate units
 */
router.post('/', (req, res) => {
    const { org_id = 'org-locari-01', name, property_type = 'multi_family_residential', address, neighborhood, city = 'Ibadan', state = 'Oyo', landlord_id, manager_id, total_units = 1, rent_per_unit = 900000, featured_image_url } = req.body;
    if (!name || !address || !neighborhood) {
        return res.status(400).json({ error: 'Name, address, and neighborhood are required' });
    }
    const now = new Date().toISOString();
    const propId = `prop-${uuidv4().slice(0, 8)}`;
    const newProperty = {
        id: propId,
        org_id,
        landlord_id,
        manager_id,
        name,
        property_type,
        address,
        neighborhood,
        city,
        state,
        total_units: Number(total_units),
        featured_image_url: featured_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        is_managed: true,
        created_at: now,
        updated_at: now
    };
    store.properties.unshift(newProperty);
    // Auto-generate units
    const unitsCreated = [];
    for (let i = 1; i <= Number(total_units); i++) {
        const unitId = `unit-${uuidv4().slice(0, 8)}`;
        const unit = {
            id: unitId,
            org_id,
            property_id: propId,
            unit_number: `Flat ${i}`,
            unit_type: '3 Bedroom Apartment',
            bedrooms: 3,
            bathrooms: 3,
            rent_amount: Number(rent_per_unit),
            rent_period: 'year',
            service_charge: Math.round(Number(rent_per_unit) * 0.1),
            caution_deposit: Math.round(Number(rent_per_unit) * 0.1),
            legal_and_agency: Math.round(Number(rent_per_unit) * 0.2),
            status: 'vacant',
            is_published_to_discovery: false,
            created_at: now,
            updated_at: now
        };
        store.units.push(unit);
        unitsCreated.push(unit);
    }
    res.status(201).json({
        property: newProperty,
        units: unitsCreated
    });
});
/**
 * Update an existing apartment unit (status, price, discovery publishing)
 */
router.patch('/units/:id', (req, res) => {
    const unitId = String(req.params.id);
    const unit = store.units.find(u => u.id === unitId);
    if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
    }
    const { status, rent_amount, is_published_to_discovery, unit_type } = req.body;
    if (status)
        unit.status = status;
    if (rent_amount !== undefined)
        unit.rent_amount = Number(rent_amount);
    if (is_published_to_discovery !== undefined)
        unit.is_published_to_discovery = Boolean(is_published_to_discovery);
    if (unit_type)
        unit.unit_type = unit_type;
    unit.updated_at = new Date().toISOString();
    res.json(unit);
});
export default router;
