import type { ServerInvoice, DraftInvoice } from '$lib/zod/Invoice';
import { Account } from './Account';
import { Fauna } from './Fauna';

export class Invoice {
  static collection = 'invoices';

  static async create(account_id: string, draft: DraftInvoice) {
    const data = Object.assign(draft, {
      account_ref: Account.toRef(account_id),
      minted: false
    });

    return await Fauna.create<ServerInvoice>(
      Invoice.collection,
      data,
      Invoice.parseFQL
    );
  }

  static async getById(invoice_id: string) {
    return await Fauna.one<ServerInvoice>(
      'invoices_by_id',
      invoice_id,
      Invoice.parseFQL
    );
  }

  static async getByStripeInvoiceId(stripe_invoice_id: string) {
    return await Fauna.one<ServerInvoice>(
      'invoices_by_stripe_invoice_id',
      stripe_invoice_id,
      Invoice.parseFQL
    );
  }

  static async update(invoice_id: string, data: Partial<DraftInvoice>) {
    return await Fauna.update<ServerInvoice>(
      Invoice.toRef(invoice_id),
      data,
      Invoice.parseFQL
    );
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerInvoice>(fql, ['account_ref']);
  }

  static toRef(invoice_id: string) {
    return Fauna.toRef(Invoice.collection, invoice_id);
  }
}
