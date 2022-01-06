import { ethers } from 'ethers';
import { TestNetwork } from './TestNetwork';
import { ERC20Token__factory } from './utils/ERC20Token__factory';

const HTTP_JSON_RPC_PROVIDER = 'http://localhost:8545';
const WS_JSON_RPC_PROVIDER = 'ws://localhost:8545';

describe('eth test network', () => {
  let testnetwork: TestNetwork;

  // Act before assertions
  beforeEach(async () => {
    testnetwork = await TestNetwork.init();
  });
  afterEach(async () => {
    await testnetwork.close();
  });

  describe('http', function(){
    it('should check block number', async () => {
      const provider = new ethers.providers.JsonRpcProvider(HTTP_JSON_RPC_PROVIDER);
      const blockNumber = await provider.getBlockNumber();
      expect(blockNumber).toBe(0);
    });

    it('genesis accounts should have funds', async () => {
      const provider = new ethers.providers.JsonRpcProvider(HTTP_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      );
      const balance = await provider.getBalance(wallet.address);
      expect(balance.gt(ethers.constants.Zero)).toBeTruthy();
    });

    it('should be able to send funds', async () => {
      const provider = new ethers.providers.JsonRpcProvider(HTTP_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      ).connect(provider);
      const randomWallet = ethers.Wallet.createRandom();
      const value = ethers.utils.parseEther('500');
      const tx = await wallet.sendTransaction({
        to: randomWallet.address,
        value: value,
      });
      await tx.wait();
      const balance = await provider.getBalance(randomWallet.address);
      expect(value.eq(balance)).toBeTruthy();
    });

    it('should deploy erc20 and send token', async () => {
      const provider = new ethers.providers.JsonRpcProvider(HTTP_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      ).connect(provider);
      const erc20 = await new ERC20Token__factory(wallet).deploy(
        'Test token',
        'tst',
        18,
      );
      await erc20.deployed();
      const randomWallet = ethers.Wallet.createRandom();
      const mintTx = await erc20.mint(
        wallet.address,
        ethers.utils.parseEther('500'),
      );
      await mintTx.wait();
      const transferValue = ethers.utils.parseEther('10');
      const transferTx = await erc20.transfer(
        randomWallet.address,
        transferValue,
      );
      await transferTx.wait();
      const coinBalance = await erc20.balanceOf(randomWallet.address);
      expect(coinBalance.gte(transferValue)).toBeTruthy();
    });
  });

  describe('ws', function(){
    it('should check block number', async () => {
      const provider = new ethers.providers.WebSocketProvider(WS_JSON_RPC_PROVIDER);
      const blockNumber = await provider.getBlockNumber();
      expect(blockNumber).toBe(0);
    });

    it('genesis accounts should have funds', async () => {
      const provider = new ethers.providers.WebSocketProvider(WS_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      );
      const balance = await provider.getBalance(wallet.address);
      expect(balance.gt(ethers.constants.Zero)).toBeTruthy();
    });

    it('should be able to send funds', async () => {
      const provider = new ethers.providers.WebSocketProvider(WS_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      ).connect(provider);
      const randomWallet = ethers.Wallet.createRandom();
      const value = ethers.utils.parseEther('500');
      const tx = await wallet.sendTransaction({
        to: randomWallet.address,
        value: value,
      });
      await tx.wait();
      const balance = await provider.getBalance(randomWallet.address);
      expect(value.eq(balance)).toBeTruthy();
    });

    it('should deploy erc20 and send token', async () => {
      const provider = new ethers.providers.WebSocketProvider(WS_JSON_RPC_PROVIDER);
      const wallet = new ethers.Wallet(
        '0xa3dac6ca0b1c61f5f0a0b3a0acf93c9a52fd94e8e33d243d3b3a8b8c5dc37f0b',
      ).connect(provider);
      const erc20 = await new ERC20Token__factory(wallet).deploy(
        'Test token',
        'tst',
        18,
      );
      await erc20.deployed();
      const randomWallet = ethers.Wallet.createRandom();
      const mintTx = await erc20.mint(
        wallet.address,
        ethers.utils.parseEther('500'),
      );
      await mintTx.wait();
      const transferValue = ethers.utils.parseEther('10');
      const transferTx = await erc20.transfer(
        randomWallet.address,
        transferValue,
      );
      await transferTx.wait();
      const coinBalance = await erc20.balanceOf(randomWallet.address);
      expect(coinBalance.gte(transferValue)).toBeTruthy();
    });
});
});
