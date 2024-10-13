async function main() {
  // Получаем аккаунты для развертывания
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Получаем контрактную фабрику
  const MyToken = await ethers.getContractFactory("MyToken");

  // Развертываем контракт
  const myToken = await MyToken.deploy(1000000, 2);
  await myToken.deployed();

  console.log("MyToken deployed to:", myToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
