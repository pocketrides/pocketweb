import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';

export type PayoutBoundary = {
  first_like_ref: ClientRef | Expr;
  last_like_ref: ClientRef | Expr;
  count: number;
  is_exact: boolean;
};

export type ServerPayout = PayoutBoundary & {
  id: string;
  ts: number;
  nametag_ref: ClientRef | Expr;
  status: 'started' | 'processing' | 'processing_error' | 'transferred';
};

export const humanStatus = (status: ServerPayout['status']): string => {
  switch (status) {
    case 'processing':
      return 'Processing';
    case 'processing_error':
      return 'Error';
    case 'started':
      return 'Just getting started!';
    case 'transferred':
      return 'Transferred to Stripe';
  }
};
