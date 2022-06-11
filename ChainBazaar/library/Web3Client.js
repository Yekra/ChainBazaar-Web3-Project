// import { output } from '../contracts/Transactions.json' assert { type: "json" };
import ContractJSON from '../contracts/Transactions.json' assert { type: "json" };
import OrderContractJSON from '../contracts/OrderContract.json' assert { type: "json" };
import ProductContractJSON from '../contracts/ProductContact.json' assert { type: "json" };

const transactionContractABI = ContractJSON.output.abi;
const transactionContractAddress = '0x1b6b484EadE5a6De0F47475C5bb6F6A0032902b6';

const productContractABI = ProductContractJSON.output.abi;
const productContractAddress = '0x5A9F96512bF1697891b256FA18c97Eb6EC79b544';

const orderContractABI = OrderContractJSON.output.abi;
const orderContractAddress = '0x426D13F154C40539e5Fd73bE9592d7CfEE3d0f22';



const msgMetaMaskIsNotInstalled = 'MetaMask is not installed! Please install MetaMask!';
let selectedAccount;
let accounts;
let web3Client;

export const uyari = () => {
    alert('Alert!');
}

const createEthereumContract = (contractAddress, contractABI) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(contractAddress, contractABI, signer);

    return Contract;
};

const createTransactionContractWithWeb3JS = () => {
    const web3 = new Web3(window.ethereum);
    const contractWeb3JS = new web3.eth.Contract(transactionContractABI, transactionContractAddress);
    return contractWeb3JS;
};

const createProductContractWithWeb3JS = () => {
    const web3 = new Web3(window.ethereum);
    const contractWeb3JS = new web3.eth.Contract(productContractABI, productContractAddress);
    // web3.eth.getBalance(selectedAccount, (call, wei) => {
    //     console.log('Wei:', wei);
    //     const Eth = web3.utils.fromWei(wei, 'ether');
    //     console.log('Eth:', Eth);
    // });
    // web3.eth.getAccounts().then(console.log);
    return contractWeb3JS;
};

export const createProduct = async (lastProductCode) => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];

                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const productContract = createEthereumContract(productContractAddress, productContractABI);
                // const parsedAmountElma = ethers.utils.parseEther("0.0001");
                // const lastProductCodeNew = lastProductCode + 1;
                // console.log('lastProductCode', lastProductCodeNew);
                // const productName = 'New Product ' + lastProductCodeNew.toString();
                // const transactionHashElma = await productContract.createProduct(lastProductCodeNew, productName, parsedAmountElma);
                // console.log(`Hash Elma - ${transactionHashElma.hash}`);
                // resolve(accounts);
                //////////////////////////////////////////////////////////////////////////////////////////////



                //////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const productCode = lastProductCode + 1;
                const productName = 'New Product ' + productCode.toString();
                const productPrice = Web3.utils.toWei('0.0001', 'ether');
                console.log('productCode:', productCode);
                console.log('productName:', productName);
                console.log('productPrice:', productPrice);
                const productContractWeb3JS = createProductContractWithWeb3JS();
                let transactionHash;
                productContractWeb3JS.methods.createProduct(productCode, productName, productPrice)
                    .send({ from: selectedAccount })
                    .on('transactionHash', function (hash) {
                        transactionHash = hash;
                        console.log('Web3Client::getBlocks() on transactionHash:', hash);
                    })
                    .on('receipt', function (receipt) {
                        console.log('Web3Client::getBlocks() on receipt:', receipt);
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        // console.log('Web3Client::getBlocks() on confirmation:', confirmationNumber, receipt);
                    })
                    .on('error', function (error, receipt) {
                        console.log('Web3Client::getBlocks() on error:', error);
                        reject('Web3Client::createProduct() Code:' + error.code.toString() + ' Message:' + error.message);
                    })
                    .then(function (newContractInstance) {
                        // instance with the new contract address
                        // console.log('Web3Client::getBlocks() on then:', newContractInstance.options.address);
                        console.log('Web3Client::getBlocks() on then');
                        resolve(transactionHash);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////

                // function createProduct(uint64 productCode, string memory productName, uint productPrice)
                // const parsedAmountBiber = ethers.utils.parseEther("0.0001");
                // const transactionHashBiber = await productContract.createProduct(1, "Biber", parsedAmountBiber);
                // console.log(`Hash Biber - ${transactionHashBiber.hash}`);

                // const parsedAmountDomates = ethers.utils.parseEther("0.0002");
                // const transactionHashDomates = await productContract.createProduct(2, "Domates", parsedAmountDomates);
                // console.log(`Hash Domates - ${transactionHashDomates.hash}`);

                // const parsedAmountMuz = ethers.utils.parseEther("0.0003");
                // const transactionHashMuz = await productContract.createProduct(3, "Muz", parsedAmountMuz);
                // console.log(`Hash Muz - ${transactionHashMuz.hash}`);

                // const parsedAmountUzum = ethers.utils.parseEther("0.0005");
                // const transactionHashUzum = await productContract.createProduct(5, "Üzüm", parsedAmountUzum);
                // console.log(`Hash Üzüm - ${transactionHashUzum.hash}`);

            } catch (error) {
                console.log('Web3Client::getBlocks() Exception:', error);
                reject('Web3Client::createProduct() Exception!');
            }
        }
    });
};

