import { TYPES } from "@planx/components/types";

import { vanillaStore } from "../store";

const { getState, setState } = vanillaStore;

beforeEach(() => {
  getState().resetPreview();
});

describe("results", () => {
  describe("flags", () => {
    beforeEach(() => {
      setState({
        flow: {
          _root: {
            edges: ["question", "filter"],
          },
          question: {
            type: TYPES.Statement,
            edges: ["missing_info_answer", "immune_answer", "noflag_answer"],
          },
          missing_info_answer: {
            type: TYPES.Response,
            data: {
              flag: "MISSING_INFO",
            },
          },
          immune_answer: {
            type: TYPES.Response,
            data: {
              flag: "IMMUNE",
            },
          },
          noflag_answer: {
            type: TYPES.Response,
          },
          filter: {
            type: TYPES.Filter,
            edges: ["missing_info_flag", "immune_flag", "no_flag"],
          },
          missing_info_flag: {
            type: TYPES.Response,
            data: {
              val: "MISSING_INFO",
            },
            edges: ["missing_info_followup"],
          },
          immune_flag: {
            type: TYPES.Response,
            data: {
              val: "IMMUNE",
            },
            edges: ["immune_followup"],
          },
          no_flag: {
            type: TYPES.Response,
            edges: ["noflag_followup"],
          },
          missing_info_followup: { type: TYPES.Content },
          immune_followup: { type: TYPES.Content },
          noflag_followup: { type: TYPES.Content },
        },
      });
    });

    test("jumps to result when flag has been collected", () => {
      expect(getState().upcomingCardIds()).toEqual([
        "question",
        "noflag_followup",
      ]);

      getState().record("question", ["missing_info_answer"]);
      expect(getState().collectedFlags("question")).toEqual(["MISSING_INFO"]);
      expect(getState().upcomingCardIds()).toEqual(["missing_info_followup"]);

      getState().record("question", ["immune_answer"]);
      expect(getState().collectedFlags("question")).toEqual(["IMMUNE"]);
      expect(getState().upcomingCardIds()).toEqual(["immune_followup"]);

      getState().record("question", ["noflag_answer"]);
      expect(getState().collectedFlags("question")).toEqual([]);
      expect(getState().upcomingCardIds()).toEqual(["noflag_followup"]);
    });
  });
});

test("only this one", () => {
  setState({
    flow: {
      _root: {
        edges: ["q1", "filter"],
      },
      missing_info: {
        data: {
          val: "MISSING_INFO",
          text: "Missing information",
        },
        type: 200,
        edges: ["missing_info_content"],
      },
      q2: {
        data: {
          text: "another",
        },
        type: 100,
        edges: ["missing_2", "nothing_2"],
      },
      missing_info_content: {
        data: {
          content: "<p>missing info</p>",
        },
        type: 250,
      },
      nothing_2: {
        data: {
          text: "nothing",
        },
        type: 200,
      },
      no_result: {
        data: {
          text: "(No Result)",
        },
        type: 200,
        edges: ["q2"],
      },
      missing_2: {
        data: {
          flag: "MISSING_INFO",
          text: "missing",
        },
        type: 200,
      },
      immune: {
        data: {
          val: "IMMUNE",
          text: "Immune",
        },
        type: 200,
      },
      filter: {
        data: {
          fn: "flag",
        },
        type: 500,
        edges: ["missing_info", "immune", "no_result"],
      },
      q1: {
        type: 100,
        data: {
          text: "q",
        },
        edges: ["missing_1", "nothing_1"],
      },
      missing_1: {
        type: 200,
        data: {
          text: "missing",
          flag: "MISSING_INFO",
        },
      },
      nothing_1: {
        type: 200,
        data: {
          text: "nothing",
        },
      },
    },
  });

  // https://imgur.com/kVeyr1t

  getState().record("q1", ["nothing_1"]);

  getState().record("q2", ["missing_2"]);
  expect(getState().upcomingCardIds()).toEqual([]);

  getState().record("q2", ["nothing_2"]);
  expect(getState().upcomingCardIds()).toEqual([]);

  getState().record("q1", ["missing_1"]);
  expect(getState().upcomingCardIds()).toEqual(["missing_info_content"]);
});
