import { IndexedEntity } from "./core-utils";
import type { 
  Aspiration, 
  CreateAspirationRequest,
  LegislativeDocument,
  StructureMember,
  SupervisionActivity
} from "@shared/types";
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
    const date = new Date();
    const YYYYMMDD = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ASP-${YYYYMMDD}-${random}`;
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
    await this.create(env, aspiration);
    // Tracking Index for fast lookup
    const trackInstance = new TrackMapEntity(env, trackingId);
    await trackInstance.save({ id: trackingId, refId: id });
    return aspiration;
  }
  static async getByTrackingId(env: any, trackingId: string): Promise<Aspiration | null> {
    const trackInstance = new TrackMapEntity(env, trackingId);
    const mapping = await trackInstance.getState();
    if (!mapping.refId) return null;
    const asp = new AspirationEntity(env, mapping.refId);
    if (!await asp.exists()) return null;
    return await asp.getState();
  }
}
export class TrackMapEntity extends IndexedEntity<{id: string, refId: string}> {
  static readonly entityName = "track-map";
  static readonly indexName = "track-mapping";
  static readonly initialState = { id: "", refId: "" };
}
export class LegislativeEntity extends IndexedEntity<LegislativeDocument> {
  static readonly entityName = "legislative";
  static readonly indexName = "legislative-docs";
  static readonly initialState: LegislativeDocument = { id: "", title: "", category: "", url: "", updatedAt: 0 };
}
export class StructureEntity extends IndexedEntity<StructureMember> {
  static readonly entityName = "structure";
  static readonly indexName = "structure-members";
  static readonly initialState: StructureMember = { id: "", name: "", position: "", order: 0 };
}
export class SupervisionEntity extends IndexedEntity<SupervisionActivity> {
  static readonly entityName = "supervision";
  static readonly indexName = "supervision-activities";
  static readonly initialState: SupervisionActivity = { id: "", title: "", date: 0, description: "" };
}