export const getBlocks = async () => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];

                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const productContract = createEthereumContract(productContractAddress, productContractABI);
                // const availableProducts = await productContract.getAllProducts();
                // console.log('availableProducts ethers:', availableProducts);
                // const structuredProducts = availableProducts.map((product) => ({
                //     productCode: parseInt(product.productCode),
                //     productName: product.productName,
                //     productPrice: parseInt(product.productPrice._hex) / (10 ** 18),
                //     isRemoved: product.isRemoved,
                //     dataVersion: parseInt(product.dataVersion),
                //     timeStamp: new Date(product.timeStamp.toNumber() * 1000).toLocaleString()
                // }));
                // resolve(structuredProducts);
                //////////////////////////////////////////////////////////////////////////////////////////////



                //////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const productContractWeb3JS = createProductContractWithWeb3JS();
                productContractWeb3JS.methods.getAllProducts()
                    .call()
                    .then(function (availableProducts) {
                        // console.log('availableProducts Web3JS:', availableProducts);
                        const structuredProducts = availableProducts.map((product) => ({
                            productCode: parseInt(product.productCode),
                            productName: product.productName,
                            productPrice: parseInt(product.productPrice) / (10 ** 18),
                            isRemoved: product.isRemoved,
                            dataVersion: parseInt(product.dataVersion),
                            timeStamp: new Date(parseInt(product.timeStamp) * 1000).toLocaleString()
                        }));
                        resolve(structuredProducts);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////

                // productContract.methods.getAllProducts().send({ from: selectedAccount })
                //     .on('transactionHash', function (hash) {
                //         console.log('Web3Client::getBlocks() on transactionHash:', hash);
                //     })
                //     .on('receipt', function (receipt) {
                //         console.log('Web3Client::getBlocks() on receipt:', receipt);
                //     })
                //     .on('confirmation', function (confirmationNumber, receipt) {
                //         console.log('Web3Client::getBlocks() on confirmation:', confirmationNumber, receipt);
                //     })
                //     .on('error', function (error, receipt) {
                //         console.log('Web3Client::getBlocks() on error:', error, receipt);
                //     })
                //     .then(function (newContractInstance) {
                //         console.log(newContractInstance.options.address) // instance with the new contract address
                //     });

                // structuredProducts.sort(
                //     function (a, b) {
                //         return a.timeStamp > b.timeStamp ? 1 : -1;
                //     });
            } catch (error) {
                reject('Web3Client::getBlocks() Error: ' + error);
            }
        }
    });
};


