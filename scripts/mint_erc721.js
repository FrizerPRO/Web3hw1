async function main() {
    const [deployer] = await ethers.getSigners();

    // Адрес вашего развернутого контракта ERC721
    const address = "0x6fFe7715445b466f5cC4C6d35cd4F7825B07922B";
    const ERC721WithMetadata = await ethers.getContractFactory("ERC721WithMetadata");

    // Подключаемся к контракту
    const token = ERC721WithMetadata.attach(address);

    // **a. Вызов функции buyToken (минтинг нового токена)**
    const tokenURI = "https://ipfs.io/ipfs/QmYRfQVWA7nFX3AVYCXQBXYdqhZfiVcZfduYTjH7Hr2xY4";
    const buyTx = await token.buyToken(tokenURI, { value: ethers.utils.parseEther("0.001") });
    await buyTx.wait();
    console.log("Minting (buyToken) completed");

    // Получаем ID нового токена из события Transfer
    const receipt = await ethers.provider.getTransactionReceipt(buyTx.hash);
    const logs = receipt.logs.filter((log) => log.address.toLowerCase() === token.address.toLowerCase());
    const transferEventInterface = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ]);
    let tokenId;
    for (const log of logs) {
        try {
            const event = transferEventInterface.parseLog(log);
            if (event.name === "Transfer" && event.args.to.toLowerCase() === deployer.address.toLowerCase()) {
                tokenId = event.args.tokenId.toString();
                break;
            }
        } catch (e) {
            continue;
        }
    }
    console.log(`Minted token ID: ${tokenId}`);

    // **b. transferFrom**
    const recipient = "0x861CEEa00373a1ee0e56d0A27Fd35a42A4241B6b";
    const transferFromTx = await token.transferFrom(deployer.address, recipient, tokenId);
    await transferFromTx.wait();
    console.log(`TransferFrom completed: Token ID ${tokenId} transferred to ${recipient}`);

    // **c. safeTransferFrom**
    // Передача токена обратно владельцу с помощью safeTransferFrom
    const safeTransferTx = await token[`safeTransferFrom(address,address,uint256)`](recipient, deployer.address, tokenId);
    await safeTransferTx.wait();
    console.log(`safeTransferFrom completed: Token ID ${tokenId} transferred back to ${deployer.address}`);

    // Слот, в котором объявлен mapping _balances
    const mappingSlot = 0;

    // Вычисляем ключ для баланса пользователя
    const paddedAddress = ethers.utils.hexZeroPad(deployer.address, 32);
    const paddedSlot = ethers.utils.hexZeroPad(ethers.utils.hexlify(mappingSlot), 32);

    const mappingKey = ethers.utils.keccak256(paddedAddress);

    // Читаем значение из хранилища
    const balanceHex = await ethers.provider.getStorageAt(address, mappingKey);
    const balance_1 = ethers.BigNumber.from(balanceHex);

    console.log(`Баланс пользователя ${deployer.address}: ${balance_1.toString()} токенов`);

    // **Запрос событий Transfer**
    const filter = token.filters.Transfer(null, null);
    const currentBlock = await ethers.provider.getBlockNumber();
    const fromBlock = currentBlock - 1000 > 0 ? currentBlock - 1000 : 0;
    const toBlock = currentBlock;

    const transferEvents = await token.queryFilter(filter, fromBlock, toBlock);
    console.log(`Found ${transferEvents.length} Transfer events in the last 1000 blocks:`);
    for (const event of transferEvents) {
        console.log(`From: ${event.args.from}, To: ${event.args.to}, Token ID: ${event.args.tokenId.toString()}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
