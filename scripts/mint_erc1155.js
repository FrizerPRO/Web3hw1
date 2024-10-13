async function main() {
    const [deployer] = await ethers.getSigners();

    // Адрес вашего развернутого контракта ERC1155
    const address = "0x1cdE56d75a5A7bE8C9224C8E66F562Ea97e9BFF1";
    const ERC1155WithMetadata = await ethers.getContractFactory("ERC1155WithMetadata");

    // Подключаемся к контракту
    const token = ERC1155WithMetadata.attach(address);

    // **a. Вызов функции buyToken (минтинг новых токенов)**
    const tokenURI = "https://ipfs.io/ipfs/QmYRfQVWA7nFX3AVYCXQBXYdqhZfiVcZfduYTjH7Hr2xY4"; // Замените на ваш URI
    const amount = 10; // Количество токенов для покупки
    const tokenPrice = ethers.utils.parseEther("0.01"); // Цена за один токен (должна совпадать с TOKEN_PRICE в контракте)
    const totalPrice = tokenPrice.mul(amount); // Общая стоимость

    const buyTx = await token.buyToken(tokenURI, amount, { value: totalPrice });
    await buyTx.wait();
    console.log(`Minting (buyToken) completed: ${amount} tokens minted`);

    // Получаем ID нового токена из события TransferSingle
    const receipt = await ethers.provider.getTransactionReceipt(buyTx.hash);
    const logs = receipt.logs.filter((log) => log.address.toLowerCase() === token.address.toLowerCase());
    const transferSingleEventInterface = new ethers.utils.Interface([
        "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
    ]);
    let tokenId;
    for (const log of logs) {
        try {
            const event = transferSingleEventInterface.parseLog(log);
            if (event.name === "TransferSingle" && event.args.to.toLowerCase() === deployer.address.toLowerCase()) {
                tokenId = event.args.id.toString();
                break;
            }
        } catch (e) {
            continue;
        }
    }
    console.log(`Minted token ID: ${tokenId}`);

    // **b. safeTransferFrom**
    const recipient = "0x861CEEa00373a1ee0e56d0A27Fd35a42A4241B6b";
    const transferAmount = 2; // Количество токенов для передачи
    const transferTx = await token.safeTransferFrom(deployer.address, recipient, tokenId, transferAmount, "0x");
    await transferTx.wait();
    console.log(`safeTransferFrom completed: Transferred ${transferAmount} tokens of ID ${tokenId} to ${recipient}`);

    // **Запрос событий TransferSingle**
    const filter = token.filters.TransferSingle(null, null, null);
    const currentBlock = await ethers.provider.getBlockNumber();
    const fromBlock = currentBlock - 1000 > 0 ? currentBlock - 1000 : 0;
    const toBlock = currentBlock;

    const transferEvents = await token.queryFilter(filter, fromBlock, toBlock);
    console.log(`Found ${transferEvents.length} TransferSingle events in the last 1000 blocks:`);
    for (const event of transferEvents) {
        console.log(`Operator: ${event.args.operator}, From: ${event.args.from}, To: ${event.args.to}, Token ID: ${event.args.id.toString()}, Value: ${event.args.value.toString()}`);
    }

    // **Запрос событий TransferBatch**
    const batchFilter = token.filters.TransferBatch(null, null, null);
    const batchEvents = await token.queryFilter(batchFilter, fromBlock, toBlock);
    console.log('Found ${batchEvents.length} TransferBatch events in the last 1000 blocks:');
    for (const event of batchEvents) {
        console.log(`Operator: ${event.args.operator}, From: ${event.args.from}, To: ${event.args.to}`);
        console.log('Token IDs: ${event.args.ids.map(id => id.toString()).join(", ")}');
        console.log('Values: ${event.args.values.map(value => value.toString()).join(", ")}');
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
