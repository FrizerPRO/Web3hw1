async function main() {
    const [deployer] = await ethers.getSigners();

    // Адрес вашего развернутого контракта ERC20
    const address = "0x0db39E21982077D178e3d6759a4fEfEA028B8a36";
    const MyToken = await ethers.getContractFactory("MyToken");

    // Подключаемся к контракту
    const token = MyToken.attach(address);

    // **a. mint**
    const mintTx = await token.mint(deployer.address, 100);
    await mintTx.wait();
    console.log("Minting completed");

    // **b. transfer**
    const recipient = "0x861CEEa00373a1ee0e56d0A27Fd35a42A4241B6b";
    const amount = 50;
    const transferTx = await token.transfer(recipient, amount);
    await transferTx.wait();
    console.log(`Transferred ${amount} tokens to ${recipient}`);

    // **c. transferFrom**
    // Одобряем перевод токенов
    const approveAmount = 30;
    const approveTx = await token.approve(deployer.address, approveAmount);
    await approveTx.wait();
    console.log(`Approved ${approveAmount} tokens for ${deployer.address}`);

    // Переводим токены с помощью transferFrom
    const transferFromTx = await token.transferFrom(deployer.address, recipient, approveAmount);
    await transferFromTx.wait();
    console.log(`Transferred ${approveAmount} tokens from ${deployer.address} to ${recipient} using transferFrom`);

    // **d. buy** (buyToken)
    // Предположим, что ваш контракт имеет функцию buyToken(), которая позволяет покупать токены за ETH
    const buyValue = ethers.utils.parseEther("0.1"); // Количество ETH для покупки токенов
    const buyTx = await token.buyToken({ value: buyValue });
    await buyTx.wait();
    console.log(`Bought tokens for ${ethers.utils.formatEther(buyValue)} ETH`);

    // **Запрос событий Transfer**
    // Создаем фильтр для событий Transfer
    const filter = token.filters.Transfer(null, null);

    // Определяем диапазон блоков (например, от последнего 1000 блоков)
    const currentBlock = await ethers.provider.getBlockNumber();
    const fromBlock = currentBlock - 1000 > 0 ? currentBlock - 1000 : 0;
    const toBlock = currentBlock;

    // Запрашиваем события Transfer
    const transferEvents = await token.queryFilter(filter, fromBlock, toBlock);
    console.log(`Found ${transferEvents.length} Transfer events in the last 1000 blocks:`);
    for (const event of transferEvents) {
        console.log(`From: ${event.args.from}, To: ${event.args.to}, Value: ${event.args.value.toString()}`);
    }

    // **Дополнительно: Проверка баланса**
    const balance = await token.balanceOf(deployer.address);
    console.log(`Your balance: ${balance.toString()} tokens`);

    // Слот, в котором объявлен mapping _balances
    const mappingSlot = 0;

    // Вычисляем ключ для баланса пользователя
    const paddedAddress = ethers.utils.hexZeroPad(deployer.address, 32);
    const paddedSlot = ethers.utils.hexZeroPad(ethers.utils.hexlify(mappingSlot), 32);

    const mappingKey = ethers.utils.keccak256(paddedAddress + paddedSlot.slice(2));

    // Читаем значение из хранилища
    const balanceHex = await ethers.provider.getStorageAt(address, mappingKey);
    const balance_1 = ethers.BigNumber.from(balanceHex);

    console.log(`Баланс пользователя ${deployer.address}: ${balance_1.toString()} токенов`);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
