"use strict";

import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import * as tldjs from "tldjs";

import { CreateService } from './../types';
import { addRedirectToCloudFlareListenerRule } from "../utils/addListenerRule";

export const createHasuraService = async ({
  vpc,
  cluster,
  repo,
  CUSTOM_DOMAINS, 
  stacks: {
    networking, certificates, data,
  },
}: CreateService) => {

  const config = new pulumi.Config();
  const dbRootUrl: string = await data.requireOutputValue("dbRootUrl");
  const DOMAIN: string = await certificates.requireOutputValue("domain");

  const lbHasura = new awsx.lb.ApplicationLoadBalancer("hasura", {
    external: true,
    vpc,
    subnets: networking.requireOutput("publicSubnetIds"),
  });
  // XXX: If you change the port, you'll have to make the security group accept incoming connections on the new port
  const HASURA_PROXY_PORT = 80;
  const targetHasura = lbHasura.createTargetGroup("hasura", {
    port: HASURA_PROXY_PORT,
    protocol: "HTTP",
    healthCheck: {
      path: "/healthz",
    },
  });  
  const hasuraListenerHttp = targetHasura.createListener("hasura-http", { protocol: "HTTP" });

  addRedirectToCloudFlareListenerRule({
    serviceName: "hasura",
    listener: hasuraListenerHttp,
    domain: DOMAIN,
  });

  // hasuraService is composed of two tightly coupled containers
  // hasuraProxy is publicly exposed (behind the load balancer) and reverse proxies requests to hasura
  // hasura has no externally exposed ports, and can only be accessed by hasuraService
  const hasuraService = new awsx.ecs.FargateService("hasura", {
    cluster,
    subnets: networking.requireOutput("publicSubnetIds"),
    taskDefinitionArgs: {
      logGroup: new aws.cloudwatch.LogGroup("hasura", {
        namePrefix: "hasura",
        retentionInDays: 30,
      }),
      containers: {
        hasuraProxy: {
          image: repo.buildAndPushImage("../../hasura.planx.uk/proxy"),
          memory: 1024 /*MB*/,
          portMappings: [hasuraListenerHttp],
          environment: [
            { name: "HASURA_PROXY_PORT", value: String(HASURA_PROXY_PORT) },
            { name: "HASURA_NETWORK_LOCATION", value: "localhost" },
          ],
        },
        hasura: {
          image: repo.buildAndPushImage("../../hasura.planx.uk"),
          cpu: config.requireNumber("hasura-cpu"),
          memory: config.requireNumber("hasura-memory"),
          environment: [
            { name: "HASURA_GRAPHQL_ENABLE_CONSOLE", value: "true" },
            {
              name: "HASURA_GRAPHQL_ADMIN_SECRET",
              value: config.require("hasura-admin-secret"),
            },
            {
              name: "HASURA_GRAPHQL_CORS_DOMAIN",
              value: [...CUSTOM_DOMAINS.map((x: any) => x.domain), DOMAIN]
                .map((x) => `https://*.${x}, https://${x}`)
                .join(", "),
            },
            {
              name: "HASURA_GRAPHQL_ENABLED_LOG_TYPES",
              value: "startup, http-log, webhook-log, websocket-log, query-log",
            },
            {
              name: "HASURA_GRAPHQL_JWT_SECRET",
              value: pulumi.interpolate`{ "type": "HS256", "key": "${config.require(
                "jwt-secret"
              )}" }`,
            },
            { name: "HASURA_GRAPHQL_UNAUTHORIZED_ROLE", value: "public" },
            {
              name: "HASURA_GRAPHQL_DATABASE_URL",
              value: dbRootUrl,
            },
            {
              name: "HASURA_PLANX_API_URL",
              value: `https://api.${DOMAIN}`,
            },
            {
              name: "HASURA_PLANX_API_KEY",
              value: config.require("hasura-planx-api-key"),
            },
          ],
        },
      },
    },
    desiredCount: 1,
  });
  
  new cloudflare.Record("hasura", {
    name: tldjs.getSubdomain(DOMAIN)
      ? `hasura.${tldjs.getSubdomain(DOMAIN)}`
      : "hasura",
    type: "CNAME",
    zoneId: config.require("cloudflare-zone-id"),
    value: hasuraListenerHttp.endpoint.hostname,
    ttl: 1,
    proxied: true,
  });
}