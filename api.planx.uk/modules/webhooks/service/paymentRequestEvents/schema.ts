import { z } from "zod";
import { ValidatedRequestHandler } from "../../../../shared/middleware/validate";
import { ScheduledEventResponse } from "../../../../lib/hasura/metadata";

export const createPaymentEventSchema = z.object({
  body: z.object({
    createdAt: z.string().pipe(z.coerce.date()),
    payload: z.object({
      paymentRequestId: z.string(),
    }),
  }),
});

export type CreatePaymentEvent = z.infer<
  typeof createPaymentEventSchema
>["body"];

export type CreatePaymentEventController = ValidatedRequestHandler<
  typeof createPaymentEventSchema,
  ScheduledEventResponse[]
>;
