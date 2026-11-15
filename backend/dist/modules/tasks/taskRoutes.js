import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
const router = Router();
router.get('/', (req, res) => {
    const orgId = req.query.org_id || 'org-locari-01';
    const tasks = store.tasks.filter(t => t.org_id === orgId);
    const enhanced = tasks.map(t => {
        const assignedUser = t.assigned_to ? store.findUserById(t.assigned_to) : undefined;
        const property = t.related_property_id ? store.properties.find(p => p.id === t.related_property_id) : undefined;
        const unit = t.related_unit_id ? store.units.find(u => u.id === t.related_unit_id) : undefined;
        return {
            ...t,
            assigned_name: assignedUser?.full_name || 'Unassigned',
            property_name: property?.name || null,
            unit_number: unit?.unit_number || null
        };
    });
    res.json(enhanced);
});
router.post('/', (req, res) => {
    const { org_id = 'org-locari-01', title, description, priority = 'medium', due_date, assigned_to, related_property_id, related_unit_id } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const now = new Date().toISOString();
    const task = {
        id: `tsk-${uuidv4().slice(0, 8)}`,
        org_id,
        title,
        description,
        priority,
        status: 'todo',
        due_date,
        assigned_to,
        related_property_id,
        related_unit_id,
        created_at: now,
        updated_at: now
    };
    store.tasks.unshift(task);
    res.status(201).json(task);
});
router.patch('/:id', (req, res) => {
    const task = store.tasks.find(t => t.id === String(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { status, priority, due_date, assigned_to } = req.body;
    if (status)
        task.status = status;
    if (priority)
        task.priority = priority;
    if (due_date)
        task.due_date = due_date;
    if (assigned_to !== undefined)
        task.assigned_to = assigned_to;
    task.updated_at = new Date().toISOString();
    res.json(task);
});
export default router;
