//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Votings {
    
    address owner; // contract owner

    constructor () {
        owner = msg.sender; // assignment of the owner status
    }

    // checking for the owner
    modifier requireOwner () { 
        require(owner == msg.sender, "Not an owner");
        _;
    }

    struct Candidate {
        address addr; // candidate's wallet
        uint votes; // number of votes
    }

    struct Voting {
        Candidate[] candidates; // list of candidates
        mapping (address => bool) voters; // people who have already voted
        uint creationTime; // creation time to track expiration time
        bool ended; // it is necessary so that the voting can be completed only once
    }

    uint comission; // all commissions are saved here
    Voting [] votings; // list of votings

    // creating a new vote
    function newVoting (uint numOfCandidates, address[] memory fCandidates) external requireOwner {
        votings.push();
        Voting storage new_voting = votings[votings.length-1];
        new_voting.creationTime = block.timestamp;
        
        // adding candidates to the voting
        for (uint i = 0; i < numOfCandidates; i++){
        new_voting.candidates.push();
        new_voting.candidates[i].addr = fCandidates[i];
        }
    }

    // returns the id of the last vote
    function lastVoting () external view returns (uint) {
        return votings.length - 1;
    }

    // returns voting information
    function votingInfo (uint _votingID) external view returns (address [] memory, uint [] memory, uint, bool) {
    
    address [] memory tempCandidates = new address[](votings[_votingID].candidates.length);
    uint[] memory tempVotes = new uint[](votings[_votingID].candidates.length);

    for (uint i = 0; i < votings[_votingID].candidates.length; i++) {
        tempCandidates[i] = votings[_votingID].candidates[i].addr;
        tempVotes[i] = votings[_votingID].candidates[i].votes;
    }
    return (tempCandidates, tempVotes, votings[_votingID].creationTime, votings[_votingID].ended);
    }

    // commission withdrawal
    function withdrawComission(address payable _to) external requireOwner {
        if (comission == 0) revert ("Nothing to withdraw");
        _to.transfer(comission);
        comission = 0;
    }

    // ends the voting
    function endVoting (uint _votingID) external {
        require(block.timestamp >= votings[_votingID].creationTime + 259200, "It's not time yet");
        require(votings[_votingID].ended == false, "Voting already ended");
        
        uint sumOfTransactions;
        uint maxVotes;
        uint winnerID;
        uint winnersCount;
        for (uint i = 0; i < votings[_votingID].candidates.length; i++) {
            sumOfTransactions = sumOfTransactions + (votings[_votingID].candidates[i].votes) * 100000000000000000;
            if (votings[_votingID].candidates[i].votes > maxVotes) {
                maxVotes = votings[_votingID].candidates[i].votes;
                winnerID = i;
                winnersCount = 1;
            }
            else if (votings[_votingID].candidates[i].votes == maxVotes) winnersCount += 1;
        }
        
        if (winnersCount == 1) {
            payable(votings[_votingID].candidates[winnerID].addr).transfer(sumOfTransactions*9/10);
            comission = comission + (sumOfTransactions*1/10);
            votings[_votingID].ended = true;
        }
        else if (maxVotes == 0) votings[_votingID].ended = true;
        else {
            uint winning = sumOfTransactions / winnersCount * 9 / 10;
            comission = sumOfTransactions * 1 / 10;

            for (uint i = 0; i < votings[_votingID].candidates.length; i++) {
                if (votings[_votingID].candidates[i].votes == maxVotes) {
                    payable(votings[_votingID].candidates[i].addr).transfer(winning);
                }
            }
        }
    }

    // take part in the voting
    function vote (uint _votingID, uint _candidateID) external payable {
        require(votings[_votingID].voters[msg.sender] == false, "Already voted");
        
        votings[_votingID].candidates[_candidateID].votes += 1;
        votings[_votingID].voters[msg.sender] = true;
    }
}
