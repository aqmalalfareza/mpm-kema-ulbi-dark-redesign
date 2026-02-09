import { Hono } from "hono";
import type { Env } from './core-utils';
import { AspirationEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { CreateAspirationRequest } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
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