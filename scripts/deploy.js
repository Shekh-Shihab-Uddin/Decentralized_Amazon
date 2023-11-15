// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const  {items}  = require("../src/items.json")

//function for making the wei into ethers
const tokens = (wei) =>{
  return hre.ethers.utils.parseUnits(wei.toString(), "ether");
}

async function main() {
  //code for operation for deployment

  //setup accounts
  const [deployer] = await hre.ethers.getSigners();//first accoount from the list

  //deploying the contract
  const Dappazon = await hre.ethers.getContractFactory("Dappazon");
  const dappazon = await Dappazon.deploy()
  await dappazon.deployed();

  console.log(`Deployed contract address: ${dappazon.address}\n`)

  //list of items fetching from the file that is imported above as items
  for(let i=0; i<(items.length); i++){
    const transaction = await dappazon.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].catagory,
      items[i].img,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock,
    )
    await transaction.wait()
    console.log(`Items: ${items[i].id}: ${items[i].name}`)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});