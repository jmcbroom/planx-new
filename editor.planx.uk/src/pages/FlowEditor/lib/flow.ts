import { alg, Graph } from "graphlib";
import difference from "lodash/difference";
import flattenDeep from "lodash/flattenDeep";
import randomWords from "random-words";
import { v4 as uuid } from "uuid";
import { TYPES } from "../data/types";

export interface Node {
  id?: string;
  text: string;
  $t?: TYPES;
}

export type Flow = {
  nodes: Record<string, Node>;
  edges: Array<[string | null, string]>;
};

export interface Op {
  p: Array<any>;
  li?: any;
  lm?: any;
  ld?: any;
  od?: any;
  oi?: any;
}

export const toGraphlib = (flow: Flow): Graph => {
  // create a graph with the existing nodes and edges
  const g = new Graph({ directed: true, multigraph: false });
  Object.keys(flow.nodes).forEach((key) => {
    g.setNode(key);
  });
  flow.edges.forEach(([src, tgt]) => {
    g.setEdge(src, tgt);
  });
  return g;
};

export const insertNodeOp = (): Array<Op> => [
  { p: ["nodes", uuid()], oi: { text: randomWords() } },
];

export const addNodeWithChildrenOp = (
  { id = uuid(), ...data },
  children = [],
  parent: string | null = null,
  before: string | null = null,
  flow: Flow
): Array<Op> => {
  const { edges } = flow;

  let position = edges.length;

  const addNode = ({ id = uuid(), ...data }, parent, before = null) => {
    if (before) {
      const index = edges.findIndex(
        ([src, tgt]: any) => src === parent && tgt === before
      );
      console.log({ parent, before, index });
      if (index >= 0) {
        position = index;
      }
    } else {
      position++;
    }

    return [
      {
        p: ["nodes", id],
        oi: data,
      },
      { p: ["edges", position], li: [parent, id] },
    ];
  };

  return flattenDeep([
    addNode({ id, ...data }, parent, before),
    children.map((child) => addNode(child, id)),
  ]);
};

export const removeNodeOp = (
  id: string,
  parent: null | string = null,
  flow: Flow
): Array<Op> => {
  const relevantEdges = flow.edges.filter(([, tgt]) => tgt === id);
  if (relevantEdges.length > 1) {
    // node is in multiple places in the graph so just delete the edge
    // that is connecting it
    const index = flow.edges.findIndex(
      ([src, tgt]) => src === parent && tgt === id
    );
    if (index < 0) {
      console.warn("edge not found");
      return [];
    }
    return [{ ld: flow.edges[index], p: ["edges", index] }];
  }

  const graph = toGraphlib(flow);
  const [root, ...children] = alg.preorder(graph, [id]);

  graph.removeNode(root);
  const rootInEdgeIdx = flow.edges.findIndex(([, tgt]) => tgt === id);

  const [, ...remaining] = alg.preorder(graph, ["null"]);
  const affectedNodes = difference(children, remaining);

  const affectedEdgeIndices = flow.edges
    .map(([src, tgt], index) =>
      affectedNodes.includes(src) || affectedNodes.includes(tgt) ? index : null
    )
    .filter((val) => val !== null);

  affectedEdgeIndices.push(rootInEdgeIdx);

  return [
    { p: ["nodes", id], od: flow.nodes[id] },
    ...affectedNodes.map((nodeId) => ({
      p: ["nodes", nodeId],
      od: flow.nodes[nodeId],
    })),
    // Sort in descending order so that indices don't shift after each ShareDB operation
    ...affectedEdgeIndices
      .sort((a, b) => b - a)
      .map((edgeIndex) => ({
        p: ["edges", edgeIndex],
        ld: flow.edges[edgeIndex],
      })),
  ];
};

export const moveNodeOp = (
  id: string,
  parent = null,
  toBefore = null,
  toParent = null,
  flow: Flow
): Array<Op> => {
  const { edges } = flow;

  const fromIndex = edges.findIndex(
    ([src, tgt]: any) => src === parent && tgt === id
  );

  let toIndex = edges.findIndex(
    ([src, tgt]: any) => src === toParent && tgt === toBefore
  );

  if (toIndex < 0) {
    toIndex = edges.length;
  } else if (fromIndex < toIndex) {
    toIndex -= 1;
  }

  if (parent === toParent) {
    if (!isValidOp(flow, toParent, id, false)) return [];
    return [{ lm: toIndex, p: ["edges", fromIndex] }];
  } else {
    if (!isValidOp(flow, toParent, id)) return;
    let ops = [
      { ld: edges[fromIndex], p: ["edges", fromIndex] },
      { li: [toParent, id], p: ["edges", toIndex] },
    ];
    if (fromIndex < toIndex) ops = ops.reverse();
    return ops;
  }
};

export const setFlowOp = (flow: Flow, prevFlow: Flow): Array<Op> => [
  { p: [], od: prevFlow, oi: flow },
];

export const isValidOp = (
  flow: Flow,
  src: string,
  tgt: string,
  shouldCheckForDuplicate = true
) => {
  if (src === tgt) {
    console.error(`${src} === ${tgt}`);
    return false;
  }

  if (
    shouldCheckForDuplicate &&
    flow.edges.find(([s, t]) => s === src && t === tgt)
  ) {
    console.error(`edge exists (${src}, ${tgt})`);
    return false;
  }

  const graph = toGraphlib(flow);
  graph.setEdge(src, tgt);

  if (!alg.isAcyclic(graph)) {
    console.error(`cycle in graph`);
    return false;
  }

  return true;
};

export const connectOp = (src: string, tgt: string, flow: Flow): Array<Op> =>
  isValidOp
    ? [
        {
          p: ["edges", flow.edges.length],
          li: [src, tgt],
        },
      ]
    : [];
