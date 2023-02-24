import { z } from 'zod';

export class Api {
  static generic_success_validator = z.object({
    success: z.literal(true)
  });

  static generic_failure_validator = z.object({
    success: z.literal(false)
  });

  static generic_response = z.discriminatedUnion('success', [
    Api.generic_success_validator,
    Api.generic_failure_validator
  ]);

  static get = async <T>(
    endpoint: string,
    validator: z.ZodTypeAny
  ): Promise<T | ApiGenericFailureResponse> => {
    const req = await fetch(endpoint);
    const res = validator.safeParse(await req.json());

    if (res.success) return res.data as T;
    return { success: false };
  };

  static post = async <T>(
    endpoint: string,
    payload: object,
    validator: z.ZodTypeAny
  ): Promise<T | ApiGenericFailureResponse> => {
    const req = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify(payload)
    });

    const res = validator.safeParse(await req.json());

    if (res.success) return res.data as T;
    return { success: false };
  };
}

export type ApiGenericResponse = z.infer<typeof Api.generic_response>;

export type ApiGenericSuccessResponse = z.infer<
  typeof Api.generic_success_validator
>;

export type ApiGenericFailureResponse = z.infer<
  typeof Api.generic_failure_validator
>;
