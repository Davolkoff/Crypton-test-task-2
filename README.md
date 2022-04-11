# Crypton-test-task-2

>This is my second project that I wrote in Js and Solidity. It was written as a test assignment for admission to an internship at Crypton.

>The project contains a smart contract, tasks for performing the functions prescribed in the smart contract, script to deploy it to rinkeby network and unit tests, that can be run through the solidity coverage plugin.

1. Deploy and coverage
 + [Deploy](#Deploy);
 + [Coverage](#Coverage).
2. Tasks
 + [New vote](#New);
 + [Get info about vote](#Info);
 + [Withdraw comission](#Withdraw);
 + [Vote for candidate](#Vote);
 + [End of vote](#End).
3. Explanation of solutions in code
 + [Arrays or mapping](#AMExplanation)
 + [Preincrements of increments](#PIExplanation)
 + [End of vote](#EndExplanation)

## 1. Deploy and coverage

#### <a name="Deploy"></a> - Run script to deploy contract in Rinkeby:
```shell
npx hardhat run scripts/deploy.js
```
#### <a name="Coverage"></a> - Run solidity coverage:
```shell
npx hardhat coverage --network hardhat
```
-------------------------
## 2. Tasks:

#### <a name="New"> - Creates a new vote, using a list from a file candidates.txt (The command can only be run by the contract owner)
```shell
npx hardhat new

Usage: hardhat [GLOBAL OPTIONS] new --contract <STRING>

OPTIONS:

  --contract	Address of contract 
```
Example:
```shell
npx hardhat new --contract 0x1f8A6c11cD40287DB45dF8B6B80D49727f7cFC94
```

#### <a name="Info"></a> - Returns information about a specific vote
```shell
npx hardhat info

Usage: hardhat [GLOBAL OPTIONS] info --contract <STRING> --vid <STRING>

OPTIONS:

  --contract	Address of contract 
  --vid     	Voting ID 
```
Example:
```shell
npx hardhat info --contract 0x1f8A6c11cD40287DB45dF8B6B80D49727f7cFC94 --vid 0
```

#### <a name="Withdraw"></a> - Withdraws commissions from completed votes (The command can only be run by the contract owner)
```shell
npx hardhat withdraw

Usage: hardhat [GLOBAL OPTIONS] withdraw --address <STRING> --contract <STRING>

OPTIONS:

  --address 	Withdrawal address 
  --contract	Address of contract 
```
Example:
```shell
npx hardhat withdraw --contract 0x1f8A6c11cD40287DB45dF8B6B80D49727f7cFC94 --user 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95
```
#### <a name="Vote"></a> - Votes for the selected candidate in the selected vote (you can pay for the right to vote separately)
```shell
npx hardhat vote

Usage: hardhat [GLOBAL OPTIONS] vote --cid <STRING> --contract <STRING> [--payed] --vid <STRING>

OPTIONS:

  --cid     	Candidate ID 
  --contract	Address of contract 
  --payed   	Use, if you payed for vote 
  --vid     	Voting ID 
```
Example:
```shell
npx hardhat vote --contract 0x1f8A6c11cD40287DB45dF8B6B80D49727f7cFC94 --cid 4 --vid 15 
```
#### <a name="End"></a> - Finishes vote, counts the commission and the fee to the winner, and then sends the fee (it can be called only 3 days after the creation of the vote)
```shell
npx hardhat end

Usage: hardhat [GLOBAL OPTIONS] end --contract <STRING> --vid <STRING>

OPTIONS:

  --contract	Address of contract 
  --vid     	Voting ID 
```
Example:
```shell
npx hardhat end --contract 0x1f8A6c11cD40287DB45dF8B6B80D49727f7cFC94 --vid 15 
```
--------------------------
## 3. Explanation of solutions in code
#### <a name="AMExplanation"></a> - Arrays or mapping
I decided to use an array to store information about candidates due to the fact that it would consume about 5 times less gas than if I used mapping and an additional variable storing the number of candidates.

I also used an array to store information about votes, because I noticed that if there are about 1000 votes in one contract, it will cost less gas than if I used mapping and a separate variable that stores the number of the last vote. If the contract contains fewer votes, it would be more appropriate to use mapping.
  
I put voters in mapping due to the fact that the search for the voter is carried out not by index, but by address.

#### <a name="PIExplanation"></a> - Preincremets or increments 
In all "for" cycles, I used preincrements because they also consume less gas
  
#### <a name="EndExplanation"></a> - End of vote
In line 116 of the solidity file, I used the variable "maxVotes" in if, because in this case all the people are the winners of the vote, but in fact there are no winners. I added the situation with the absence of winners for the correct output of information to the console at the end of voting, so that users do not think that all the voting participants won.
--------------------------
