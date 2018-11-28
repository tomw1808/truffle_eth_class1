pragma solidity >=0.4.24 <0.6.0;
contract SimpleWallet {

    address payable owner;

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

    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function() payable external {
        require(isAllowedToSend(msg.sender));
        emit Deposit(msg.sender, msg.value);
    }

    function sendFunds(uint amount, address payable receiver) public {
        require(isAllowedToSend(msg.sender));
        require(address(this).balance >= amount);
        receiver.transfer(amount);
        emit Withdrawl(msg.sender, amount, receiver);
        isAllowedToSendFundsMapping[msg.sender].amount_sends++;
        isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].to = receiver;
        isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].amount = amount;
      }

      function getAmountOfWithdrawls(address _address) public view returns (uint) {
        return isAllowedToSendFundsMapping[_address].amount_sends;
      }

      function getWithdrawlForAddress(address _address, uint index) public view returns (address, uint) {
        return (isAllowedToSendFundsMapping[_address].withdrawls[index].to, isAllowedToSendFundsMapping[_address].withdrawls[index].amount);
      }

      function allowAddressToSendMoney(address _address) public onlyOwner {
          isAllowedToSendFundsMapping[_address].allowed = true;
      }

      function disallowAddressToSendMoney(address _address) public {
          isAllowedToSendFundsMapping[_address].allowed = false;
      }

      function isAllowedToSend(address _address) public view returns (bool) {
        return isAllowedToSendFundsMapping[_address].allowed || _address == owner;
      }

      function killWallet() public onlyOwner {
          selfdestruct(owner);
      }


}