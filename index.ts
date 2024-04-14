// 1. Import modules.
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { parseAbiItem } from 'viem'
import  erc20Abi  from './erc20.json'

// 2. Set up your client with desired chain & transport.
const setupClient = () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://mainnet.infura.io/v3/'),
  })
  return client
}

// 3. Consume an action!
(
    async () => {
      const client = setupClient()
      const blockNumber = await client.getBlockNumber()
      // Do something with blockNumber
      console.log(blockNumber);

      const batchSize = 10000n;
      const blockRange = 800n;
      for(let i = blockNumber; i > blockNumber - blockRange; i -= batchSize) {
        const fromBlock = i - batchSize > blockNumber - blockRange ? i - batchSize : blockNumber - blockRange;
        const toBlock = i;
        const logs = await client.getContractEvents({
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          abi: erc20Abi,
          eventName: 'Transfer', 
          fromBlock: fromBlock, 
          toBlock: toBlock
        })
        const logsWithTimestamp = [];
        for (const log of logs) {
          const transaction = await client.getTransaction({ hash: log.transactionHash });
          const block = await client.getBlock({ blockHash: transaction.blockHash });
          logsWithTimestamp.push({ ...log, timestamp: block.timestamp });
        }
        console.log(logsWithTimestamp);
      }
})();