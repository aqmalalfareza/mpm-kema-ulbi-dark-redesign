import { Hono } from "hono";
import type { Env } from './core-utils';
import { AspirationEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { CreateAspirationRequest, AuthRequest, UserRole } from "@shared/types";
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
  // Public/Internal: List Aspirations (Mocking filtered list)
  app.get('/api/aspirations', async (c) => {
    try {
      const { items } = await AspirationEntity.list(c.env, null, 100);
      return ok(c, { items });
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
}