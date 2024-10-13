const { expect } = require("chai");
const { ethers } = require("hardhat");
const AddressZero = "0x0000000000000000000000000000000000000000";

describe("ERC721WithMetadata", function () {
  it("Should mint a new NFT and set metadata URI", async function () {
    const [owner] = await ethers.getSigners();
    const ERC721WithMetadata = await ethers.getContractFactory("ERC721WithMetadata");
    const nft = await ERC721WithMetadata.deploy();

    const tokenURI = "https://example.com/metadata/1";
    const mintTx = await nft.buyToken(tokenURI, { value: ethers.parseEther("0.1") });

    await expect(mintTx).to.emit(nft, "Transfer").withArgs(AddressZero, owner.address, 1);

    expect(await nft.tokenURI(1)).to.equal(tokenURI);
  });
});

