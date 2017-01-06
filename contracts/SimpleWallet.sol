pragma solidity ^0.4.0;
contract SimpleWallet {

    address owner;

    struct WithdrawlStruct {
        address to;
        uint amount;
    }

    struct Senders {
        bool allowed;
        uint amount_sends;
        mapping(uint => WithdrawlStruct) withdrawls;
    }

    mapping(address => Senders) isAllowedToSendFundsMapping;


    event Deposit(address _sender, uint amount);
    event Withdrawl(address _sender, uint amount, address _beneficiary);

    function SimpleWallet() {
        owner = msg.sender;
    }

    function() payable{
        if(isAllowedToSend(msg.sender)) {
            Deposit(msg.sender, msg.value);
         } else {
            throw;
         }
    }

    function sendFunds(uint amount, address receiver) returns (uint) {
        if(isAllowedToSend(msg.sender)) {
          if(this.balance >= amount) {
            if(!receiver.send(amount)) {
              throw;
            }
            Withdrawl(msg.sender, amount, receiver);
            isAllowedToSendFundsMapping[msg.sender].amount_sends++;
            isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].to = receiver;
            isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].amount = amount;
            return this.balance;
          }
        }
      }

      function getAmountOfWithdrawls(address _address) constant returns (uint) {
        return isAllowedToSendFundsMapping[_address].amount_sends;
      }

      function getWithdrawlForAddress(address _address, uint index) constant returns (address, uint) {
        return (isAllowedToSendFundsMapping[_address].withdrawls[index].to, isAllowedToSendFundsMapping[_address].withdrawls[index].amount);
      }

      function allowAddressToSendMoney(address _address) {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address].allowed = true;
         }
      }

      function disallowAddressToSendMoney(address _address) {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address].allowed = false;
         }
      }

      function isAllowedToSend(address _address) constant returns (bool) {
        return isAllowedToSendFundsMapping[_address].allowed || _address == owner;
      }

      function killWallet() {
        if(msg.sender == owner) {
          suicide(owner);
        }
      }


}