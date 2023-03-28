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
    console.warn(endpoint, validator, res);
    return { success: false } as ApiGenericFailureResponse;
  };

  static post = async <T>(
    endpoint: string,
    payload: object,
    validator: z.ZodTypeAny
  ): Promise<T | ApiGenericFailureResponse> => {
    try {
      const req = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify(payload)
      });

      if (req.status !== 200) return { success: false };

      const res = validator.safeParse(await req.json());

      if (res.success) return res.data as T;
      console.warn(endpoint, payload, res);
      return { success: false } as ApiGenericFailureResponse;
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  };
}

export type ApiGenericResponse = z.infer<typeof Api.generic_response>;

export type ApiGenericSuccessResponse = z.infer<
  typeof Api.generic_success_validator
>;

export type ApiGenericFailureResponse = z.infer<
  typeof Api.generic_failure_validator
>;
