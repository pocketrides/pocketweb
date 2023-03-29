import { Api, type ApiGenericResponse } from '../api';

export class NametagDeleteRequest {
  static endpoint = `/_/nametag/delete`;

  static async post() {
    return Api.post<ApiGenericResponse>(this.endpoint, {}, Api.generic_response);
  }
}
