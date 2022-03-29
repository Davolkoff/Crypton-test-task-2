const hre = require('hardhat');

async function main() {
    
    const [signer] = await hre.ethers.getSigners(); //getting the first account from the created hardhat

    const Voting = await hre.ethers.getContractFactory("Votings", signer); // getting a contract
    const voting = await Voting.deploy(); // contract execution

    await voting.deployed(); // waiting for the contract to be deployed

    console.log("Contract address: ", voting.address); // outputs the address of the contract
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });