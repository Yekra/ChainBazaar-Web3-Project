// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ProductContract {
    uint256 totalBlockCount;
    uint256 totalProductCount;
    ProductStruct[] products;

    event CreateBlock(uint64 productCode, string productName, uint productPrice, bool isRemoved, uint dataVersion, uint256 timeStamp);
  
    struct ProductStruct {
        uint64 productCode;
        string productName;
        uint productPrice;
        bool isRemoved;
        uint dataVersion;
        uint256 timeStamp;
    }

    function createProduct(uint64 productCode, string memory productName, uint productPrice) public {
        totalBlockCount += 1;
        totalProductCount += 1;
        products.push(ProductStruct(productCode, productName, productPrice, false, 1, block.timestamp));

        emit CreateBlock(productCode, productName, productPrice, false, 1, block.timestamp);
    }

    // dataVersion şimdilik dışarıdan alınıyor.
    // Ancak veri güvenliği için sonrasında ürün koduna göre otomatik bulunup, 1 artıralabilir.
    function updateProduct(uint64 productCode, string memory productName, uint productPrice, bool isRemoved, uint dataVersion) public {
        totalBlockCount += 1;
        products.push(ProductStruct(productCode, productName, productPrice, isRemoved, dataVersion, block.timestamp));

        emit CreateBlock(productCode, productName, productPrice, isRemoved, dataVersion, block.timestamp);
    }

    function removeProduct(uint64 productCode, string memory productName, uint productPrice, bool isRemoved, uint dataVersion) public {
        totalProductCount -= 1;
        products.push(ProductStruct(productCode, productName, productPrice, isRemoved, dataVersion, block.timestamp));

        emit CreateBlock(productCode, productName, productPrice, isRemoved, dataVersion, block.timestamp);
    }

    function getAllBlocks() public view returns (ProductStruct[] memory) {
        return products;
    }

    function getAllProducts() public view returns (ProductStruct[] memory) {
        return products;
    }

    function getTotalBlockCount() public view returns (uint256) {
        return totalBlockCount;
    }

    function getTotalProductCount() public view returns (uint256) {
        return totalProductCount;
    }
}