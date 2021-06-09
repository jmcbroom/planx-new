import { gql } from "@apollo/client";
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
import { client } from "lib/graphql";
import debounce from "lodash/debounce";
import type { FlowSettings } from "types";
import type { GetState, SetState } from "zustand/vanilla";

import { FlowLayout } from "../../components/Flow";
import type { Store } from ".";
import { connectToDB, getConnection } from "./../sharedb";
import type { SharedStore } from "./shared";

let doc: any;

const send = (ops: Array<any>) => {
  if (ops.length > 0) {
    console.log({ ops });
    doc.submitOp(ops);
  }
};

export interface EditorUIStore extends Store.Store {
  flowLayout: FlowLayout;
  showPreview: boolean;
  togglePreview: () => void;
}

export const editorUIStore = (
  set: SetState<EditorUIStore>,
  get: GetState<SharedStore & EditorUIStore>
): EditorUIStore => ({
  flowLayout: FlowLayout.TOP_DOWN,

  showPreview: true,

  togglePreview: () => {
    set({ showPreview: !get().showPreview });
  },
});

export interface EditorStore extends Store.Store {
  addNode: (node: any, relationships?: any) => void;
  connect: (src: Store.nodeId, tgt: Store.nodeId, object?: any) => void;
  connectTo: (id: Store.nodeId) => void;
  copyNode: (id: Store.nodeId) => void;
  createFlow: (teamId: any, newName: any) => Promise<string>;
  deleteFlow: (teamId: number, flowSlug: string) => Promise<object>;
  getFlows: (teamId: number) => Promise<any>;
  isClone: (id: Store.nodeId) => boolean;
  makeUnique: (id: Store.nodeId, parent?: Store.nodeId) => void;
  moveNode: (
    id: Store.nodeId,
    parent?: Store.nodeId,
    toBefore?: Store.nodeId,
    toParent?: Store.nodeId
  ) => void;
  pasteNode: (toParent: Store.nodeId, toBefore: Store.nodeId) => void;
  removeNode: (id: Store.nodeId, parent: Store.nodeId) => void;
  updateFlowSettings: (
    teamSlug: string,
    flowSlug: string,
    newSettings: FlowSettings
  ) => Promise<number>;
  updateNode: (node: any, relationships?: any) => void;
}

export const editorStore = (
  set: SetState<EditorStore>,
  get: GetState<SharedStore & EditorStore>
): EditorStore => ({
  addNode: (
    { id = undefined, type, data },
    { children = undefined, parent = ROOT_NODE_KEY, before = undefined } = {}
  ) => {
    const [, ops] = add(
      { id, type, data },
      { children, parent, before }
    )(get().flow);
    send(ops);
  },

  connect: (src, tgt, { before = undefined } = {}) => {
    try {
      const [, ops] = clone(tgt, { toParent: src, toBefore: before })(
        get().flow
      );
      send(ops);
    } catch (err) {
      alert(err.message);
    }
  },

  connectTo: async (id) => {
    if (id === get().id) return; // already connected to this ID

    console.log("connecting to", id, get().id);

    doc = getConnection(id);
    (window as any)["doc"] = doc;

    await connectToDB(doc);

    // set the ID of the flow to assist with deciding what to render
    set({ id });

    const cloneStateFromShareDb = () => {
      // console.debug("[NF]:", JSON.stringify(doc.data, null, 0));
      const flow = JSON.parse(JSON.stringify(doc.data));
      set({ flow });
    };

    // set state from initial load
    cloneStateFromShareDb();

    // local operation so we can assume that multiple ops will arrive
    // almost instantaneously so wait for 100ms of 'silence' before running
    const cloneStateFromLocalOps = debounce(cloneStateFromShareDb, 100);

    // remote operation, there might be network latency so wait for 0.5s
    const cloneStateFromRemoteOps = debounce(cloneStateFromShareDb, 500);

    doc.on("op", (_op: any, isLocalOp?: boolean) =>
      isLocalOp ? cloneStateFromLocalOps() : cloneStateFromRemoteOps()
    );
  },

  copyNode(id) {
    localStorage.setItem("clipboard", id);
  },

  createFlow: async (teamId, newName) => {
    const data = { [ROOT_NODE_KEY]: { edges: [] } };
    let response = (await client.mutate({
      mutation: gql`
        mutation CreateFlow(
          $name: String
          $data: jsonb
          $slug: String
          $teamId: Int
        ) {
          insert_flows_one(
            object: {
              name: $name
              data: $data
              slug: $slug
              team_id: $teamId
              version: 1
            }
          ) {
            id
            data
          }
        }
      `,
      variables: {
        name: newName,
        slug: newName,
        teamId,
        data,
      },
    })) as any;

    const { id } = response.data.insert_flows_one;

    response = await client.mutate({
      mutation: gql`
        mutation MyMutation($flow_id: uuid, $data: jsonb) {
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
            data,
            type: "http://sharejs.org/types/JSONv0",
          },
        },
      },
    });

    return newName;
  },

  deleteFlow: async (teamId, flowSlug) => {
    const response = await client.mutate({
      mutation: gql`
        mutation MyMutation($team_id: Int, $flow_slug: String) {
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

  getFlows: async (teamId) => {
    client.cache.reset();
    const { data } = await client.query({
      query: gql`
        query GetFlow($teamId: Int!) {
          flows(
            order_by: { updated_at: desc }
            where: { team: { id: { _eq: $teamId } } }
          ) {
            id
            name
            slug
            updated_at
            operations(limit: 1, order_by: { id: desc }) {
              actor {
                first_name
                last_name
              }
            }
          }
        }
      `,
      variables: {
        teamId,
      },
    });

    return data;
  },

  isClone: (id) => {
    // TODO: this can be faster!
    return isClone(id, get().flow);
  },

  makeUnique: (id, parent) => {
    const [, ops] = makeUnique(id, parent)(get().flow);
    send(ops);
  },

  moveNode(
    id: string,
    parent = undefined,
    toBefore = undefined,
    toParent = undefined
  ) {
    try {
      const [, ops] = move(id, (parent as unknown) as string, {
        toParent,
        toBefore,
      })(get().flow);
      send(ops);
      get().resetPreview();
    } catch (err) {
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
    } catch (err) {
      alert(err.message);
    }
  },

  removeNode: (id, parent) => {
    const [, ops] = remove(id, parent)(get().flow);
    send(ops);
  },

  updateFlowSettings: async (teamSlug, flowSlug, newSettings) => {
    let response = await client.mutate({
      mutation: gql`
        mutation UpdateFlowSettings(
          $team_slug: String
          $flow_slug: String
          $settings: jsonb
        ) {
          update_flows(
            where: {
              team: { slug: { _eq: $team_slug } }
              slug: { _eq: $flow_slug }
            }
            _set: { settings: $settings }
          ) {
            affected_rows
            returning {
              slug
              settings
            }
          }
        }
      `,
      variables: {
        team_slug: teamSlug,
        flow_slug: flowSlug,
        settings: newSettings,
      },
    });

    return response.data.update_flows.affected_rows;
  },

  updateNode: ({ id, data }, { children = undefined } = {}) => {
    const [, ops] = update(id, data, {
      children,
      removeKeyIfMissing: true,
    })(get().flow);
    send(ops);
  },
});
