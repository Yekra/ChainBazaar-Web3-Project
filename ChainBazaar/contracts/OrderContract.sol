// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

contract OrderContract {
    address payable public owner;
    uint256 public balance;
    uint256 public withdrawn;
    uint256 public totalWithdrawal = 0;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = payable(msg.sender); // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }

    function changeOwner(address payable newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    event Withdrawal(
        uint256 id,
        address indexed to,
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    function withdraw(uint256 amount) external returns (bool) {
        require(msg.sender == owner, "Unauthorized!");
        require(balance >= amount, "Insufficient balance");

        balance -= amount;
        withdrawn += amount;
        owner.transfer(amount);
        totalWithdrawal++;

        emit Withdrawal(
            totalWithdrawal,
            msg.sender,
            address(this),
            amount,
            block.timestamp
        );
        return true;
    }

    struct Item {
        uint64 productCode;
        uint256 productPrice;
        uint32 productCount;
    }

    struct Order {
        address customer;
        uint256 totalPrice;
        uint256 orderDate;
        uint32 status;
        bool isCanceled;
        uint32 dataVersion;
        uint32[] itemKeyList; // list of item keys so we can look them up
        mapping(uint32 => Item) itemList; // random access by order key and item key
    }
    struct OrderShadow {
        address customer;
        uint256 totalPrice;
        uint256 orderDate;
        uint32 status;
        bool isCanceled;
        uint32 dataVersion;
    }

    mapping(uint32 => Order) orderList; // random access by order key
    uint32[] orderKeyList; // list of order keys so we can enumerate them

    event CreateBlockOrder(uint32 orderKey, uint256 totalPrice, uint256 orderDate, uint32 status, bool isCanceled, uint32 dataVersion);

    event CreateBlockItem(uint32 itemKey, uint64 productCode, uint256 productPrice, uint32 productCount);

    function addOrder(uint32 orderKey, uint256 totalPrice, uint256 orderDate, uint32 status, bool isCanceled, uint32 dataVersion) public returns (bool success) {
        balance += totalPrice;
        orderList[orderKey].customer = msg.sender;
        orderList[orderKey].totalPrice = totalPrice;
        orderList[orderKey].orderDate = orderDate;
        orderList[orderKey].status = status;
        orderList[orderKey].isCanceled = isCanceled;
        orderList[orderKey].dataVersion = dataVersion;
        orderKeyList.push(orderKey);

        emit CreateBlockOrder(
            orderKey,
            totalPrice,
            orderDate,
            status,
            false,
            1
        );

        return true;
    }

    function getOrder(uint32 orderKey) public view returns (address customer, uint256 totalPrice, uint256 orderDate, uint32 status, bool isCanceled, uint32 dataVersion)
    {
        return (
            orderList[orderKey].customer,
            orderList[orderKey].totalPrice,
            orderList[orderKey].orderDate,
            orderList[orderKey].status,
            orderList[orderKey].isCanceled,
            orderList[orderKey].dataVersion
        );
    }

    function getOrdersBySender() public view returns (OrderShadow[] memory filteredOrders)
    {
        OrderShadow[] memory orderShadowList = new OrderShadow[](orderKeyList.length);
        uint256 count;
        for (uint256 i = 0; i < orderKeyList.length; i++) {
            uint32 orderKey = orderKeyList[i];
            if (orderList[orderKey].customer == msg.sender) {
                orderShadowList[count].customer = orderList[orderKey].customer;
                orderShadowList[count].totalPrice = orderList[orderKey].totalPrice;
                orderShadowList[count].orderDate = orderList[orderKey].orderDate;
                orderShadowList[count].status = orderList[orderKey].status;
                orderShadowList[count].isCanceled = orderList[orderKey].isCanceled;
                orderShadowList[count].dataVersion = orderList[orderKey].dataVersion;
                count += 1;
            }
        }

        filteredOrders = new OrderShadow[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredOrders[i] = orderShadowList[i];
        }
        return filteredOrders;
    }

    function addItem(
        uint32 orderKey,
        uint32 itemKey,
        uint64 productCode,
        uint256 productPrice,
        uint32 productCount
    ) public returns (bool success) {
        orderList[orderKey].itemKeyList.push(itemKey);
        orderList[orderKey].itemList[itemKey].productCode = productCode;
        orderList[orderKey].itemList[itemKey].productPrice = productPrice;
        orderList[orderKey].itemList[itemKey].productCount = productCount;

        emit CreateBlockItem(itemKey, productCode, productPrice, productCount);
        return true;
    }

    function getItem(uint32 orderKey, uint32 itemKey)
        public
        view
        returns (
            uint64 productCode,
            uint256 productPrice,
            uint32 productCount
        )
    {
        return (
            orderList[orderKey].itemList[itemKey].productCode,
            orderList[orderKey].itemList[itemKey].productPrice,
            orderList[orderKey].itemList[itemKey].productCount
        );
    }

    function getOrderCount() public view returns (uint256 orderCount) {
        return orderKeyList.length;
    }

    function getOrderAtIndex(uint256 row)
        public
        view
        returns (uint32 orderkey)
    {
        return orderKeyList[row];
    }

    function getItemCount(uint32 orderKey)
        public
        view
        returns (uint256 itemCount)
    {
        return (orderList[orderKey].itemKeyList.length);
    }

    function getItemAtIndex(uint32 orderKey, uint256 itemRow)
        public
        view
        returns (uint32 itemKey)
    {
        return (orderList[orderKey].itemKeyList[itemRow]);
    }

    /*uint[] myMappingInStruct;
    function getMappingValue() public view returns (uint[] memory) {
        uint[] memory memoryArray = new uint[](orderKeyList.length);
        for(uint i = 0; i < orderKeyList.length; i++) {
            memoryArray[i] = myMappingInStruct[i];
        }
        return memoryArray;
    }*/
}