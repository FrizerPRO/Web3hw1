async function main() {
    // Получаем аккаунты для развертывания
    const [deployer] = await ethers.getSigners();

    console.log("Deploying ERC1155WithMetadata with the account:", deployer.address);

    // Получаем контрактную фабрику
    const ERC1155WithMetadata = await ethers.getContractFactory("ERC1155WithMetadata");

    // Развертываем контракт (если конструктор принимает базовый URI)

    const erc1155Token = await ERC1155WithMetadata.deploy();
    await erc1155Token.deployed();

    console.log("ERC1155WithMetadata deployed to:", erc1155Token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
