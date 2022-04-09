const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner;
let addr1;
let addr2;
let addr3;
let addr4;
let addr5;
let candidates;

describe("Votings", function () {
  beforeEach(async function () {  
    const Votings = await ethers.getContractFactory("Votings");
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
  
    votings = await Votings.deploy();
    await votings.deployed();
    candidates = [addr1.address, addr2.address, addr3.address];
  });

  describe("Create new voting", function () {
    it("Should create a new voting only by owner", async function () {
      await expect(
        votings.connect(addr1).newVoting(candidates.length, candidates)
        ).to.be.revertedWith("Not an owner");
    });
  
    it("Should create a new voting", async function (){
      await votings.newVoting(candidates.length, candidates);
      let arrayOfFunction = await votings.votingInfo(Number(await votings.lastVoting()));
      expect(JSON.stringify(arrayOfFunction[0])).to.equal(JSON.stringify(candidates));
    });
  });

  describe("Returning information", function () {
    beforeEach(async function () {
      await votings.newVoting(candidates.length, candidates);
    });

    it("Should return information about participants of voting", async function () {
      let candidates2 = [addr3.address, addr4.address, addr5.address];
      await votings.newVoting(candidates2.length, candidates2);
      let arrayOfFunction = await votings.votingInfo(1);
      expect(JSON.stringify(arrayOfFunction[0])).to.equal(JSON.stringify(candidates2));
    });

    it("Should return information about votes", async function () {
      await votings.vote(0, 1, {value: ethers.utils.parseEther("0.1")});
      
      let arrayOfFunction = await votings.votingInfo(0);
      let numberedArray = [];

      for (let i = 0; i < arrayOfFunction.length-1; i++) {
        numberedArray.push(Number(arrayOfFunction[1][i]));
      }

      expect(JSON.stringify(numberedArray)).to.equal(JSON.stringify([0, 1, 0]));
    });

    it("Should return information about status of voting", async function () {
    });
  });
  
  describe("Vote", function () {
    beforeEach(async function () {
      await votings.newVoting(candidates.length, candidates);
    });
    
    it("Should check whether the user has voted", async function () {
      await votings.vote(0, 1, {value: ethers.utils.parseEther('0.2')});
      await expect(votings.vote(0, 1)).be.revertedWith("Already voted");
    });
  });
  
  describe("Ending of voting and withdraw", function () {
    beforeEach(async function () {
      await votings.newVoting(candidates.length, candidates);
      await votings.vote(0,1, {value: ethers.utils.parseEther('0.1')});
      await votings.connect(addr1).vote(0,1, {value: ethers.utils.parseEther('0.1')});
      await votings.connect(addr2).vote(0,0, {value: ethers.utils.parseEther('0.1')});
    });

    describe("Ending of voting", function () {
      it("Should end the voting", async function () {
        await network.provider.send("evm_increaseTime", [260000])
        let startBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr2.address));
        
        await votings.connect(addr3).endVoting(0)
        let endBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr2.address));
        
        let arrayOfFunction = await votings.votingInfo(0);
        expect(arrayOfFunction[3]).to.equal(true);
        expect(Math.round(parseFloat(endBalance - startBalance) * 100) / 100).to.equal(0.27);
      });
  
      it("Should revert the action if 3 days have not passed", async function () {
        await expect(votings.connect(addr3).endVoting(0)).to.be.revertedWith("It's not time yet");
      });
  
      it("Should revert the action if the voting already ended", async function () {
        await network.provider.send("evm_increaseTime", [260000])
        await votings.connect(addr3).endVoting(0);
        await expect(votings.connect(addr3).endVoting(0)).to.be.revertedWith("Voting already ended");
      });
    });
    
    describe("Withdraw", function () {
      it("Should withdraw comission from contract", async function () {
        await network.provider.send("evm_increaseTime", [260000])
        await votings.connect(addr3).endVoting(0);
        let startBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr5.address));
        await votings.withdrawComission(addr5.address);
        let endBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr5.address));
        expect(Math.round(parseFloat(endBalance - startBalance) * 100) / 100).to.equal(0.03);
      });
  
      it("Should revert the action if the balance of contract is 0", async function () {
        await expect(votings.withdrawComission(owner.address)).to.be.revertedWith("Nothing to withdraw");
      });
    });
  });

});
