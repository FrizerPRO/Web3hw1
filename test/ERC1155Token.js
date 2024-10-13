const { expect } = require("chai");
const { ethers } = require("hardhat");
const AddressZero = "0x0000000000000000000000000000000000000000";

describe("ERC1155WithMetadata", function () {
  it("Should mint a new token set and assign metadata URI", async function () {
    const [owner] = await ethers.getSigners();
    const ERC1155WithMetadata = await ethers.getContractFactory("ERC1155WithMetadata");
    const token = await ERC1155WithMetadata.deploy();

    const tokenURI = "https://example.com/metadata/1";
    const amount = 10;
    const mintTx = await token.buyToken(tokenURI, amount, { value: ethers.parseEther("0.1") });

    await expect(mintTx)
        .to.emit(token, "TransferSingle")
        .withArgs(owner.address, AddressZero, owner.address, 1, amount);

    expect(await token.uri(1)).to.equal(tokenURI);
  });
});

