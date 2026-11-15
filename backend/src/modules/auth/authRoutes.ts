import { Router, Request, Response } from 'express';
import { store } from '../../db/store.js';

const router = Router();

/**
 * Verify Magic Token from WhatsApp Link
 */
router.get('/magic-verify', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const phone = req.query.phone as string;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const magic = store.magicTokens.find(m => m.token === token);
  if (!magic) {
    // If not found, check if phone was provided and look up user
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      const user = store.findUserByPhone(cleanPhone);
      if (user) {
        const org = store.organizations.find(o => o.id === user.org_id);
        return res.json({ user, organization: org, token });
      }
    }
    return res.status(401).json({ error: 'Invalid or expired magic token' });
  }

  // Mark token as used
  magic.used_at = new Date().toISOString();

  const user = store.findUserById(magic.user_id);
  const organization = store.organizations.find(o => o.id === magic.org_id);

  if (!user || !organization) {
    return res.status(404).json({ error: 'User or Organization not found' });
  }

  res.json({
    user,
    organization,
    token: magic.token
  });
});

/**
 * Direct Login by Phone or Email
 */
router.post('/login', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier (phone or email) is required' });
  }

  const clean = identifier.replace(/[^0-9]/g, '');
  const user = store.users.find(u => 
    (clean.length > 5 && u.phone.replace(/[^0-9]/g, '').includes(clean)) ||
    (u.email && u.email.toLowerCase() === identifier.toLowerCase())
  );

  if (!user) {
    // If not found, let them log in as demo PM user
    const fallbackUser = store.users[0];
    const organization = store.organizations.find(o => o.id === fallbackUser.org_id);
    return res.json({ user: fallbackUser, organization, token: `session_${fallbackUser.id}` });
  }

  const organization = store.organizations.find(o => o.id === user.org_id);
  res.json({ user, organization, token: `session_${user.id}` });
});

/**
 * Register New Account
 */
router.post('/register', (req: Request, res: Response) => {
  const { fullName, email, phone, role, orgName } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Full name and phone number are required' });
  }

  const { user, organization } = store.createUser({
    fullName,
    email: email || `${phone.replace(/[^0-9]/g, '')}@locari.pm`,
    phone,
    role: role === 'landlord' ? 'landlord' : 'property_manager',
    orgName
  });

  res.status(201).json({
    message: 'Account created successfully',
    user,
    organization,
    token: `session_${user.id}`
  });
});

/**
 * Get current user profile
 */
router.get('/me', (req: Request, res: Response) => {
  const user = store.users[0]; // Default to primary PM for local session
  const organization = store.organizations.find(o => o.id === user.org_id);
  res.json({ user, organization });
});

export default router;
