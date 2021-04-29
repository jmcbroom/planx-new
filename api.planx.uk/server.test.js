const nock = require("nock");
const supertest = require("supertest");

const app = require("./server");

it("works", async () => {
  await supertest(app)
    .get("/")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ hello: "world" });
    });
});

it("mocks hasura", async () => {
  await supertest(app)
    .get("/hasura")
    .expect(200)
    .then((res) => {
      expect(res.body).toEqual({ teams: [{ id: 1 }] });
    });
});

describe("sending an application to BOPS", () => {
  beforeEach(() => {
    const mockResponse = {
      application: "0000123",
    };

    nock("https://southwark.bops-staging.services/api/v1/planning_applications")
      .post("")
      .reply(200, mockResponse);
  });

  it("works", async () => {
    await supertest(app)
      .post("/bops/southwark")
      .send({ applicationId: 123 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          application: { bopsResponse: { application: "0000123" } },
        });
      });
  });
});
