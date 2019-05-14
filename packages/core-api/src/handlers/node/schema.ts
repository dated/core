import { app } from "@arkecosystem/core-container";
import joi from "@hapi/joi";

export const fees: object = {
    query: {
        days: joi
            .number()
            .integer()
            .min(1)
            .max(app.resolveOptions("api").feesDaysLimit)
            .default(7),
    },
};
