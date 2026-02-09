export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'MPM' | 'KEMAHASISWAAN' | 'BEM' | 'STUDENT';
export type AspirationStatus = 'PENDING' | 'REVIEW' | 'DIPROSES' | 'SELESAI';
export type AspirationCategory = 'AKADEMIK' | 'FASILITAS' | 'ORGANISASI' | 'LAINNYA';
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
}
export interface AspirationResponse {
  id: string;
  authorRole: UserRole;
  content: string;
  timestamp: number;
}
export interface CreateAspirationRequest {
  name: string;
  email: string;
  category: AspirationCategory;
  subject: string;
  description: string;
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