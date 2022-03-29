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

    mapping (address => uint) votersAttempts; // accounting for the number of attempts of each user

    struct Candidate {
        address addr; // candidate's wallet
        uint votes; // number of votes
    }

    struct Voting {
        mapping (uint256 => Candidate) candidates; // candidates inside the voting
        mapping (address => bool) voters; // people who have already voted
        uint numCandidates; // number of candidates to assign an id to each
        uint creationTime; // creation time to track expiration time
        bool ended; // it is necessary so that the voting can be completed only once
    }

    uint comission; // all commissions are saved here
    uint numVotings; // needed to assign a voting ID to each vote
    mapping (uint256 => Voting) votings; // all votes in the smart contract

    // creating a new vote
    function newVoting (uint numOfCandidates, address[] memory fCandidates) public requireOwner returns (uint votingID) {
        votingID = numVotings;
        Voting storage new_voting = votings[votingID];
        new_voting.creationTime = block.timestamp;
        
        // adding candidates to the voting
        for (uint i = 0; i < numOfCandidates; i++){
        new_voting.candidates[new_voting.numCandidates++].addr = fCandidates[i];
        }
        numVotings++;
    }

    // returns the id of the last vote + 1
    function lastVoting () public view returns (uint) {
        return numVotings;
    }

    // returns voting information
    function votingInfo (uint _votingID) public view returns (address [] memory, uint [] memory, uint, bool) {
    
    address [] memory tempCandidates = new address[](votings[_votingID].numCandidates);
    uint[] memory tempVotes = new uint[](votings[_votingID].numCandidates);

    for (uint i = 0; i < votings[_votingID].numCandidates; i++) {
        tempCandidates[i] = votings[_votingID].candidates[i].addr;
        tempVotes[i] = votings[_votingID].candidates[i].votes;
    }
    return (tempCandidates, tempVotes, votings[_votingID].creationTime, votings[_votingID].ended);
    }

    // commission withdrawal
    function withdraw(address payable _to) public requireOwner {
        if (comission == 0) revert ("Nothing to withdraw");
        _to.transfer(comission);
        comission = 0;
    }

    // ends the voting
    function endVoting (uint _votingID) public {
        uint sumOfTransactions;
        uint maxVotes;
        uint winnerID;
        if ((block.timestamp >= votings[_votingID].creationTime + 259200) && votings[_votingID].ended == false) {
            
            for (uint i = 0; i < votings[_votingID].numCandidates; i++) {
                sumOfTransactions = sumOfTransactions + (votings[_votingID].candidates[i].votes) * 100000000000000000;
                if (votings[_votingID].candidates[i].votes > maxVotes) {
                    maxVotes = votings[_votingID].candidates[i].votes;
                    winnerID = i;
                }
            }
            payable(votings[_votingID].candidates[winnerID].addr).transfer(sumOfTransactions*9/10);
            comission = comission + (sumOfTransactions*1/10);
            votings[_votingID].ended = true;
        }
        else if (block.timestamp - votings[_votingID].creationTime < 259200) revert ("It's not time yet");
        else revert ("Voting already ended");
    }

    // take part in the voting
    function vote (uint _votingID, uint _candidateID) public {
        if (votings[_votingID].voters[msg.sender] == false && votersAttempts[msg.sender] > 0) {
            votings[_votingID].candidates[_candidateID].votes += 1;
            votings[_votingID].voters[msg.sender] = true;
            votersAttempts[msg.sender] -= 1;
        }
        else if (votersAttempts[msg.sender] == 0) revert ("Not enough attempts");
        else revert ("Already voted");
    }
    
    // the function responsible for transferring money to the contract
    receive () external payable {
        votersAttempts[msg.sender] += msg.value / 100000000000000000;
    }
}
