require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require('solidity-coverage');
require('./tasks/voting-tasks.js');

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby:{
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    }
  },
  plugins: ["solidity-coverage"]
};
