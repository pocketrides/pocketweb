import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';

export type PayoutBoundary = {
  first_like_ref: ClientRef | Expr;
  last_like_ref: ClientRef | Expr;
  count: number;
  is_exact: boolean;
  grand_total: number;
};

export type ServerPayout = PayoutBoundary & {
  id: string;
  ts: number;
  nametag_ref: ClientRef | Expr;
  status: 'idle' | 'processing' | 'processing_error' | 'transferred';
  error_status?: 'failed_transfer' | 'needs_restart';
};

export const humanStatus = (status: ServerPayout['status']): string => {
  switch (status) {
    case 'processing':
      return 'Processing';
    case 'processing_error':
      return 'Error';
    case 'idle':
      return 'Waiting to start';
    case 'transferred':
      return 'Transferred to Stripe';
  }
};
