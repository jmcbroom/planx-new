import { enablePatches, produceWithPatches } from "immer";
import get from "lodash/get";
import zip from "lodash/zip";
enablePatches();

const patchToOP = (flow) => ([patch, inverse]) => {
  if (Array.isArray(get(flow, patch.path.slice(0, -1)))) {
    // list
    switch (patch.op) {
      case "add":
        return { li: patch.value, p: patch.path };
      case "remove":
        return { ld: inverse.value, p: patch.path };
      case "replace":
        if (patch.path[patch.path.length - 1] === "length") {
          return { ld: inverse.value, p: patch.path.slice(0, -1).concat(0) };
        }
      default:
        throw new Error(`unsupported list op (${JSON.stringify(patch)})`);
    }
  } else {
    // object
    switch (patch.op) {
      case "add":
        return { oi: patch.value, p: patch.path };
      case "remove":
        return { od: inverse.value, p: patch.path };
      default:
        throw new Error(`unsupported object op (${JSON.stringify(patch)})`);
    }
  }
};

const addNode = (flow, { id, ...node }) => {
  const [next, patches, inverse] = produceWithPatches(flow, (draft) => {
    draft.nodes[id] = node;
    draft.edges.push([null, id]);
  });
  return zip(patches, inverse).map(patchToOP(next));
};

const removeNode = (flow, id) => {
  const [next, patches, inverse] = produceWithPatches(flow, (draft) => {
    delete draft.nodes[id];
    draft.edges.splice(0, 1);
  });
  return zip(patches, inverse).map(patchToOP(next));
};

test("add node", () => {
  const ops = addNode(
    {
      nodes: {},
      edges: [],
    },
    { id: "test", foo: "bar" }
  );
  expect(ops).toEqual([
    { oi: { foo: "bar" }, p: ["nodes", "test"] },
    { li: [null, "test"], p: ["edges", 0] },
  ]);
});

test("remove node", () => {
  const ops = removeNode(
    {
      nodes: {
        aaa: "test",
      },
      edges: [[null, "aaa"]],
    },
    "aaa"
  );

  console.log({ ops });

  expect(ops).toEqual([
    { od: "test", p: ["nodes", "aaa"] },
    { ld: [null, "aaa"], p: ["edges", 0] },
  ]);
});
