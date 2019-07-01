import { app } from "@arkecosystem/core-container";
import { Blockchain, Database, Shared } from "@arkecosystem/core-interfaces";
import { roundCalculator } from "./round-calculator";
import { Utils } from "@arkecosystem/crypto";

const blockchain = app.resolvePlugin<Blockchain.IBlockchain>("blockchain");
const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");
const BignumMod = Utils.BigNumber.clone({ DECIMAL_PLACES: 2 });

export const calculateApproval = (delegate, height?: number): number => {
    const config = app.getConfig();

    if (!height) {
        height = blockchain.getLastHeight();
    }

    const constants = config.getMilestone(height);
    const totalSupply = new BignumMod(config.get("genesisBlock.totalAmount")).plus(
        (height - constants.height) * constants.reward,
    );
    const voteBalance = new BignumMod(delegate.voteBalance);

    return +voteBalance
        .times(100)
        .dividedBy(totalSupply)
        .toFixed(2);
};

export const calculateForgedTotal = (delegate): string => {
    const forgedFees = Utils.BigNumber.make(delegate.forgedFees);
    const forgedRewards = Utils.BigNumber.make(delegate.forgedRewards);

    return forgedFees.plus(forgedRewards).toFixed();
};

export const calculatePreviousRank = (delegate): number => {
    const height = blockchain.getLastHeight();
    const roundInfo: State.IRoundInfo = roundCalculator.calculateRound(height);
    const { round } = roundInfo;

    if (round === 1) {
        return 0;
    }

    const delegates: State.IDelegateWallet[] = databaseService.getActiveDelegates(round - 1);
    const index = delegates.findIndex(el => el.username === delegate.username);

    return (index >= 0) ? index + 1 : index;
};
