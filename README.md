# Crypton-test-task-2

>This is my second project that I wrote in Js and Solidity. It was written as a test assignment for admission to an internship at Crypton.

>The project contains a smart contract, tasks for performing the functions prescribed in the smart contract, script to deploy it to rinkeby network and unit tests, that can be run through the solidity coverage plugin.

--------------------------

Run script to deploy contract in Rinkeby:
```shell
npx hardhat run scripts/deploy.js
```

Tasks:

- Creates a new voting, using a list from a file candidates.txt (The command can only be run by the contract owner)
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
- Returns information about a specific vote
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
- Withdraws commissions from completed votes (The command can only be run by the contract owner)
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
- Votes for the selected candidate in the selected voting (you can pay for the right to vote separately)
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
- Finishes voting, counts the commission and the fee to the winner, and then sends the fee (it can be called only 3 days after the creation of the vote)
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



Run solidity coverage:
```shell
npx hardhat coverage --network hardhat
```
--------------------------
