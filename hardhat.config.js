// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");


const ALCHEMY_API_KEY = "N3asFl7CN3VFHtz-97cHTPZqljdbwCaB";
const SEPOLIA_PRIVATE_KEY ="12e0d594e2c870a12d6c4c16ea23a4514c7410a2d782ccb23a72972506f1b7e3";
module.exports = {
  solidity: "0.8.18",

  networks:{
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`],
    }
  }
};