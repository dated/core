import Joi from "@hapi/joi";
import { address, blockId, orderBy, pagination, publicKey } from "../shared/schemas";

export const index: object = {
    query: {
        ...pagination,
        ...{
            orderBy,
            id: blockId,
            version: Joi.number()
                .integer()
                .min(0),
            timestamp: Joi.number()
                .integer()
                .min(0),
            previousBlock: blockId,
            height: Joi.number()
                .integer()
                .positive(),
            numberOfTransactions: Joi.number()
                .integer()
                .min(0),
            totalAmount: Joi.number()
                .integer()
                .min(0),
            totalFee: Joi.number()
                .integer()
                .min(0),
            reward: Joi.number()
                .integer()
                .min(0),
            payloadLength: Joi.number()
                .integer()
                .positive(),
            payloadHash: Joi.string().hex(),
            generatorPublicKey: publicKey,
            blockSignature: Joi.string().hex(),
            transform: Joi.bool().default(true),
        },
    },
};

export const first: object = {
    query: {
        transform: Joi.bool().default(true),
    },
};

export const last: object = {
    query: {
        transform: Joi.bool().default(true),
    },
};

export const show: object = {
    params: {
        id: blockId,
    },
    query: {
        transform: Joi.bool().default(true),
    },
};

export const transactions: object = {
    params: {
        id: Joi.string(),
    },
    query: {
        ...pagination,
        ...{
            orderBy,
            id: Joi.string()
                .hex()
                .length(64),
            blockId,
            type: Joi.number()
                .integer()
                .min(0),
            version: Joi.number()
                .integer()
                .min(0),
            senderPublicKey: publicKey,
            senderId: address,
            recipientId: address,
            timestamp: Joi.number()
                .integer()
                .min(0),
            amount: Joi.number()
                .integer()
                .min(0),
            fee: Joi.number()
                .integer()
                .min(0),
            vendorField: Joi.string().max(255, "utf8"),
            transform: Joi.bool().default(true),
        },
    },
};

export const search: object = {
    query: {
        ...pagination,
        ...{
            transform: Joi.bool().default(true),
        },
    },
    payload: {
        id: blockId,
        version: Joi.number()
            .integer()
            .min(0),
        previousBlock: blockId,
        payloadHash: Joi.string().hex(),
        generatorPublicKey: publicKey,
        blockSignature: Joi.string().hex(),
        timestamp: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
        height: Joi.object().keys({
            from: Joi.number()
                .integer()
                .positive(),
            to: Joi.number()
                .integer()
                .positive(),
        }),
        numberOfTransactions: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
        totalAmount: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
        totalFee: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
        reward: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
        payloadLength: Joi.object().keys({
            from: Joi.number()
                .integer()
                .min(0),
            to: Joi.number()
                .integer()
                .min(0),
        }),
    },
};
