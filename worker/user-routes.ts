import { Hono } from "hono";
import type { Env } from './core-utils';
import { AspirationEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { 
  CreateAspirationRequest, 
  AuthRequest, 
  UserRole, 
  UpdateAspirationRequest, 
  AddResponseRequest,
  AspirationResponse
} from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Mock Auth
  app.post('/api/auth/login', async (c) => {
    const { username } = await c.req.json() as AuthRequest;
    const demoUsers: Record<string, { name: string, role: UserRole }> = {
      'admin_mpm': { name: 'Admin MPM ULBI', role: 'MPM' },
      'staff_kema': { name: 'Staff Kemahasiswaan', role: 'KEMAHASISWAAN' },
      'bem_ulbi': { name: 'Presiden BEM', role: 'BEM' }
    };
    const user = demoUsers[username];
    if (!user) return bad(c, "User tidak ditemukan");
    return ok(c, {
      user: { id: username, ...user, username },
      token: "mock-jwt-token"
    });
  });
  // Internal: List Aspirations
  app.get('/api/aspirations', async (c) => {
    try {
      const { items } = await AspirationEntity.list(c.env, null, 100);
      return ok(c, { items: items.sort((a, b) => b.createdAt - a.createdAt) });
    } catch (e) {
      return ok(c, { items: [] });
    }
  });
  // Public: Submit Aspiration
  app.post('/api/aspirations', async (c) => {
    try {
      const body = await c.req.json() as CreateAspirationRequest;
      if (!body.name || !body.email || !body.subject || !body.description) {
        return bad(c, "Semua field wajib diisi");
      }
      const aspiration = await AspirationEntity.createNew(c.env, body);
      return ok(c, aspiration);
    } catch (e) {
      return bad(c, "Gagal mengirim aspirasi");
    }
  });
  // Public: Track Aspiration
  app.get('/api/aspirations/track/:trackingId', async (c) => {
    const trackingId = c.req.param('trackingId');
    const aspiration = await AspirationEntity.getByTrackingId(c.env, trackingId);
    if (!aspiration) return notFound(c, "Aspirasi tidak ditemukan");
    return ok(c, aspiration);
  });
  // Internal: Update Aspiration (Status, Assignment, Internal Notes)
  app.patch('/api/aspirations/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as UpdateAspirationRequest;
    const ent = new AspirationEntity(c.env, id);
    if (!await ent.exists()) return notFound(c);
    const updated = await ent.mutate(s => ({
      ...s,
      ...body,
      updatedAt: Date.now()
    }));
    return ok(c, updated);
  });
  // Internal: Add Official Response
  app.post('/api/aspirations/:id/responses', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as AddResponseRequest;
    const ent = new AspirationEntity(c.env, id);
    if (!await ent.exists()) return notFound(c);
    const newResponse: AspirationResponse = {
      id: crypto.randomUUID(),
      authorRole: body.authorRole,
      authorName: body.authorName,
      content: body.content,
      timestamp: Date.now(),
      statusAtResponse: (await ent.getState()).status
    };
    const updated = await ent.mutate(s => ({
      ...s,
      responses: [...(s.responses || []), newResponse],
      updatedAt: Date.now()
    }));
    return ok(c, updated);
  });
}