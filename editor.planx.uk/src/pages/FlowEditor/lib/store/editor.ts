import { gql } from "@apollo/client";
import { getPathForNode, sortFlow } from "@opensystemslab/planx-core";
import {
  ComponentType as TYPES,
  FlowGraph,
  NodeId,
  OrderedFlow,
  flatFlags,
} from "@opensystemslab/planx-core/types";
import {
  add,
  clone,
  isClone,
  makeUnique,
  move,
  remove,
  ROOT_NODE_KEY,
  update,
} from "@planx/graph";
import { OT } from "@planx/graph/types";
import axios from "axios";
import { client } from "lib/graphql";
import navigation from "lib/navigation";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";
import { customAlphabet } from "nanoid-good";
import en from "nanoid-good/locale/en";
import { type } from "ot-json0";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

import { FlowLayout } from "../../components/Flow";
import { connectToDB, getConnection } from "./../sharedb";
import { type Store } from ".";
import type { SharedStore } from "./shared";
import { UserStore } from "./user";

let doc: any;

const send = (ops: Array<any>) => {
  if (ops.length > 0) {
    console.log({ ops });
    doc.submitOp(ops);
  }
};

export interface EditorUIStore {
  flowLayout: FlowLayout;
  showSidebar: boolean;
  toggleSidebar: () => void;
  isTestEnvBannerVisible: boolean;
  hideTestEnvBanner: () => void;
  showTags: boolean;
  toggleShowTags: () => void;
  showImages: boolean;
  toggleShowImages: () => void;
  showDataFields: boolean;
  toggleShowDataFields: () => void;
  showHelpText: boolean;
  toggleShowHelpText: () => void;
  previousURL?: string;
  currentURL: string;
  initURLTracking: () => void;
}

export const editorUIStore: StateCreator<
  SharedStore & EditorUIStore,
  [],
  [["zustand/persist", unknown]],
  EditorUIStore
> = persist(
  (set, get) => ({
    flowLayout: FlowLayout.TOP_DOWN,

    showSidebar: true,

    toggleSidebar: () => {
      set({ showSidebar: !get().showSidebar });
    },

    isTestEnvBannerVisible: !window.location.href.includes(".uk"),

    hideTestEnvBanner: () => set({ isTestEnvBannerVisible: false }),

    showTags: false,

    toggleShowTags: () => set({ showTags: !get().showTags }),

    showImages: false,

    toggleShowImages: () => set({ showImages: !get().showImages }),

    showDataFields: false,

    toggleShowDataFields: () => set({ showDataFields: !get().showDataFields }),

    showHelpText: false,

    toggleShowHelpText: () => set({ showHelpText: !get().showHelpText }),

    previousURL: undefined,

    currentURL: window.location.pathname,

    initURLTracking: () => {
      navigation.subscribe((route) => {
        const { currentURL } = get();
        if (route.url.pathname === currentURL) return;

        set((state) => ({
          previousURL: state.currentURL,
          currentURL: route.url.pathname,
        }));
      });
    },
  }),
  {
    name: "editorUIStore",
    partialize: (state) => ({
      showSidebar: state.showSidebar,
      showTags: state.showTags,
      showImages: state.showImages,
      showDataFields: state.showDataFields,
      showHelpText: state.showHelpText,
    }),
  },
);

interface PublishFlowResponse {
  alteredNodes: Store.Node[];
  message: string;
}

