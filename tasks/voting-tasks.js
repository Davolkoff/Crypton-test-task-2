const { task } = require('hardhat/config');
const VotingArtifact = require('../artifacts/contracts/Votings.sol/Votings.json');
let fs = require('fs');


task("new", "Creates new voting")
  .addParam("contract", "Address of contract")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )

    var candidates = fs.readFileSync('candidates.txt').toString().split("\n");
    const newVotingResponse = await votingContract.newVoting(candidates.length, candidates);
    const newVotingReceipt = await newVotingResponse.wait();
    console.log("\nThe voting has been successfully created!");
    console.log(`Voting ID: ${newVotingReceipt.events[0].args[0].toString()}\n`);
    console.log('Candidates:\n')
    console.log('ID|Address')
    for(i in candidates) {
    console.log(`${i}. ${candidates[i]}`);
    }
  });

task("info", "Information about voting")
  .addParam("contract", "Address of contract")
  .addParam("vid", "Voting ID")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )
    let info = await votingContract.votingInfo (taskArgs.vid);
    console.log(`\n          -Information about voting #${taskArgs.vid}-`);
    console.log("\n                  Candidates:\n");
    console.log("ID|                 Address                |  Votes")
    for (let i = 0; i < info[0].length; i++){
      console.log(`${i}. ${info[0][i]}\t${info[1][i]}`);
    }
    const timeObject = new Date(Number(info[2])*1000);
    console.log(`\n^Date of creation of the voting: ${timeObject}\n`);
    if (info[3] == true) console.log("          -The voting has already ended-\n");
  });

task("withdraw", "Withdraws comission")
  .addParam("contract", "Address of contract")
  .addParam("address", "Withdrawal address")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )
    const withdrawResponse = await votingContract.withdrawComission(taskArgs.address);
    const withdrawReceipt = await withdrawResponse.wait();
    console.log("\nThe comission has been successfully withdrawn");
    console.log(`\nAmount: ${ethers.utils.formatEther(withdrawReceipt.events[0].args[0].toString())} ETH`);
  });

task("vote", "Vote for candidate")
  .addParam("contract", "Address of contract")
  .addParam("vid", "Voting ID")
  .addParam("cid", "Candidate ID")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )

    await votingContract.vote(taskArgs.vid, taskArgs.cid, {value: ethers.utils.parseEther("0.1")});
    console.log(`\nYou successfully voted for ${taskArgs.cid} candidate in #${taskArgs.vid} voting\n`);
  });

task("end", "Ends voting")
  .addParam("contract", "Address of contract")
  .addParam("vid", "Voting ID")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )
    const endVotingResponse = await votingContract.endVoting(taskArgs.vid);
    const endVotingReceipt = await endVotingResponse.wait();
    console.log("\nVoting has been completed successfully");
    
    if (Number(endVotingReceipt.events[0].args[1]) == 0) console.log("\nAll candidates had 0 votes, no one won\n");
    else if (Number(endVotingReceipt.events[0].args[1]) == 1) {
      console.log("\nOnly one user won in this voting\n")
      console.log(`Winning: ${ethers.utils.formatEther(endVotingReceipt.events[0].args[2].toString())} ETH\n`);
    }
    else {
      console.log(`\nWinning divided between ${endVotingReceipt.events[0].args[1].toString()} candidates\n`)
      console.log(`Winning: ${ethers.utils.formatEther(endVotingReceipt.events[0].args[2].toString())} ETH\n`);
    }
  });