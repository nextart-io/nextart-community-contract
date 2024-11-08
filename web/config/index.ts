import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

type Network = "mainnet" | "testnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "mainnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            whitelistPackageId:"0x64b061ccb10a0203446129a43c9a925bd2c977ec2dbcdf3948b29d98fd6a17bf",
            whitelistSharedObjectId:"0xed59eb1f34fd65419cd01a9695f422cead04f04aa1697f6d61dd979ad2a3b11a",
            adminId:"0x6a3ca55bec2a960b31cf6dc76121e38198c592840ef30dc323a441db8bfe5b3f",
            digest:"Aw5tgHo4ZUVVN8EvyQwEQL87gAnzCJK8by1kCqvPh6zi"
        },
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            whitelistPackageId:"0xcfe9fb8807a13715f4f4a1b35258ca544a75cfad8cf53cf60d2d268979e9c5a5",
            whitelistSharedObjectId:"0x334bd87172247eda7e12af04148856b36db18719c68b97ddbbc36cb5bee82445",
            adminId:"0x7a6ddabe87fc1f11ea01ea9344f0a165adb170b98ae1b8f08bf7c301d46ff42d",
            digest:"oaaAAzeczeVdUq8H2kgS7fjm1ae34xEedgHV3zHMohm"
        },
    },
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient };
