import { app } from "@arkecosystem/core-container";
import { Blockchain, Database } from "@arkecosystem/core-interfaces";
import { Enums, Identities, Utils } from "@arkecosystem/crypto";

export const calculate = (height: number): string => {
    const { genesisBlock, milestones } = app.getConfig().all();

    if (!height) {
        const blockchain = app.resolvePlugin<Blockchain.IBlockchain>("blockchain");
        height = blockchain ? blockchain.getLastBlock().data.height : 0;
    }

    if (height === 0 || milestones.length === 0) {
        return genesisBlock.totalAmount;
    }

    const databaseService: Database.IDatabaseService = app.resolvePlugin<Database.IDatabaseService>("database");

    const balances: Utils.BigNumber = genesisBlock.transactions.reduce(async (acc, { amount, senderPublicKey, type }) => {
        if (type === Enums.TransactionType.Transfer) {
            acc = acc.plus(amount);

            const address = Identities.Address.fromPublicKey(senderPublicKey);
            let receivedByAddress = await databaseService.transactionsBusinessRepository.findAllByRecipient(address);

            receivedByAddress = receivedByAddress.filter(transaction => transaction.block.height <= height);

            for (const transaction of receivedByAddress) {
                if (transaction.typeGroup === Enums.TransactionTypeGroup.Core) {
                    switch (transaction.type) {
                        case Enums.TransactionType.Transfer: {
                            acc.minus(transaction.amount);
                            break;
                        }
                        case Enums.TransactionType.MultiPayment: {
                            const payments = transaction.asset.payments.filter(payment => payment.recipientId === address);
                            acc = acc.minus(payments.reduce((sum, payment) => sum.plus(payment.amount), Utils.BigNumber.Zero));
                            break;
                        }
                    }
                }
            }
        }

        return acc;
    }, Utils.BigNumber.ZERO);

    let rewards: Utils.BigNumber = Utils.BigNumber.ZERO;
    let currentHeight: number = 0;
    let constantIndex: number = 0;

    while (currentHeight < height) {
        const constants = milestones[constantIndex];
        const nextConstants = milestones[constantIndex + 1];

        let heightJump: number = height - currentHeight;

        if (nextConstants && height >= nextConstants.height && currentHeight < nextConstants.height - 1) {
            heightJump = nextConstants.height - 1 - currentHeight;
            constantIndex += 1;
        }

        currentHeight += heightJump;

        if (currentHeight >= constants.height) {
            rewards = rewards.plus(Utils.BigNumber.make(constants.reward).times(heightJump));
        }
    }

    return balances.plus(rewards).toFixed();
};
