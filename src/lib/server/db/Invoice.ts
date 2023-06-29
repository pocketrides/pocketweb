import type { ServerInvoice, DraftInvoice } from '$lib/zod/Invoice';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';

export class Invoice {
  static collection = 'invoices';

  static async create(nametag_id: string, draft: DraftInvoice) {
    const data = Object.assign(draft, {
      nametag_ref: Nametag.toRef(nametag_id),
      minted: false
    });

    return await Fauna.create<ServerInvoice>(
      Invoice.collection,
      data,
      Invoice.parseFQL
    );
  }

  static async getById(invoice_id: string) {
    return await Fauna.get<ServerInvoice>(
      Invoice.toRef(invoice_id),
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
    return Fauna.parseFQL<ServerInvoice>(fql, ['nametag_ref']);
  }

  static toRef(invoice_id: string) {
    return Fauna.toRef(Invoice.collection, invoice_id);
  }
}