export const getProducts = async () => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];

                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const productContract = createEthereumContract(productContractAddress, productContractABI);
                // const availableProducts = await productContract.getAllProducts();
                // console.log('availableProducts ethers:', availableProducts);
                // const structuredProducts = availableProducts.map((product) => ({
                //     productCode: parseInt(product.productCode),
                //     productName: product.productName,
                //     productPrice: parseInt(product.productPrice._hex) / (10 ** 18),
                //     isRemoved: product.isRemoved,
                //     dataVersion: parseInt(product.dataVersion),
                //     timeStamp: new Date(product.timeStamp.toNumber() * 1000).toLocaleString()
                // }));
                // resolve(structuredProducts);
                //////////////////////////////////////////////////////////////////////////////////////////////



                //////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const productContractWeb3JS = createProductContractWithWeb3JS();
                await productContractWeb3JS.methods.getAllProducts()
                    .call()
                    // .on('error', function (error, receipt) {
                    //     console.log('Web3Client::getProducts() on error:', error);
                    //     reject('Web3Client::getProducts() Code:' + error.code.toString() + ' Message:' + error.message);
                    // })
                    .then(function (availableProducts) {
                        // console.log('availableProducts Web3JS:', availableProducts);
                        const structuredProducts = availableProducts.map((product) => ({
                            productCode: parseInt(product.productCode),
                            productName: product.productName,
                            productPrice: parseInt(product.productPrice) / (10 ** 18),
                            isRemoved: product.isRemoved,
                            dataVersion: parseInt(product.dataVersion),
                            timeStamp: new Date(parseInt(product.timeStamp) * 1000).toLocaleString()
                        }));
                        // structuredProducts.sort(
                        //     function (a, b) {
                        //         if (a.city === b.city) {
                        //             // Price is only important when cities are the same
                        //             return a.productCode - b.productCode;
                        //         }
                        //         return a.dataVersion > b.dataVersion ? 1 : -1;
                        //     });
                        structuredProducts.sort(
                            function (a, b) {
                                return a.timeStamp > b.timeStamp ? 1 : -1;
                            });

                        const groupedByProductCode = groupBy(structuredProducts, 'productCode');
                        // console.log('structuredProducts:', structuredProducts);
                        // console.log('groupedByProductCode:', groupedByProductCode);
                        let sortedProducts = [];
                        Object.entries(groupedByProductCode).map(item => {
                            let sortedProductsByDataVersion = item[1];
                            sortedProductsByDataVersion.sort(
                                function (a, b) {
                                    return a.dataVersion < b.dataVersion ? 1 : -1;
                                });
                            sortedProducts.push(sortedProductsByDataVersion[0]);
                        })
                        let nonRemovedProducts = [];
                        sortedProducts.forEach(function (product) {
                            // console.log(typeof (product.isRemoved));

                            if (!product.isRemoved)
                                nonRemovedProducts.push(product);
                        });

                        nonRemovedProducts.sort(
                            function (a, b) {
                                return a.timeStamp > b.timeStamp ? 1 : -1;
                            });

                        resolve(nonRemovedProducts);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////
            } catch (error) {
                reject('Web3Client::getProducts() Error: ' + error);
            }
        }
    });
};

export const updateProduct = async (selectedProduct) => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        console.log(selectedProduct)

        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];



                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const productContract = createEthereumContract(productContractAddress, productContractABI);
                // // function updateProduct(uint64 productCode, string memory productName, uint productPrice, uint dataVersion)
                // const newPrice = (selectedProduct.productPrice + 0.0001).toFixed(4);
                // const parsedAmountDomates = ethers.utils.parseEther(newPrice);
                // const newDataVersion = selectedProduct.dataVersion + 1
                // const productCode = selectedProduct.productCode;
                // const productName = selectedProduct.productName + ' ' + newDataVersion.toString();
                // console.log('productCode  :', productCode);
                // console.log('productName  :', productName);
                // console.log('productPrice :', parsedAmountDomates);
                // console.log('dataVersion :', newDataVersion);
                // const transactionHashDomates = await productContract.updateProduct(productCode, productName, parsedAmountDomates, false, newDataVersion);
                // resolve('Products has been updated...');
                //////////////////////////////////////////////////////////////////////////////////////////////


                /////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const newPrice = (selectedProduct.productPrice + 0.0001).toFixed(4);
                const parsedAmountDomates = Web3.utils.toWei(newPrice, 'ether');
                const newDataVersion = selectedProduct.dataVersion + 1

                const productCode = selectedProduct.productCode;
                let productName = selectedProduct.productName.replace(/[0-9]/g, '').trim();
                productName = productName.replace("(Edited)", "").trim();
                productName = productName + ' (Edited' + selectedProduct.dataVersion.toString() + ')';

                console.log('productCode  :', productCode);
                console.log('productName  :', productName);
                console.log('productPrice :', parsedAmountDomates);
                console.log('dataVersion :', newDataVersion);
                const productContractWeb3JS = createProductContractWithWeb3JS();
                let transactionHash;
                productContractWeb3JS.methods.updateProduct(productCode, productName, parsedAmountDomates, false, newDataVersion)
                    .send({ from: selectedAccount })
                    .on('transactionHash', function (hash) {
                        transactionHash = hash;
                        console.log('Web3Client::updateProduct() on transactionHash:', hash);
                    })
                    .on('receipt', function (receipt) {
                        console.log('Web3Client::updateProduct() on receipt:', receipt);
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        // console.log('Web3Client::updateProduct() on confirmation:', confirmationNumber, receipt);
                    })
                    .on('error', function (error, receipt) {
                        console.log('Web3Client::updateProduct() on error:', error);
                        reject('Web3Client::updateProduct() Code:' + error.code.toString() + ' Message:' + error.message);
                    })
                    .then(function (newContractInstance) {
                        console.log('Web3Client::updateProduct() on then');
                        resolve(transactionHash);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////
            } catch (error) {
                reject('Web3Client::updateProduct() Error: ' + error);
            }
        }
    });
};

