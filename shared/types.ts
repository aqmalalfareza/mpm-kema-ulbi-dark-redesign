export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'MPM' | 'KEMAHASISWAAN' | 'BEM' | 'STUDENT';
export type AspirationStatus = 'PENDING' | 'REVIEW' | 'DIPROSES' | 'SELESAI';
export type AspirationCategory = 'AKADEMIK' | 'FASILITAS' | 'ORGANISASI' | 'PROPOSAL' | 'LAINNYA';
export interface AspirationResponse {
  id: string;
  authorRole: UserRole;
  authorName: string;
  content: string;
  timestamp: number;
  statusAtResponse: AspirationStatus;
  fileUrl?: string;
}
export interface Aspiration {
  id: string;
  trackingId: string;
  name: string;
  email: string;
  category: AspirationCategory;
  subject: string;
  description: string;
  status: AspirationStatus;
  createdAt: number;
  updatedAt: number;
  responses?: AspirationResponse[];
  internalNotes?: string;
  assignedTo?: UserRole;
  tanggapanKema?: string;
  tanggapanMpm?: string;
  fileUrl?: string;
  isFeedbackSent?: boolean;
}
export interface LegislativeDocument {
  id: string;
  title: string;
  category: string;
  url: string;
  updatedAt: number;
}
export interface StructureMember {
  id: string;
  name: string;
  position: string;
  imageUrl?: string;
  order: number;
}
export interface SupervisionActivity {
  id: string;
  title: string;
  date: number;
  description: string;
}
export interface DashboardStats {
  total: number;
  pending: number;
  processed: number;
  completed: number;
}
export interface CreateAspirationRequest {
  name: string;
  email: string;
  category: AspirationCategory;
  subject: string;
  description: string;
}
export interface UpdateAspirationRequest {
  status?: AspirationStatus;
  internalNotes?: string;
  assignedTo?: UserRole;
  tanggapanKema?: string;
  tanggapanMpm?: string;
}
export interface AddResponseRequest {
  content: string;
  authorRole: UserRole;
  authorName: string;
  fileUrl?: string;
}
export interface User {
  id: string;
  name: string;
  role: UserRole;
  username?: string;
}
export interface AuthRequest {
  username: string;
  password?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}