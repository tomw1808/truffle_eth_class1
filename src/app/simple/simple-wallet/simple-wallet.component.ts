import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const metacoin_artifacts = require('../../../../build/contracts/SimpleWallet.json');

@Component({
  selector: 'app-meta-sender',
  templateUrl: './simple-wallet.component.html',
  styleUrls: ['./simple-wallet.component.css']
})
export class SimpleWalletComponent implements OnInit {
  accounts: string[];
  SimpleWallet: any;

  model = {
    depositAmount: 0,
    sendToAmount: 0,
    sendToAddress: '',
    amount: 5,
    receiver: '',
    whitelistAddress: '',
    blacklistAddress: '',
    balance: 0,
    balanceOfWallet: 0,
    account: '',
    accountAllowed: 'not'
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(metacoin_artifacts)
      .then((SimpleWalletAbstraction) => {
        this.SimpleWallet = SimpleWalletAbstraction;
        this.SimpleWallet.deployed().then(deployed => {
          console.log(deployed);
          deployed.Deposit({}, (err, ev) => {
            console.log('Deposit event came in, refreshing balance');
            this.refreshBalance();
          });
          deployed.Withdrawl({}, (err, ev) => {
            console.log('Withdrawl event came in, refreshing balance');
            this.refreshBalance();
          });

          
        });

      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
      this.SimpleWallet.deployed().then(async i => {
        const isAllowed = await i.isAllowedToSend(this.model.account);
        if(isAllowed) {
          this.model.accountAllowed = '';
        } else {
          this.model.accountAllowed = 'not';
        }
      })
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async depositEther() {
    if (!this.SimpleWallet) {
      this.setStatus('SimpleWallet is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.depositAmount;
    const sender = this.model.account;

    console.log('Sending Ether' + amount + ' from ' + sender);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleWallet = await this.SimpleWallet.deployed();
      const transaction = await deployedSimpleWallet.sendTransaction({from: this.model.account, value: this.SimpleWallet.web3.toWei(amount, "Ether")});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async addAllowedAddress() {
    if (!this.SimpleWallet) {
      this.setStatus('SimpleWallet is not loaded, unable to send transaction');
      return;
    }

   
    const whitelistAddress = this.model.whitelistAddress;

    console.log('Whitelisting address:' + whitelistAddress);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleWallet = await this.SimpleWallet.deployed();
      const transaction = await deployedSimpleWallet.allowAddressToSendMoney(whitelistAddress, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async removeAllowedAddress() {
    if (!this.SimpleWallet) {
      this.setStatus('SimpleWallet is not loaded, unable to send transaction');
      return;
    }

   
    const blacklistAddress = this.model.blacklistAddress;

    console.log('Blacklisting address:' + blacklistAddress);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleWallet = await this.SimpleWallet.deployed();
      const transaction = await deployedSimpleWallet.disallowAddressToSendMoney(blacklistAddress, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async sendFromWallet() {
    if (!this.SimpleWallet) {
      this.setStatus('SimpleWallet is not loaded, unable to send transaction');
      return;
    }

   
    const sendTo = this.model.sendToAddress;
    const sendAmount = this.model.sendToAmount;

    console.log('Sending ' + sendAmount + ' to address:' + sendTo);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleWallet = await this.SimpleWallet.deployed();
      const web3 = await this.web3Service.getWeb3();
      console.log('That is in Wei: '+web3.utils.toWei(sendAmount,'Ether'));
      const transaction = await deployedSimpleWallet.sendFunds(web3.utils.toWei(sendAmount,'Ether'), sendTo, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedSimpleWallet = await this.SimpleWallet.deployed();
      console.log(deployedSimpleWallet);
      console.log('Account', this.model.account);
      const simpleWalletBalance = await this.web3Service.getWeb3().then(web3 => {return web3.eth.getBalance(deployedSimpleWallet.address)});
      console.log('Found balance (Wei): ' + simpleWalletBalance);
      this.model.balanceOfWallet = this.SimpleWallet.web3.fromWei(simpleWalletBalance, "Ether");
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setDepositAmount(e) {
    console.log('Setting deposit amount: ' + e.target.value);
    this.model.depositAmount = e.target.value;
  }

  setWhitelistAddress(e) {
    console.log('Setting whitelist address: ' + e.target.value);
    this.model.whitelistAddress = e.target.value;
  }

  setBlacklistAddress(e) {
    console.log('Setting blacklist address: ' + e.target.value);
    this.model.blacklistAddress = e.target.value;
  }

  setSendToAmount(e) {
    console.log('Setting amount to send: ' + e.target.value);
    this.model.sendToAmount = e.target.value;
  }

  setSendToAddress(e) {
    console.log('Setting address to send: ' + e.target.value);
    this.model.sendToAddress = e.target.value;
  }

}
