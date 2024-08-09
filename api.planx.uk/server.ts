import "isomorphic-fetch";
import "express-async-errors";
import bodyParser from "body-parser";
import assert from "assert";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors, { CorsOptions } from "cors";
import express, { ErrorRequestHandler } from "express";
import noir from "pino-noir";
import pinoLogger from "express-pino-logger";
import { Server } from "http";
import passport from "passport";
import helmet from "helmet";
import { ServerError } from "./errors/index.js";
import airbrake from "./airbrake.js";
import { apiLimiter } from "./rateLimit.js";
import { registerSessionStubs } from "./session.js";
import { googleStrategy } from "./modules/auth/strategy/google.js";
import authRoutes from "./modules/auth/routes.js";
import teamRoutes from "./modules/team/routes.js";
import miscRoutes from "./modules/misc/routes.js";
import userRoutes from "./modules/user/routes.js";
import webhookRoutes from "./modules/webhooks/routes.js";
import analyticsRoutes from "./modules/analytics/routes.js";
import adminRoutes from "./modules/admin/routes.js";
import flowRoutes from "./modules/flows/routes.js";
import ordnanceSurveyRoutes from "./modules/ordnanceSurvey/routes.js";
import saveAndReturnRoutes from "./modules/saveAndReturn/routes.js";
import sendEmailRoutes from "./modules/sendEmail/routes.js";
import fileRoutes from "./modules/file/routes.js";
import gisRoutes from "./modules/gis/routes.js";
import payRoutes from "./modules/pay/routes.js";
import sendRoutes from "./modules/send/routes.js";
import testRoutes from "./modules/test/routes.js";
import { useSwaggerDocs } from "./docs/index.js";
import { Role } from "@opensystemslab/planx-core/types";

const app = express();

useSwaggerDocs(app);

app.set("trust proxy", 1);

const checkAllowedOrigins: CorsOptions["origin"] = (origin, callback) => {
  if (!origin) return callback(null, true);

  const isTest = process.env.NODE_ENV === "test";
  const localDevEnvs =
    /^http:\/\/(127\.0\.0\.1|localhost):(3000|5173|6006|7007)$/;
  const isDevelopment =
    process.env.APP_ENVIRONMENT === "development" || localDevEnvs.test(origin);
  const allowList = process.env.CORS_ALLOWLIST?.split(", ") || [];
  const isAllowed = Boolean(allowList.includes(origin));
  const isMapDocs = Boolean(origin.endsWith("oslmap.netlify.app"));

  isTest || isDevelopment || isAllowed || isMapDocs
    ? callback(null, true)
    : callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
};

app.use(
  cors({
    credentials: true,
    methods: "*",
    origin: checkAllowedOrigins,
    allowedHeaders: [
      "Accept",
      "Authorization",
      "Content-Type",
      "Origin",
      "X-Requested-With",
    ],
  }),
);

app.use(bodyParser.json({ limit: "100mb" }));

// Converts req.headers.cookie: string, to req.cookies: Record<string, string>
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(
    pinoLogger({
      serializers: noir(["req.headers.authorization"], "**REDACTED**"),
      autoLogging: {
        ignore: (req) => {
          const isAWSHealthchecker =
            req.headers["user-agent"] === "ELB-HealthChecker/2.0";
          const isLocalDockerHealthchecker =
            req.headers["user-agent"] === "Wget" &&
            req.headers.host === "localhost:7002";

          return isAWSHealthchecker || isLocalDockerHealthchecker;
        },
      },
    }),
  );
}

// Rate limit requests per IP address
app.use(apiLimiter);

// Secure Express by setting various HTTP headers
app.use(helmet());

assert(process.env.GOVUK_NOTIFY_API_KEY);
assert(process.env.HASURA_PLANX_API_KEY);
assert(process.env.BOPS_API_TOKEN);
assert(process.env.UNIFORM_TOKEN_URL);
assert(process.env.UNIFORM_SUBMISSION_URL);

// needed for storing original URL to redirect to in login flow
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 100,
    name: "session",
    secret: process.env.SESSION_SECRET,
  }),
);

// register stubs after cookieSession middleware initialisation
app.use(registerSessionStubs);

passport.use("google", googleStrategy);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj: Express.User, cb) {
  cb(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup API routes
app.use(adminRoutes);
app.use(analyticsRoutes);
app.use(authRoutes);
app.use(fileRoutes);
app.use(flowRoutes);
app.use(gisRoutes);
app.use(miscRoutes);
app.use(ordnanceSurveyRoutes);
app.use(payRoutes);
app.use(saveAndReturnRoutes);
app.use(sendEmailRoutes);
app.use(sendRoutes);
app.use(teamRoutes);
app.use(userRoutes);
app.use(webhookRoutes);
app.use(testRoutes);

const errorHandler: ErrorRequestHandler = (errorObject, _req, res, _next) => {
  const { status = 500, message = "Something went wrong" } = (() => {
    if (
      airbrake &&
      (errorObject instanceof Error || errorObject instanceof ServerError)
    ) {
      airbrake.notify(errorObject);
      return {
        ...errorObject,
        message: errorObject.message.concat(", this error has been logged"),
      };
    } else {
      console.log(errorObject);
      return errorObject;
    }
  })();

  res.status(status).send({
    error: message,
  });
};

// Handle any server errors that were passed with next(err)
// Order is significant, this should be the final app.use()
app.use(errorHandler);

const server = new Server(app);

server.keepAliveTimeout = 30000; // 30s
server.headersTimeout = 35000; // 35s
server.setTimeout(60 * 1000); // 60s

export default server;

/* eslint-disable @typescript-eslint/no-namespace */
// declaring User in a d.ts file is overwritten by other files
declare global {
  namespace Express {
    interface User {
      jwt: string;
      sub?: string;
      "https://hasura.io/jwt/claims"?: {
        "x-hasura-allowed-roles": Role[];
      };
    }
  }
}