export interface FlowSummary {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  operations: {
    createdAt: string;
    actor: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export interface EditorStore extends Store.Store {
  addNode: (node: any, relationships?: any) => void;
  connect: (src: NodeId, tgt: NodeId, object?: any) => void;
  connectTo: (id: NodeId) => void;
  copyFlow: (flowId: string) => Promise<any>;
  copyNode: (id: NodeId) => void;
  createFlow: (
    teamId: number,
    newSlug: string,
    newName: string,
  ) => Promise<string>;
  deleteFlow: (teamId: number, flowSlug: string) => Promise<object>;
  validateAndDiffFlow: (flowId: string) => Promise<any>;
  getFlows: (teamId: number) => Promise<FlowSummary[]>;
  isClone: (id: NodeId) => boolean;
  lastPublished: (flowId: string) => Promise<string>;
  lastPublisher: (flowId: string) => Promise<string>;
  isFlowPublished: boolean;
  makeUnique: (id: NodeId, parent?: NodeId) => void;
  moveFlow: (flowId: string, teamSlug: string) => Promise<any>;
  moveNode: (
    id: NodeId,
    parent?: NodeId,
    toBefore?: NodeId,
    toParent?: NodeId,
  ) => void;
  pasteNode: (toParent: NodeId, toBefore: NodeId) => void;
  publishFlow: (
    flowId: string,
    summary?: string,
  ) => Promise<PublishFlowResponse>;
  removeNode: (id: NodeId, parent: NodeId) => void;
  updateNode: (node: any, relationships?: any) => void;
  undoOperation: (ops: OT.Op[]) => void;
  orderedFlow?: OrderedFlow;
  setOrderedFlow: () => void;
  externalPortals: Record<string, { name: string; href: string }>;
  addExternalPortal: (portal: {
    id: string;
    name: string;
    href: string;
  }) => void;
  getURLForNode: (nodeId: string) => string;
  getFlowSchema: () => { nodes?: string[], options?: string[] } | undefined;
}

export const editorStore: StateCreator<
  SharedStore & EditorStore & UserStore,
  [],
  [],
  EditorStore
> = (set, get) => ({
  addNode: (
    { id = undefined, type, data },
    { children = undefined, parent = ROOT_NODE_KEY, before = undefined } = {},
  ) => {
    const [, ops] = add(
      { id, type, data },
      { children, parent, before },
    )(get().flow);
    send(ops);
  },

  connect: (src, tgt, { before = undefined } = {}) => {
    try {
      const [, ops] = clone(tgt, { toParent: src, toBefore: before })(
        get().flow,
      );
      send(ops);
    } catch (err: any) {
      alert(err.message);
    }
  },

  connectTo: async (id) => {
    if (id === get().id) return; // already connected to this ID

    console.log("connecting to", id, get().id);

    doc = getConnection(id);
    (window as any)["doc"] = doc;

    await connectToDB(doc);

    const cloneStateFromShareDb = () => {
      const flow = JSON.parse(JSON.stringify(doc.data));
      get().setFlow({
        id,
        flow,
        flowSlug: get().flowSlug,
        flowName: get().flowName,
      });
    };

    // set state from initial load
    cloneStateFromShareDb();

    // local operation so we can assume that multiple ops will arrive
    // almost instantaneously so wait for 100ms of 'silence' before running
    const cloneStateFromLocalOps = debounce(cloneStateFromShareDb, 100);

    // remote operation, there might be network latency so wait for 0.5s
    const cloneStateFromRemoteOps = debounce(cloneStateFromShareDb, 500);

    doc.on("op", (_op: any, isLocalOp?: boolean) =>
      isLocalOp ? cloneStateFromLocalOps() : cloneStateFromRemoteOps(),
    );
  },

  copyFlow: async (flowId: string) => {
    const token = get().jwt;

    // when copying a flow, we make nodeIds unique by replacing part of the original nodeId string.
    //   the onboarding script will often provide a meaningful string reflecting the team name (eg "LAM"),
    //     but when accessed from the editor we generate a string using the same method as in src/@planx/graph/index.ts
    const randomReplacementCharacters = customAlphabet(en)(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      5, // a full nodeId is 10 characters long
    );

    return axios.post(
      `${import.meta.env.VITE_APP_API_URL}/flows/${flowId}/copy`,
      {
        replaceValue: randomReplacementCharacters(),
        insert: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  copyNode(id) {
    localStorage.setItem("clipboard", id);
  },

  createFlow: async (teamId, newSlug, newName) => {
    let response = (await client.mutate({
      mutation: gql`
        mutation CreateFlow(
          $data: jsonb
          $slug: String
          $teamId: Int
          $name: String
        ) {
          insert_flows_one(
            object: { slug: $slug, team_id: $teamId, version: 1, name: $name }
          ) {
            id
            data
          }
        }
      `,
      variables: {
        name: newName,
        slug: newSlug,
        teamId,
      },
    })) as any;

    const { id } = response.data.insert_flows_one;

    response = await client.mutate({
      mutation: gql`
        mutation InsertOperation($flow_id: uuid, $data: jsonb) {
          insert_operations_one(
            object: { flow_id: $flow_id, data: $data, version: 1 }
          ) {
            id
          }
        }
      `,
      variables: {
        flow_id: id,
        data: {
          m: { ts: 1592485241858 },
          v: 0,
          seq: 1,
          src: "143711878a0ab64c35c32c6055358f5e",
          create: {
            data: { [ROOT_NODE_KEY]: { edges: [] } },
            type: "http://sharejs.org/types/JSONv0",
          },
        },
      },
    });

    return newSlug;
  },

  deleteFlow: async (teamId, flowSlug) => {
    const response = await client.mutate({
      mutation: gql`
        mutation DeleteFlow($team_id: Int, $flow_slug: String) {
          delete_flows(
            where: { team_id: { _eq: $team_id }, slug: { _eq: $flow_slug } }
          ) {
            affected_rows
          }
        }
      `,
      variables: {
        flow_slug: flowSlug,
        team_id: teamId,
      },
    });
    return response;
  },

  validateAndDiffFlow(flowId: string) {
    const token = get().jwt;

    return axios.post(
      `${import.meta.env.VITE_APP_API_URL}/flows/${flowId}/diff`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  getFlows: async (teamId) => {
    client.cache.reset();
    const {
      data: { flows },
    } = await client.query<{ flows: FlowSummary[] }>({
      query: gql`
        query GetFlows($teamId: Int!) {
          flows(where: { team: { id: { _eq: $teamId } } }) {
            id
            name
            slug
            updatedAt: updated_at
            operations(limit: 1, order_by: { created_at: desc }) {
              createdAt: created_at
              actor {
                firstName: first_name
                lastName: last_name
              }
            }
          }
        }
      `,
      variables: {
        teamId,
      },
    });

    return flows;
  },

  isClone: (id) => {
    return isClone(id, get().flow);
  },

  lastPublished: async (flowId: string) => {
    const { data } = await client.query({
      query: gql`
        query GetLastPublishedFlow($id: uuid) {
          flows(limit: 1, where: { id: { _eq: $id } }) {
            published_flows(order_by: { created_at: desc }, limit: 1) {
              created_at
            }
          }
        }
      `,
      variables: {
        id: flowId,
      },
    });

    return data.flows[0].published_flows[0].created_at;
  },

  lastPublisher: async (flowId: string) => {
    const { data } = await client.query({
      query: gql`
        query GetLastPublisher($id: uuid) {
          flows(limit: 1, where: { id: { _eq: $id } }) {
            published_flows(order_by: { created_at: desc }, limit: 1) {
              user {
                first_name
                last_name
              }
            }
          }
        }
      `,
      variables: {
        id: flowId,
      },
    });

    const { first_name, last_name } = data.flows[0].published_flows[0].user;

    return first_name.concat(" ", last_name);
  },

  isFlowPublished: false,

  makeUnique: (id, parent) => {
    const [, ops] = makeUnique(id, parent)(get().flow);
    send(ops);
  },

  moveFlow(flowId: string, teamSlug: string) {
    const valid = get().canUserEditTeam(teamSlug);
    if (!valid) {
      alert(
        `You do not have permission to move this flow into ${teamSlug}, try again`,
      );
      return Promise.resolve();
    }

    const token = get().jwt;

    return axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/flows/${flowId}/move/${teamSlug}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => alert(res?.data?.message))
      .catch(() =>
        alert(
          "Failed to move this flow. Make sure you're entering a valid team name and try again",
        ),
      );
  },

  moveNode(
    id: string,
    parent = undefined,
    toBefore = undefined,
    toParent = undefined,
  ) {
    try {
      const [, ops] = move(id, parent as unknown as string, {
        toParent,
        toBefore,
      })(get().flow);
      send(ops);
    } catch (err: any) {
      alert(err.message);
    }
  },

  pasteNode(toParent, toBefore) {
    try {
      const id = localStorage.getItem("clipboard");
      if (id) {
        const [, ops] = clone(id, { toParent, toBefore })(get().flow);
        send(ops);
      }
    } catch (err: any) {
      alert(err.message);
    }
  },

  async publishFlow(flowId: string, summary?: string) {
    const token = get().jwt;

    const urlWithParams = (url: string, params: any) =>
      [url, new URLSearchParams(omitBy(params, isEmpty))]
        .filter(Boolean)
        .join("?");

    const { data } = await axios.post<PublishFlowResponse>(
      urlWithParams(
        `${import.meta.env.VITE_APP_API_URL}/flows/${flowId}/publish`,
        { summary },
      ),
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    set({ isFlowPublished: true });

    return data;
  },

  removeNode: (id, parent) => {
    const [, ops] = remove(id, parent)(get().flow);
    send(ops);
  },

  updateNode: ({ id, data }, { children = undefined } = {}) => {
    const [, ops] = update(id, data, {
      children,
      removeKeyIfMissing: true,
    })(get().flow);
    send(ops);
  },

  undoOperation: (ops: OT.Op[]) => {
    const inverseOps: OT.Op[] = type.invert(ops);
    send(inverseOps);
  },

  orderedFlow: undefined,

  setOrderedFlow: () => {
    const flow = get().flow as FlowGraph;
    const orderedFlow = sortFlow(flow);
    set({ orderedFlow });
  },

  externalPortals: {},

  addExternalPortal: ({ id, name, href }) => {
    const externalPortals = get().externalPortals;
    externalPortals[id] = { name, href };
    set({ externalPortals });
  },

  getURLForNode: (nodeId) => {
    const { orderedFlow: flow, flowSlug, teamSlug } = get();
    if (!flow) throw Error("Missing ordered flow!");

    const path = getPathForNode({ nodeId, flow });
    const internalPortals = path.filter(
      ({ type }) => type === TYPES.InternalPortal,
    );
    const [node, parent, grandparent] = path;

    // Construct the internal portal path if applicable
    const mapPortalsToURLPath = (portals: ReturnType<typeof getPathForNode>) =>
      portals
        .reverse()
        .map(({ id }) => id)
        .join(",");

    const portalPath = internalPortals.length
      ? "," + mapPortalsToURLPath(internalPortals)
      : "";

    // Determine node path based on the node type
    const nodePath =
      node.type === TYPES.Answer
        ? `nodes/${grandparent.id}/nodes/${parent.id}/edit`
        : `nodes/${parent.id}/nodes/${node.id}/edit`;

    const urlPath = `/${teamSlug}/${flowSlug}${portalPath}/${nodePath}`;
    return urlPath;
  },

  getFlowSchema: () => {
    const { flow } = get();
    if (!flow) return;

    const nodes: Set<string> = new Set();
    const options: Set<string> = new Set();

    Object.entries(flow).map(([_id, node]) => {
      if (node.data?.fn) {
        // Exclude Filter fn value as not exposed to editors
        if (node.data?.fn !== "flag") nodes.add(node.data.fn)
      };
  
      if (node.data?.val) {
        // Exclude Filter Option flag values as not exposed to editors
        const flagVals = flatFlags.map((flag) => flag.value);
        if (!flagVals.includes(node.data.val)) options.add(node.data.val)
      };
    });

    return {
      nodes: Array.from(nodes).sort(),
      options: Array.from(options).sort(),
    };
  },
});
