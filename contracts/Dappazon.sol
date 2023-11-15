// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    // string public name;
    address public owner;

//define struct here. created the struct in the list function
    struct Item{
        uint256 id;
        string name;
        string catagory;
        string img;
        uint256 cost;
        uint rating;
        uint256 stock;
    }

mapping(uint256 => Item) public items;//map (index--> Item) in the list
//ekta product er description map kora hocche ekta index number assign kore

//struct for ordering
    struct Order{
        uint256 time; // time of order
        Item item;  //creating an item for order of Item type
    }

    mapping(address => uint256) public orderCount;
    //mapping the orderer adress to the number of quantity ordered

    mapping(address=> mapping(uint256 => Order)) public orders;
    //orderer address--> quantity of order--> to the item that is ordered.
    //ekta order object(ekta product er description) map kora hocche definite address er jonne definite quantity te

    
    event List(string name, uint256 cost, uint256 quantity);
    
    event Buy(address buyer, uint256 orderId, uint itemId);

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can enlist an item");
        _;
    }

    constructor(){
        // name = "Dappazon";
        owner = msg.sender;
    }

    //list products

    function list(uint256 _id, string memory _name, 
    string memory _catagory, string memory _img,
    uint256 _cost, uint256 _rating, uint256 _stock) public onlyOwner {
    //defined as struct 'Item' before. created the struct here

            //create item sruct
        Item memory item = Item(_id, _name, 
                                _catagory, _img, 
                                _cost, _rating, _stock);

     //savin the struct by maping
     items[_id] = item;

     //Emit event
    emit List (_name, _cost, _stock);
}

    //buy products
    function buy(uint256 _id) public payable{
        //receive ether

        //Fetch item
        Item memory item = items[_id];//reverse of saving. giving id fetching item struct

        //create an order
        Order memory order = Order(block.timestamp, item);
        
        //save the order in the chain
        orderCount[msg.sender]++; //increment the ordered quantity for the address
        //ei owner er address diye ordered quantity joto chilo seta 1 increment korbe    

        //check enough ether sent
        require(msg.value>= item.cost*orderCount[msg.sender], "Send enough ether");
        //check if there is enough stock
        require(item.stock >= orderCount[msg.sender]);

        //then place order
        orders[msg.sender][orderCount[msg.sender]] = order;
        //orders er address e --> 2 line ager ei amount e --> 3 line ager je order ta create kora holo seta
        //place kora holo

        //subtract item's stock
        items[_id].stock = item.stock -orderCount[msg.sender];


        //emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }


    //withdraw funds 
    function withdraw() public onlyOwner{
        (bool success, ) = owner.call{value: address(this).balance}(" ");
        //transfering the contracts balance to the owner when owner calls this function
        require(success,"Trancfer failed");
    }
}

//Contract Address:0x13ee28A59c856206eFABa943D8F91F985E745472