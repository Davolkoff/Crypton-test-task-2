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
    await votingContract.newVoting(candidates.length, candidates);
    console.log("\nThe voting has been successfully created!")
    console.log(`Voting ID: ${await votingContract.lastVoting()-1}\n`)
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
    console.log(`         -Information about contract #${taskArgs.vid}-`);
    console.log("\n                  Candidates:\n");
    console.log("ID|                 Address                |  Votes")
    for (let i = 0; i < info[0].length; i++){
      console.log(`${i}.${info[0][i]}\t${info[1][i]}`);
    }
    const timeObject = Date(Number(info[2])*1000);
    console.log(`\n^Date of creation of the vote: ${timeObject.toLocaleLowerCase()}`);
    if (info[3] == true) console.log("\n          -The voting has already ended-");
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
    await votingContract.withdrawComission(taskArgs.address);
    console.log("The commission has been successfully withdrawn");
  });

task("vote", "Vote for candidate")
  .addParam("contract", "Address of contract")
  .addParam("vid", "Voting ID")
  .addParam("cid", "Candidate ID")
  .addFlag("payed", "Use, if you payed for vote")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const votingContract = new hre.ethers.Contract(
      taskArgs.contract,
      VotingArtifact.abi,
      signer
    )
    if (!taskArgs.payed) {
      const tx = {
        to: taskArgs.contract,
        value: hre.ethers.utils.parseEther('0.1')
      }
      
      const txSend = await signer.sendTransaction(tx);
      await txSend.wait();
      await votingContract.vote(taskArgs.vid, taskArgs.cid);
    }
    else await votingContract.vote(taskArgs.vid, taskArgs.cid);
    console.log(`You successfully voted for ${taskArgs.cid} candidate in #${taskArgs.vid} voting`)
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
    await votingContract.endVoting(taskArgs.vid);
    console.log("Voting has been completed successfully");
  });
