import { Hono } from "hono";
import type { Env } from './core-utils';
import { AspirationEntity, LegislativeEntity, StructureEntity, SupervisionEntity } from "./entities";
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
  // Public: Global Stats
  app.get('/api/stats', async (c) => {
    try {
      const { items } = await AspirationEntity.list(c.env, null, 1000);
      return ok(c, {
        total: items.length,
        pending: items.filter(i => i.status === 'PENDING').length,
        processed: items.filter(i => i.status === 'DIPROSES' || i.status === 'REVIEW').length,
        completed: items.filter(i => i.status === 'SELESAI').length,
      });
    } catch (e) {
      return ok(c, { total: 0, pending: 0, processed: 0, completed: 0 });
    }
  });
  // Mock Auth
  app.post('/api/auth/login', async (c) => {
    const { username } = await c.req.json() as AuthRequest;
    const demoUsers: Record<string, { name: string, role: UserRole }> = {
      'admin_mpm': { name: 'Admin MPM ULBI', role: 'MPM' },
      'staff_kema': { name: 'Staff Kemahasiswaan', role: 'KEMAHASISWAAN' },
      'bem_ulbi': { name: 'Presiden BEM', role: 'BEM' }
    };
    const user = demoUsers[username];
    if (!user) return bad(c, "Akses ditolak: User tidak terdaftar");
    return ok(c, {
      user: { id: username, ...user, username },
      token: "mock-session-token"
    });
  });
  // Internal: List
  app.get('/api/aspirations', async (c) => {
    try {
      const { items } = await AspirationEntity.list(c.env, null, 100);
      return ok(c, { items: items.sort((a, b) => b.createdAt - a.createdAt) });
    } catch (e) {
      return ok(c, { items: [] });
    }
  });
  // Public: Submit
  app.post('/api/aspirations', async (c) => {
    try {
      const body = await c.req.json() as CreateAspirationRequest;
      if (!body.name || !body.email || !body.subject || !body.description) {
        return bad(c, "Lengkapi seluruh informasi wajib");
      }
      const aspiration = await AspirationEntity.createNew(c.env, body);
      return ok(c, aspiration);
    } catch (e) {
      return bad(c, "Gagal memproses aspirasi");
    }
  });
  // Public: Track
  app.get('/api/aspirations/track/:trackingId', async (c) => {
    const trackingId = c.req.param('trackingId').toUpperCase();
    const aspiration = await AspirationEntity.getByTrackingId(c.env, trackingId);
    if (!aspiration) return notFound(c, "Data pelacakan tidak ditemukan");
    return ok(c, aspiration);
  });
  // Internal: Update
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
  // Internal: Respond
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
      statusAtResponse: (await ent.getState()).status,
      fileUrl: body.fileUrl
    };
    const updated = await ent.mutate(s => ({
      ...s,
      responses: [...(s.responses || []), newResponse],
      updatedAt: Date.now()
    }));
    return ok(c, updated);
  });
  // Organizational Entities CRUD
  app.get('/api/legislative', async (c) => {
    const { items } = await LegislativeEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/legislative', async (c) => {
    const body = await c.req.json();
    const doc = await LegislativeEntity.create(c.env, { ...body, id: crypto.randomUUID(), updatedAt: Date.now() });
    return ok(c, doc);
  });
  app.get('/api/structure', async (c) => {
    const { items } = await StructureEntity.list(c.env);
    return ok(c, items.sort((a, b) => a.order - b.order));
  });
  app.post('/api/structure', async (c) => {
    const body = await c.req.json();
    const member = await StructureEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, member);
  });
  app.get('/api/supervision', async (c) => {
    const { items } = await SupervisionEntity.list(c.env);
    return ok(c, items.sort((a, b) => b.date - a.date));
  });
}