require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  ethers: "5.7.2",
  etherscan: {
    apiKey: {
      polygonAmoy: 'AF4FPPUGBR7HHX6DUMXAWJ68X1RTD9MA3H'
    }
  },
  networks: {
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/nFxpA-_-qdzXpjM07dQrgV_VmTCr8l00",
      accounts: [`5acfc502e3cd65ced1650e5449da8c1fe41c45b2e394d77bb4a096db34181af2`],
      chainId: 80002
    }
  },
  solidity: {
    version: "0.8.27", // or your Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  sourcify: {
    enabled: true
  }
};
