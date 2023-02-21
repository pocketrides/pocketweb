import { Api, type ApiGenericResponse } from '../api';

export class StripeCreateAccountRequest {
  static endpoint = '/_/stripe/account/create';

  static async post() {
    return Api.post<ApiGenericResponse>(this.endpoint, {}, Api.generic_response);
  }
}
