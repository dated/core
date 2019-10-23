import { State } from "@arkecosystem/core-interfaces";
import { Wallets } from "@arkecosystem/core-state";
import { IBridgechainWalletAttributes, IBusinessWalletAttributes } from "./interfaces";

export enum MagistrateIndex {
    Businesses = "businesses",
    Bridgechains = "bridgechains",
}

export const businessIndexer = (index: State.IWalletIndex, wallet: Wallets.Wallet): void => {
    if (wallet.isBusiness()) {
        const business: IBusinessWalletAttributes = wallet.getAttribute<IBusinessWalletAttributes>("business");
        if (business !== undefined && !business.resigned) {
            index.set(business.businessId.toFixed(), wallet);
        }
    }
};

export const bridgechainIndexer = (index: State.IWalletIndex, wallet: Wallets.Wallet): void => {
    if (wallet.hasBridgechains()) {
        const bridgechains: Record<string, IBridgechainWalletAttributes> = wallet.getAttribute("business.bridgechains");
        for (const bridgechainId of Object.keys(bridgechains)) {
            // TODO: allow generic index values to create more sophisticated indexes like businessId -> bridgechains
            index.set(bridgechainId, wallet);
        }
    }
};