export const removeProduct = async (selectedProduct) => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];


                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const productContract = createEthereumContract(productContractAddress, productContractABI);
                // // function updateProduct(uint64 productCode, string memory productName, uint productPrice, uint dataVersion)
                // const parsedAmount = ethers.utils.parseEther(selectedProduct.productPrice.toString());
                // const newDataVersion = selectedProduct.dataVersion + 1
                // const productCode = selectedProduct.productCode;
                // const productName = selectedProduct.productName;
                // console.log('productCode  :', productCode);
                // console.log('productName  :', productName);
                // console.log('productPrice :', parsedAmount);
                // console.log('dataVersion :', newDataVersion);
                // const transactionHash = await productContract.removeProduct(productCode, productName, parsedAmount, true, newDataVersion);
                // console.log(`New Hash for Removed Element - ${transactionHash.hash}`);
                // resolve('Products has been removed...');
                //////////////////////////////////////////////////////////////////////////////////////////////




                /////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const parsedAmount = Web3.utils.toWei(selectedProduct.productPrice.toString(), 'ether');
                const newDataVersion = selectedProduct.dataVersion + 1
                const productCode = selectedProduct.productCode;
                const productName = selectedProduct.productName;
                console.log('productCode  :', productCode);
                console.log('productName  :', productName);
                console.log('productPrice :', parsedAmount);
                console.log('dataVersion :', newDataVersion);

                const productContractWeb3JS = createProductContractWithWeb3JS();
                let transactionHash;
                productContractWeb3JS.methods.removeProduct(productCode, productName, parsedAmount, true, newDataVersion)
                    .send({ from: selectedAccount })
                    .on('transactionHash', function (hash) {
                        transactionHash = hash;
                        console.log('Web3Client::removeProduct() on transactionHash:', hash);
                    })
                    .on('receipt', function (receipt) {
                        console.log('Web3Client::removeProduct() on receipt:', receipt);
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        // console.log('Web3Client::removeProduct() on confirmation:', confirmationNumber, receipt);
                    })
                    .on('error', function (error, receipt) {
                        console.log('Web3Client::removeProduct() on error:', error);
                        reject('Web3Client::removeProduct() Code:' + error.code.toString() + ' Message:' + error.message);
                    })
                    .then(function (newContractInstance) {
                        console.log('Web3Client::removeProduct() on then');
                        resolve(transactionHash);
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////
            } catch (error) {
                reject('Web3Client::removeProduct() Error: ' + error);
            }
        }
    });
};


