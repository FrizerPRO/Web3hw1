const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  MaxUint256
} = require("@ethersproject/constants");

describe("MyToken", function () {
  let MyToken, myToken, owner, addr1, addr2;
  const purchaseRate = 100;  // предполагаемое количество токенов за 1 ETH
  const transferFeeRate = 2; // комиссия 2%

  beforeEach(async function () {
    // Получаем контракты и аккаунты
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2, spender] = await ethers.getSigners();

    // Деплой контракта
    myToken = await MyToken.deploy(purchaseRate, transferFeeRate);
  });

  it("should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(await myToken.totalSupply()).to.equal(ownerBalance);
  });

  it("should allow purchase of tokens", async function () {
    // addr1 покупает токены на 1 ETH
    await myToken.connect(addr1).buyToken({ value: ethers.parseEther("1") });

    const addr1Balance = await myToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseUnits(purchaseRate.toString(), 18));
  });

  it("should transfer tokens and charge a fee", async function () {
    // addr1 покупает токены на 1 ETH
    await myToken.connect(addr1).buyToken({ value: ethers.parseEther("1") });

    const amountToSend = 50; // Отправляемая сумма
    const fee = (amountToSend * transferFeeRate) / 100;  // Комиссия
    const amountAfterFee = amountToSend - fee;

    // addr1 отправляет токены addr2
    await myToken.connect(addr1).transfer(addr2.address, amountToSend);

    const addr2Balance = await myToken.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(amountAfterFee);

    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(fee);
  });

});
