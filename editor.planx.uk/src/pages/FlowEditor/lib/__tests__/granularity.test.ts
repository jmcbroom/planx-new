import { TYPES } from "@planx/components/types";

import { vanillaStore } from "../store";

const { getState, setState } = vanillaStore;

const flow = {
  _root: {
    edges: ["whatisit"],
  },
  whatisit: {
    type: TYPES.Statement,
    edges: ["food", "tool"],
    data: {
      fn: "item",
    },
  },
  food: {
    type: TYPES.Response,
    data: {
      val: "food",
    },
    edges: ["whichfood"],
  },
  tool: {
    type: TYPES.Response,
    data: {
      val: "tool",
    },
  },
  whichfood: {
    type: TYPES.Statement,
    edges: ["fruit", "cake"],
    data: {
      fn: "item",
    },
  },
  fruit: {
    type: TYPES.Response,
    data: {
      val: "food.fruit",
    },
  },
  cake: {
    type: TYPES.Response,
    data: {
      val: "food.cake",
    },
  },
};

describe("starting a flow with no initial data", () => {
  beforeEach(() => {
    getState().resetPreview();
    setState({ flow });

    getState().record("whatisit", ["food"]);
  });

  describe("after visiting whatisit->food", () => {
    it("collected the correct passport data", () => {
      expect(getState().passport).toEqual({
        data: { item: { value: ["food"] } },
      });
    });

    it("expects to visit 'whichfood' next", () => {
      expect(getState().upcomingCardIds()).toEqual(["whichfood"]);
    });

    describe("and then whichfood->fruit", () => {
      beforeEach(() => getState().record("whichfood", ["fruit"]));

      it("overwrites 'food' with 'food.fruit' (more granular data)", () => {
        expect(getState().passport).toEqual({
          data: { item: { value: ["food.fruit"] } },
        });
      });

      it("resets the passport data when going back to 'whichfood'", () => {
        getState().record("whichfood");
        expect(getState().upcomingCardIds()).toEqual(["whichfood"]);
        expect(getState().passport).toEqual({
          data: { item: { value: ["food"] } },
        });
      });
    });
  });
});

it("doesn't overwrite initial data when going back", () => {
  getState().resetPreview();

  const initialData = {
    item: { value: ["food"] },
    color: { value: ["red"] },
  };

  setState({
    flow,
    passport: {
      initialData,
      data: initialData,
    },
  });

  getState().upcomingCardIds();

  getState().record("whichfood", ["fruit"]);
  getState().upcomingCardIds();

  getState().record("whatisit");
  getState().upcomingCardIds();

  expect(getState().passport.data).toEqual(initialData);
});
