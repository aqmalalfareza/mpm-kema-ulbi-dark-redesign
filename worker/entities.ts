import { IndexedEntity } from "./core-utils";
import type { Aspiration, CreateAspirationRequest } from "@shared/types";
export class AspirationEntity extends IndexedEntity<Aspiration> {
  static readonly entityName = "aspiration";
  static readonly indexName = "aspirations";
  static readonly initialState: Aspiration = {
    id: "",
    trackingId: "",
    name: "",
    email: "",
    category: "LAINNYA",
    subject: "",
    description: "",
    status: "PENDING",
    createdAt: 0,
    updatedAt: 0,
    responses: []
  };
  static async generateTrackingId(): Promise<string> {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ASP-${timestamp}${random}`;
  }
  static async createNew(env: any, data: CreateAspirationRequest): Promise<Aspiration> {
    const id = crypto.randomUUID();
    const trackingId = await this.generateTrackingId();
    const now = Date.now();
    const aspiration: Aspiration = {
      ...this.initialState,
      id,
      trackingId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    // Store in primary storage and index by ID
    await this.create(env, aspiration);
    // Custom index: track by trackingId separately for fast public lookups
    const trackIndex = new (class extends IndexedEntity<{id: string, refId: string}> {
      static readonly entityName = "track-map";
      static readonly indexName = "track-mapping";
      static readonly initialState = { id: "", refId: "" };
    })(env, trackingId);
    await trackIndex.save({ id: trackingId, refId: id });
    return aspiration;
  }
  static async getByTrackingId(env: any, trackingId: string): Promise<Aspiration | null> {
    const trackInstance = new (class extends IndexedEntity<{id: string, refId: string}> {
      static readonly entityName = "track-map";
      static readonly indexName = "track-mapping";
      static readonly initialState = { id: "", refId: "" };
    })(env, trackingId);
    const mapping = await trackInstance.getState();
    if (!mapping.refId) return null;
    const asp = new AspirationEntity(env, mapping.refId);
    if (!await asp.exists()) return null;
    return await asp.getState();
  }
}