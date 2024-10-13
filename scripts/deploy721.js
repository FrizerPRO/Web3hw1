async function main() {
    // Получаем аккаунты для развертывания
    const [deployer] = await ethers.getSigners();

    console.log("Deploying ERC721WithMetadata with the account:", deployer.address);

    // Получаем контрактную фабрику
    const ERC721WithMetadata = await ethers.getContractFactory("ERC721WithMetadata");

    // Развертываем контракт
    const erc721Token = await ERC721WithMetadata.deploy();
    await erc721Token.deployed();

    console.log("ERC721WithMetadata deployed to:", erc721Token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
