import "../../../../utils";
import { calculateRanks, setUp, tearDown } from "../../__support__/setup";
import { utils } from "../utils";

import { blocks2to100 } from "../../../../utils/fixtures/testnet/blocks2to100";

import { Bignum, models } from "@arkecosystem/crypto";
const { Block } = models;

import { app } from "@arkecosystem/core-container";
import { Database } from "@arkecosystem/core-interfaces";

const delegate = {
    username: "genesis_10",
    address: "AFyf2qVpX2JbpKcy29XbusedCpFDeYFX8Q",
    publicKey: "02f7acb179ddfddb2e220aa600921574646ac59fd3f1ae6255ada40b9a7fab75fd",
};

const delegate2 = {
    username: "genesis_11",
    address: "AZuvQC5WuVpPE9jwMCJcA28X5e7Ni32WY2",
    publicKey: "0345ef2a1e4f64707044ba600efdc72aaad281c5a73195f930527c54d7cc891904",
};

beforeAll(async () => {
    await setUp();
    await calculateRanks();

    const wm = app.resolvePlugin("database").walletManager;
    const wallet = wm.findByUsername("genesis_10");
    wallet.forgedFees = new Bignum(50);
    wallet.forgedRewards = new Bignum(50);
    wallet.producedBlocks = 100;
    wallet.missedBlocks = 25;
    wallet.voteBalance = new Bignum(100 * 1e8);
    wm.reindex(wallet);
});

afterAll(async () => {
    await tearDown();
});

describe("API 2.0 - Delegates", () => {
    describe("GET /delegates", () => {
        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all the delegates", async () => {
                    const response = await utils[request]("GET", "delegates");
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectDelegate);
                    expect(response.data.data.sort((a, b) => a.rank < b.rank)).toEqual(response.data.data);
                });

                it("should GET all the delegates sorted by votes,asc", async () => {
                    const wm = app.resolvePlugin("database").walletManager;
                    const wallet = wm.findByUsername("genesis_51");
                    wallet.voteBalance = new Bignum(1);
                    wm.reindex(wallet);

                    const response = await utils[request]("GET", "delegates", { orderBy: "votes:asc" });
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    expect(response.data.data[0].username).toBe(wallet.username);
                    expect(response.data.data[0].votes).toBe(+wallet.voteBalance.toFixed());
                });

                it("should GET all the delegates sorted by votes,desc", async () => {
                    const wm = app.resolvePlugin("database").walletManager;
                    const wallet = wm.findByUsername("genesis_1");
                    wallet.voteBalance = new Bignum(12500000000000000);
                    wm.reindex(wallet);

                    const response = await utils[request]("GET", "delegates", { orderBy: "votes:desc" });
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    expect(response.data.data[0].username).toBe(wallet.username);
                    expect(response.data.data[0].votes).toBe(+wallet.voteBalance.toFixed());
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all the delegates ordered by descending rank", async () => {
                    const response = await utils[request]("GET", "delegates", { orderBy: "rank:desc" });
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectDelegate);
                    expect(response.data.data.sort((a, b) => a.rank > b.rank)).toEqual(response.data.data);
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all the delegates ordered by descending productivity", async () => {
                    const response = await utils[request]("GET", "delegates", { orderBy: "productivity:desc" });
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectDelegate);
                    expect(
                        response.data.data.sort((a, b) => a.production.productivity > b.production.productivity),
                    ).toEqual(response.data.data);
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all the delegates ordered by descending approval", async () => {
                    const response = await utils[request]("GET", "delegates", { orderBy: "approval:desc" });
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectDelegate);
                    expect(response.data.data.sort((a, b) => a.production.approval > b.production.approval)).toEqual(
                        response.data.data,
                    );
                });
            },
        );
    });

    describe("GET /delegates/:id", () => {
        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET a delegate by the given username", async () => {
                    const response = await utils[request]("GET", `delegates/${delegate.username}`);
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeObject();

                    utils.expectDelegate(response.data.data, delegate);
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET a delegate by the given address", async () => {
                    const response = await utils[request]("GET", `delegates/${delegate.address}`);
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeObject();

                    utils.expectDelegate(response.data.data, delegate);
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET a delegate by the given public key", async () => {
                    const response = await utils[request]("GET", `delegates/${delegate.publicKey}`);
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeObject();

                    utils.expectDelegate(response.data.data, delegate);
                });
            },
        );
    });

    describe("POST /delegates/search", () => {
        const expectSearch = async (response, expected = null, count = 1) => {
            expect(response).toBeSuccessfulResponse();
            expect(response).toBeObject();

            expect(response.data.data).toBeArray();
            expect(response.data.data).toHaveLength(count);

            if (count > 0) {
                expect(response.data.data).not.toBeEmpty();

                for (const delegate of response.data.data) {
                    utils.expectDelegate(delegate, expected);
                }
            }
        };

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should POST a search for delegates with an address that matches the given string", async () => {
                    const response = await utils[request]("POST", "delegates/search", {
                        address: delegate.address,
                    });

                    expectSearch(response, delegate, 1);
                });

                it("should POST a search for delegates with a public key that matches the given string", async () => {
                    const response = await utils[request]("POST", "delegates/search", {
                        publicKey: delegate.publicKey,
                    });

                    expectSearch(response, delegate, 1);
                });

                it("should POST a search for delegates with a username that matches the given string", async () => {
                    const response = await utils[request]("POST", "delegates/search", {
                        username: delegate.username,
                    });

                    expectSearch(response, delegate, 1);
                });

                it("should POST a search for delegates with any of the specified usernames", async () => {
                    const response = await utils[request]("POST", "delegates/search", {
                        usernames: [delegate.username, delegate2.username],
                    });

                    expectSearch(response, null, 2);
                });

                // APPROVAL
                // FORGEDFEES
                // FORGEDREWARDS
                // FORGEDTOTAL
                // MISSEDBLOCKS
                // PRODUCEDBLOCKS
                // PRODUCTIVITY
                // VOTEBALANCE
            },
        );
    });

    describe("GET /delegates/:id/blocks", () => {
        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all blocks for a delegate by the given identifier", async () => {
                    // save a new block so that we can make the request with generatorPublicKey
                    const block2 = new Block(blocks2to100[0]);
                    const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");
                    await databaseService.saveBlock(block2);

                    const response = await utils[request](
                        "GET",
                        `delegates/${blocks2to100[0].generatorPublicKey}/blocks`,
                    );
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();
                    response.data.data.forEach(utils.expectBlock);

                    await databaseService.deleteBlock(block2); // reset to genesis block
                });
            },
        );
    });

    describe("GET /delegates/:id/voters", () => {
        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all voters (wallets) for a delegate by the given identifier", async () => {
                    const response = await utils[request]("GET", `delegates/${delegate.publicKey}/voters`);
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectWallet);
                    expect(response.data.data.sort((a, b) => a.balance > b.balance)).toEqual(response.data.data);
                });
            },
        );

        describe.each([["API-Version", "request"], ["Accept", "requestWithAcceptHeader"]])(
            "using the %s header",
            (header, request) => {
                it("should GET all voters (wallets) for a delegate by the given identifier ordered by 'balance:asc'", async () => {
                    const response = await utils[request]("GET", `delegates/${delegate.publicKey}/voters`);
                    expect(response).toBeSuccessfulResponse();
                    expect(response.data.data).toBeArray();

                    response.data.data.forEach(utils.expectWallet);
                    expect(response.data.data.sort((a, b) => a.balance < b.balance)).toEqual(response.data.data);
                });
            },
        );
    });
});