export const buyProduct = async (price) => {
    return new Promise(async (resolve, reject) => {
        if (typeof accounts === 'undefined') {
            await init()
                .then((accounts) => {
                    // console.log('Step-1', price);
                })
                .catch((error) => {
                    reject(error);
                });
        }
        // console.log('Step-2', price);
        if (typeof accounts !== 'undefined') {
            try {
                if (typeof selectedAccount === 'undefined')
                    selectedAccount = accounts[0];

                //////////////////////////////////////////////////////////////////////////////////////////////
                // ethers kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                // const contractABI = ContractJSON.output.abi;
                // const contractAddress = '0x1b6b484EadE5a6De0F47475C5bb6F6A0032902b6';
                // const providerTest = new ethers.providers.Web3Provider(window.ethereum);
                // const signer = providerTest.getSigner();
                // const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
                // const parsedAmount = ethers.utils.parseEther(price.toString());
                //////////////////////////////////////////////////////////////////////////////////////////////



                //////////////////////////////////////////////////////////////////////////////////////////////
                // web3js kütüphanesi ile ////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////
                const fromAddress = selectedAccount;
                const toAddress = '0x6EBC50D070EE307bcFf660A252c2dc3Aa5B8A11d';
                // const toAddress = '0xe661718f18B5cc50717E376FbBE7FeFC07693eA9';
                const priceAsWei = Web3.utils.toWei(price, 'ether');
                console.log('ETH as WEI:', priceAsWei);
                const transactionContractWeb3JS = createTransactionContractWithWeb3JS();
                let transactionHash;
                transactionContractWeb3JS.methods.addToBlockchain(toAddress, priceAsWei, "message", "keyword")
                    .send({ from: fromAddress })
                    .on('transactionHash', function (hash) {
                        transactionHash = hash;
                        console.log('Web3Client::buyProduct() on transactionHash:', hash);
                    })
                    .on('receipt', function (receipt) {
                        console.log('Web3Client::buyProduct() on receipt:', receipt);
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        // console.log('Web3Client::buyProduct() on confirmation:', confirmationNumber, receipt);
                    })
                    .on('error', function (error, receipt) {
                        console.log('Web3Client::buyProduct() on error:', error);
                        reject('Web3Client::buyProduct() Code:' + error.code.toString() + ' Message:' + error.message);
                    })
                    .then(function (newContractInstance) {
                        console.log('Web3Client::buyProduct() on then');
                        ethereum
                            .request({
                                method: 'eth_sendTransaction',
                                params: [
                                    {
                                        from: fromAddress,
                                        to: toAddress,
                                        value: parsedAmount._hex,
                                        gas: "0x5208",
                                    },
                                ],
                            })
                            .then((txHash) => {
                                console.log('eth_sendTransaction Hash:', txHash);
                                resolve('Transaction is successful...');
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////
            } catch (error) {
                reject('Web3Client::buyProduct() Error: ' + error);
            }
        }
    });
};

export const init = async () => {
    return new Promise(async (resolve, reject) => {
        if (!isMetaMaskInstalled())
            reject(msgMetaMaskIsNotInstalled);

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0];
            console.log(`Selected account changed to ${selectedAccount}.`);
        });
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("connect", (info) => {
            console.log(`Connected to network ${info}`);
        });
        window.ethereum.on("disconnect", (error) => {
            console.log(`Disconnected from network ${error}`);
        });

        try {
            accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            // console.log('Accounts:', accounts);
            web3Client = new Web3(window.ethereum);
            resolve(accounts);
        } catch (error) {
            // console.log(error);
            reject('Web3Client::init() Error: ' + error);
        }
    });
};

export const isMetaMaskInstalled = () => {
    let provider = window.ethereum;
    if (typeof provider === 'undefined') {
        // MetaMask is not installed!
        return false;
    }
    return true;
}


const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};

/*export const web3ileSmartContractKullanimi = async () => {
    const web3 = new Web3(provider);
    const networkID = await web3.eth.net.getId();
    // console.log(ContractJSON.output.abi);
    // 0x1b6b484EadE5a6De0F47475C5bb6F6A0032902b6
    const transactionContract = new web3.eth.Contract(
        ContractJSON.output.abi,
        '0x1b6b484EadE5a6De0F47475C5bb6F6A0032902b6'
    );

    const transactionsCount = transactionContract.getTransactionCount();

    console.log(transactionsCount);
    window.location.reload();
}*/

/*const getWeb3 = async () => {
    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(window.ethereum);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(web3);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};*/