import { Request } from 'express';

export interface AdminPayload {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}
