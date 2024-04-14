"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const erc20_json_1 = __importDefault(require("./erc20.json"));
const setupClient = () => {
    const client = (0, viem_1.createPublicClient)({
        chain: chains_1.mainnet,
        transport: (0, viem_1.http)('https://mainnet.infura.io/v3/'),
    });
    return client;
};
(async () => {
    const client = setupClient();
    const blockNumber = await client.getBlockNumber();
    console.log(blockNumber);
    const batchSize = 10000n;
    const blockRange = 800n;
    for (let i = blockNumber; i > blockNumber - blockRange; i -= batchSize) {
        const fromBlock = i - batchSize > blockNumber - blockRange ? i - batchSize : blockNumber - blockRange;
        const toBlock = i;
        const logs = await client.getContractEvents({
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            abi: erc20_json_1.default,
            eventName: 'Transfer',
            fromBlock: fromBlock,
            toBlock: toBlock
        });
        const logsWithTimestamp = [];
        for (const log of logs) {
            const transaction = await client.getTransaction({ hash: log.transactionHash });
            const block = await client.getBlock({ blockHash: transaction.blockHash });
            logsWithTimestamp.push({ ...log, timestamp: block.timestamp });
        }
        console.log(logsWithTimestamp);
    }
})();
//# sourceMappingURL=index.js.map