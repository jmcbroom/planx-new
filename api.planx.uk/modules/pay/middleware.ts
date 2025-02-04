import type { NextFunction, Request, RequestHandler, Response } from "express";
import { gql } from "graphql-request";
import { $api } from "../../client/index.js";
import { ServerError } from "../../errors/index.js";
import type { GovPayMetadata } from "./types.js";
import { formatGovPayMetadata } from "@opensystemslab/planx-core";
import type {
  GovPayMetadataValue,
  Passport,
} from "@opensystemslab/planx-core/types";

/**
 * Confirm that this local authority (aka team) has a pay token
 */
export const isTeamUsingGovPay: RequestHandler = async (req, res, next) => {
  const env =
    process.env.APP_ENVIRONMENT === "production" ? "production" : "staging";

  const { govPayToken } = await $api.team.getIntegrations({
    env,
    slug: req.params.localAuthority,
    encryptionKey: process.env.ENCRYPTION_KEY!,
  });

  if (!govPayToken) {
    return next({
      status: 400,
      message: `GOV.UK Pay is not enabled for this local authority (${req.params.localAuthority})`,
    });
  }

  res.locals.govPayToken = govPayToken;

  next();
};

interface GetPaymentRequestDetails {
  paymentRequest: {
    sessionId: string;
    paymentAmount: number;
    govPayMetadata: GovPayMetadata[];
    session: {
      flowId: string;
      flow: {
        team: {
          slug: string;
        };
      };
      passport: Passport;
    };
  } | null;
}

export async function fetchPaymentRequestDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const query = gql`
    query GetPaymentRequestDetails($paymentRequestId: uuid!) {
      paymentRequest: payment_requests_by_pk(id: $paymentRequestId) {
        sessionId: session_id
        paymentAmount: payment_amount
        govPayMetadata: govpay_metadata
        session {
          flowId: flow_id
          flow {
            team {
              slug
            }
          }
          passport: data(path: "$.passport")
        }
      }
    }
  `;
  const { paymentRequest } =
    await $api.client.request<GetPaymentRequestDetails>(query, {
      paymentRequestId: req.params.paymentRequest,
    });
  if (!paymentRequest) {
    return next(
      new ServerError({
        message: "payment request not found",
        status: 404,
      }),
    );
  }
  const sessionId = paymentRequest.sessionId;
  if (sessionId) req.query.sessionId = sessionId;

  const localAuthority = paymentRequest.session?.flow?.team?.slug;
  if (localAuthority) req.params.localAuthority = localAuthority;

  const flowId = paymentRequest.session?.flowId;
  if (flowId) req.query.flowId = flowId;

  const paymentAmount = paymentRequest.paymentAmount.toString();
  if (paymentAmount) req.params.paymentAmount = paymentAmount;

  res.locals.govPayMetadata = paymentRequest.govPayMetadata;
  res.locals.passport = paymentRequest.session.passport;

  next();
}

// https://docs.payments.service.gov.uk/api_reference/create_a_payment_reference/#json-body-parameters-for-39-create-a-payment-39
interface GovPayCreatePayment {
  amount: number;
  reference: string;
  description: string;
  return_url: string;
  metadata: Record<string, GovPayMetadataValue>;
}

export async function buildPaymentPayload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.query.returnURL) {
    return next(
      new ServerError({
        message: "Missing required returnURL query param",
        status: 400,
      }),
    );
  }

  if (!req.query.sessionId) {
    return next(
      new ServerError({
        message: "Missing required sessionId query param",
        status: 400,
      }),
    );
  }

  // Convert metadata to format required by GovPay
  const metadata = formatGovPayMetadata({
    metadata: res.locals.govPayMetadata,
    userPassport: res.locals.passport,
    paidViaInviteToPay: true,
  });

  const createPaymentBody: GovPayCreatePayment = {
    amount: parseInt(req.params.paymentAmount),
    reference: req.query.sessionId as string,
    description: "New application (nominated payee)",
    return_url: req.query.returnURL as string,
    metadata,
  };

  req.body = createPaymentBody;

  next();
}
