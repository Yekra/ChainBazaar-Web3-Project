import { init, getBlocks, getProducts, buyProduct, createProduct, updateProduct, removeProduct } from './library/Web3Client.js';

let productList;
let lastProductCode = 0;

document.addEventListener("DOMContentLoaded", () => {
    setCartCount();
    refreshShoppingBasket();
});

export const btnConnectOnClick = async () => {
    await init()
        .then((accounts) => {
            console.log('Accounts:', accounts);
        })
        .catch((error) => {
            console.log('init error:', error);
        });

    loadProductsIndexPage();
};

export const btnPopulateProductsOnClick = async () => {
    await init()
        .then((accounts) => {
            console.log('Accounts:', accounts);
        })
        .catch((error) => {
            console.log('init error:', error);
        });

    loadProductsIndexPage();
};

const loadProductsIndexPage = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await getProducts()
                .then((products) => {
                    document.getElementById("btnConnect").style.display = 'none';
                    console.log('Products:', products);
                    productList = products;
                    let divProducts = document.getElementById("divProducts");
                    let divBaseProduct = document.getElementById("divBaseProduct");

                    divProducts.innerHTML = "";

                    products.reverse();
                    products.forEach(function (product) {
                        const divBaseProductClone = divBaseProduct.cloneNode(true);
                        divBaseProductClone.id = "";
                        divBaseProductClone.removeAttribute("hidden");
                        // console.log(product.productName);

                        let imgProduct = divBaseProductClone.getElementsByTagName("img")[0];
                        const imagePath = './images/products/Products/' + product.productCode + '.png';
                        imgProduct.src = imagePath;
                        // const isExistImage = imageExists(imagePath);
                        // if (isExistImage)
                        //     imgProduct.src = imagePath;
                        // else
                        //     imgProduct.src = './images/products/Products/no_image.png';


                        let aProductName = divBaseProductClone.getElementsByTagName("a")[1];
                        aProductName.innerHTML = product.productName;

                        let aProductPrice = divBaseProductClone.getElementsByTagName("p")[0];
                        aProductPrice.innerHTML = product.productPrice;

                        let btnBuy = divBaseProductClone.getElementsByTagName("button")[0];
                        btnBuy.dataset.code = product.productCode

                        divProducts.appendChild(divBaseProductClone);
                    });

                    const BuyProductButtonList = document.getElementsByClassName("btnBuyProduct");
                    for (const el of Array.from(BuyProductButtonList)) {
                        el.addEventListener("click", async (event) => {
                            let productCode = '';
                            const tagName = event.target.tagName;
                            if (tagName === 'svg')
                                productCode = event.target.parentElement.dataset.code;
                            else
                                productCode = event.target.dataset.code
                            console.log('Product Code:', productCode);

                            if (typeof productList !== 'undefined') {
                                let selectedProduct;
                                let price = 0.0000;
                                products.forEach(function (product) {
                                    if (productCode == product.productCode) {
                                        price = product.productPrice;
                                        selectedProduct = product;
                                    }
                                });
                                console.log('Product Price:', price);
                                console.log('Selected Product:', selectedProduct);

                                // let basketItems = JSON.parse(localStorage.getItem("basketItems", basketItems)) || [];
                                // console.log('Shopping Basket:', basketItems);



                                // localStorage.removeItem('shoppingBasket');
                                addProductToShoppingBasket(selectedProduct);
                                var shoppingBasket = getShoppingBasket();
                                console.log('Shopping Basket:', shoppingBasket);

                                // await buyProduct(price)
                                //     .then((message) => {
                                //         console.log('buyProduct() Result:', message);
                                //         alert(message);
                                //     })
                                //     .catch((error) => {
                                //         console.log('buyProduct() Error:', error);
                                //         alert('Code: ' + error.code + '\nMessage: ' + error.message);
                                //     });
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.log('getProduct error:', error);
                });

            resolve('Products has been loaded...');
        } catch (error) {
            reject('admin::loadProductsAdminPage() Error: ' + error);
        }
    });
};

const refreshShoppingBasket = () => {
    let divShoppingBasketItems = document.getElementById("divShoppingBasketItems");
    if (divShoppingBasketItems !== null) {
        // console.log(divShoppingBasketItems);
        divShoppingBasketItems.innerHTML = "";

        let divBaseBasketItem = document.getElementById("divBaseBasketItem");
        let shoppingBasket = getShoppingBasket();
        shoppingBasket.forEach(function (product) {
            const divBaseProductClone = divBaseBasketItem.cloneNode(true);
            divBaseProductClone.id = "";
            divBaseProductClone.removeAttribute("hidden");

            if (lastProductCode <= product.productCode)
                lastProductCode = product.productCode;
            // console.log('Last Product Code:', lastProductCode);

            let imgProduct = divBaseProductClone.getElementsByTagName("img")[0];
            const imagePath = './images/products/Products/' + product.productCode + '.png';
            imgProduct.src = imagePath;

            let aProductName = divBaseProductClone.getElementsByTagName("span")[0];
            aProductName.innerHTML = product.productName;

            let aProductPrice = divBaseProductClone.getElementsByTagName("span")[1];
            aProductPrice.innerHTML = product.productPrice;

            let btnRemoveProduct = divBaseProductClone.getElementsByTagName("button")[0];
            btnRemoveProduct.dataset.code = product.productCode
            btnRemoveProduct.dataset.version = product.dataVersion

            divShoppingBasketItems.appendChild(divBaseProductClone);
        });

        const RemoveProductButtonList = document.getElementsByClassName("btnRemoveProduct");
        for (const el of Array.from(RemoveProductButtonList)) {
            el.addEventListener("click", async (event) => {
                let productCode = '';
                let dataVersion = '';
                console.log(event.target);
                const tagName = event.target.tagName;
                if (tagName === 'svg' || tagName === 'SPAN') {
                    productCode = event.target.parentElement.dataset.code;
                    dataVersion = event.target.parentElement.dataset.version;
                } else {
                    productCode = event.target.dataset.code;
                    dataVersion = event.target.dataset.version;
                }
                // console.log('Product Code:', productCode);
                // console.log('Data Version:', dataVersion);

                // let selectedProduct;
                // let shoppingBasket = getShoppingBasket();
                // shoppingBasket.forEach(function (product) {
                //     if (product.productCode == productCode) {
                //         selectedProduct = product;
                //     }
                // });

                removeProductFromShoppingBasket(productCode);
            });
        }
    }
}

const addProductToShoppingBasket = (product) => {
    let shoppingBasket = getShoppingBasket();
    shoppingBasket.push(product);
    localStorage.setItem('shoppingBasket', JSON.stringify(shoppingBasket));
    setCartCount();
}
const removeProductFromShoppingBasket = (productCode) => {
    // console.log('Product Code:', productCode);
    let shoppingBasketNew = [];
    let shoppingBasket = getShoppingBasket();
    shoppingBasket.forEach(function (product) {
        if (product.productCode != productCode) {
            shoppingBasketNew.push(product);
        }
    });
    localStorage.setItem('shoppingBasket', JSON.stringify(shoppingBasketNew));
    setCartCount();
    refreshShoppingBasket();
}
const clearShoppingBasket = () => {
    const shoppingBasket = [];
    localStorage.setItem('shoppingBasket', JSON.stringify(shoppingBasket));
    setCartCount();
    refreshShoppingBasket();
}
const getShoppingBasket = () => {
    // setItem()    : Add key and value to localStorage
    // getItem()    : This is how you get items from localStorage
    // removeItem() : Remove an item by key from localStorage
    // clear()      : Clear all localStorage
    // key()        : Passed a number to retrieve the key of a localStorage

    return JSON.parse(localStorage.getItem('shoppingBasket')) || [];
}
const setCartCount = () => {
    let spanCart = document.getElementById("spanCart");
    const count = getShoppingBasket().length;
    spanCart.textContent = 'Cart (' + count.toString() + ')';
}

const imageExists = (image_url) => {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

const btnTestOnClick = () => {
    alert('btnTestOnClick');
};



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



export const btnLoadBlocksAdminPageOnClick = async () => {
    await init()
        .then((accounts) => {
            console.log('Accounts:', accounts);
        })
        .catch((error) => {
            console.log('init error:', error);
        });

    loadBlocksAdminPage();
};

export const btnLoadProductsAdminPageOnClick = async () => {
    await init()
        .then((accounts) => {
            console.log('Accounts:', accounts);
        })
        .catch((error) => {
            console.log('init error:', error);
        });

    loadProductsAdminPage();
};

export const btnAddProductAdminPageOnClick = async () => {
    await init()
        .then((accounts) => {
            console.log('Accounts:', accounts);
        })
        .catch((error) => {
            console.log('init error:', error);
        });

    await createProduct(lastProductCode)
        .then((accounts) => {
            console.log('Product:', accounts);
            loadProductsAdminPage();
        })
        .catch((error) => {
            console.log('btnAddProductAdminPageOnClick() error:', error);
        });
};

const loadBlocksAdminPage = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await getBlocks()
                .then((products) => {
                    console.log('Products:', products);
                    productList = products;
                    let divProducts = document.getElementById("divProducts");
                    let divBaseProduct = document.getElementById("divBaseProduct");

                    divProducts.innerHTML = "";

                    products.reverse();
                    products.forEach(function (product) {
                        const divBaseProductClone = divBaseProduct.cloneNode(true);
                        divBaseProductClone.id = "";
                        divBaseProductClone.removeAttribute("hidden");

                        if (lastProductCode <= product.productCode)
                            lastProductCode = product.productCode;

                        let imgProduct = divBaseProductClone.getElementsByTagName("img")[0];
                        const imagePath = './images/products/Products/' + product.productCode + '.png';
                        const isExistImage = imageExists(imagePath);
                        if (isExistImage)
                            imgProduct.src = imagePath;
                        else
                            imgProduct.src = './images/products/Products/no_image.png';;

                        let aProductName = divBaseProductClone.getElementsByTagName("span")[0];
                        aProductName.innerHTML = product.productName;

                        let aProductPrice = divBaseProductClone.getElementsByTagName("span")[1];
                        aProductPrice.innerHTML = product.productPrice;

                        let btnRemoveProduct = divBaseProductClone.getElementsByTagName("button")[0];
                        btnRemoveProduct.dataset.code = product.productCode
                        btnRemoveProduct.dataset.version = product.dataVersion
                        let btnEditProduct = divBaseProductClone.getElementsByTagName("button")[1];
                        btnEditProduct.dataset.code = product.productCode
                        btnEditProduct.dataset.version = product.dataVersion

                        divProducts.appendChild(divBaseProductClone);
                    });

                    const EditProductButtonList = document.getElementsByClassName("btnEditProduct");
                    for (const el of Array.from(EditProductButtonList)) {
                        el.disabled = true;
                        /*el.addEventListener("click", async (event) => {
                            let productCode = '';
                            let dataVersion = '';
                            const tagName = event.target.tagName;
                            if (tagName === 'svg' || tagName === 'SPAN') {
                                productCode = event.target.parentElement.dataset.code;
                                dataVersion = event.target.parentElement.dataset.version;
                            } else {
                                productCode = event.target.dataset.code;
                                dataVersion = event.target.dataset.version;
                            }
                            console.log('Product Code:', productCode);
                            console.log('Data Version:', dataVersion);

                            let selectedProduct;
                            products.forEach(function (product) {
                                if (product.productCode == productCode && product.dataVersion == dataVersion) {
                                    selectedProduct = product;
                                }
                            });

                            await updateProduct(selectedProduct)
                                .then((resultMessage) => {
                                    console.log(resultMessage);
                                    loadProductsAdminPage();
                                })
                                .catch((error) => {
                                    console.log('updateProduct error:', error);
                                });
                        });*/
                    }

                    const RemoveProductButtonList = document.getElementsByClassName("btnRemoveProduct");
                    for (const el of Array.from(RemoveProductButtonList)) {
                        el.disabled = true;
                        /*el.addEventListener("click", async (event) => {
                            let productCode = '';
                            let dataVersion = '';
                            const tagName = event.target.tagName;
                            if (tagName === 'svg' || tagName === 'SPAN') {
                                productCode = event.target.parentElement.dataset.code;
                                dataVersion = event.target.parentElement.dataset.version;
                            } else {
                                productCode = event.target.dataset.code;
                                dataVersion = event.target.dataset.version;
                            }
                            console.log('Product Code:', productCode);
                            console.log('Data Version:', dataVersion);

                            let selectedProduct;
                            products.forEach(function (product) {
                                if (product.productCode == productCode && product.dataVersion == dataVersion) {
                                    selectedProduct = product;
                                }
                            });


                            await removeProduct(selectedProduct)
                                .then((resultMessage) => {
                                    console.log(resultMessage);
                                    loadProductsAdminPage();
                                })
                                .catch((error) => {
                                    console.log('removeProduct error:', error);
                                });
                        });*/
                    }
                })
                .catch((error) => {
                    console.log('loadBlocksAdminPage() error:', error);
                });

            resolve('Blocks has been loaded...');
        } catch (error) {
            reject('admin::loadBlocksAdminPage() Error: ' + error);
        }
    });
};

const loadProductsAdminPage = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await getProducts()
                .then((products) => {
                    console.log('Products:', products);
                    productList = products;
                    let divProducts = document.getElementById("divProducts");
                    let divBaseProduct = document.getElementById("divBaseProduct");

                    divProducts.innerHTML = "";

                    products.reverse();
                    products.forEach(function (product) {
                        const divBaseProductClone = divBaseProduct.cloneNode(true);
                        divBaseProductClone.id = "";
                        divBaseProductClone.removeAttribute("hidden");
                        // divBaseProductClone.dataset.isproduct = "true";
                        // divBaseProductClone.classList.add("product-container");
                        // console.log(product.productName);

                        // lastProductCode
                        if (lastProductCode <= product.productCode)
                            lastProductCode = product.productCode;
                        console.log('Last Product Code:', lastProductCode);

                        let imgProduct = divBaseProductClone.getElementsByTagName("img")[0];
                        const imagePath = './images/products/Products/' + product.productCode + '.png';
                        const isExistImage = imageExists(imagePath);
                        if (isExistImage)
                            imgProduct.src = imagePath;
                        else
                            imgProduct.src = './images/products/Products/no_image.png';;

                        let aProductName = divBaseProductClone.getElementsByTagName("span")[0];
                        aProductName.innerHTML = product.productName;

                        let aProductPrice = divBaseProductClone.getElementsByTagName("span")[1];
                        aProductPrice.innerHTML = product.productPrice;

                        let btnRemoveProduct = divBaseProductClone.getElementsByTagName("button")[0];
                        btnRemoveProduct.dataset.code = product.productCode
                        btnRemoveProduct.dataset.version = product.dataVersion
                        let btnEditProduct = divBaseProductClone.getElementsByTagName("button")[1];
                        btnEditProduct.dataset.code = product.productCode
                        btnEditProduct.dataset.version = product.dataVersion

                        divProducts.appendChild(divBaseProductClone);
                    });

                    const EditProductButtonList = document.getElementsByClassName("btnEditProduct");
                    for (const el of Array.from(EditProductButtonList)) {
                        el.addEventListener("click", async (event) => {
                            let productCode = '';
                            let dataVersion = '';
                            const tagName = event.target.tagName;
                            if (tagName === 'svg' || tagName === 'SPAN') {
                                productCode = event.target.parentElement.dataset.code;
                                dataVersion = event.target.parentElement.dataset.version;
                            } else {
                                productCode = event.target.dataset.code;
                                dataVersion = event.target.dataset.version;
                            }
                            console.log('Product Code:', productCode);
                            console.log('Data Version:', dataVersion);

                            let selectedProduct;
                            products.forEach(function (product) {
                                if (product.productCode == productCode && product.dataVersion == dataVersion) {
                                    selectedProduct = product;
                                }
                            });

                            await updateProduct(selectedProduct)
                                .then((resultMessage) => {
                                    console.log(resultMessage);
                                    loadProductsAdminPage();
                                })
                                .catch((error) => {
                                    console.log('updateProduct error:', error);
                                });

                            // if (typeof productList !== 'undefined') {
                            //     let price = 0.0000;
                            //     products.forEach(function (product) {
                            //         if (productCode == product.productCode) {
                            //             price = product.productPrice;
                            //         }
                            //     });
                            //     await buyProduct(price)
                            //         .then((message) => {
                            //             console.log('buyProduct() Result:', message);
                            //             alert(message);
                            //         })
                            //         .catch((error) => {
                            //             console.log('buyProduct() Error:', error);
                            //             alert('Code: ' + error.code + '\nMessage: ' + error.message);
                            //         });
                            // }
                        });
                    }

                    const RemoveProductButtonList = document.getElementsByClassName("btnRemoveProduct");
                    for (const el of Array.from(RemoveProductButtonList)) {
                        el.addEventListener("click", async (event) => {
                            let productCode = '';
                            let dataVersion = '';
                            const tagName = event.target.tagName;
                            if (tagName === 'svg' || tagName === 'SPAN') {
                                productCode = event.target.parentElement.dataset.code;
                                dataVersion = event.target.parentElement.dataset.version;
                            } else {
                                productCode = event.target.dataset.code;
                                dataVersion = event.target.dataset.version;
                            }
                            console.log('Product Code:', productCode);
                            console.log('Data Version:', dataVersion);

                            let selectedProduct;
                            products.forEach(function (product) {
                                if (product.productCode == productCode && product.dataVersion == dataVersion) {
                                    selectedProduct = product;
                                }
                            });


                            await removeProduct(selectedProduct)
                                .then((resultMessage) => {
                                    console.log(resultMessage);
                                    loadProductsAdminPage();
                                })
                                .catch((error) => {
                                    console.log('removeProduct error:', error);
                                });

                            // if (typeof productList !== 'undefined') {
                            //     let price = 0.0000;
                            //     products.forEach(function (product) {
                            //         if (productCode == product.productCode) {
                            //             price = product.productPrice;
                            //         }
                            //     });
                            //     await buyProduct(price)
                            //         .then((message) => {
                            //             console.log('buyProduct() Result:', message);
                            //             alert(message);
                            //         })
                            //         .catch((error) => {
                            //             console.log('buyProduct() Error:', error);
                            //             alert('Code: ' + error.code + '\nMessage: ' + error.message);
                            //         });
                            // }
                        });
                    }
                })
                .catch((error) => {
                    console.log('getProducts() error:', error);
                });

            resolve('Products has been loaded...');
        } catch (error) {
            reject('admin::loadProductsAdminPage() Error: ' + error);
        }
    });
};



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



export const btnClearBasketCartPageOnClick = async () => {
    clearShoppingBasket();
};

export const btnCreateOrderCartPageOnClick = async () => {
    console.log('btnCreateOrderCartPageOnClick()');
};



window.btnClearBasketCartPageOnClick = btnClearBasketCartPageOnClick;
window.btnCreateOrderCartPageOnClick = btnCreateOrderCartPageOnClick;

window.btnLoadBlocksAdminPageOnClick = btnLoadBlocksAdminPageOnClick;
window.btnLoadProductsAdminPageOnClick = btnLoadProductsAdminPageOnClick;
window.btnAddProductAdminPageOnClick = btnAddProductAdminPageOnClick;

window.btnConnectOnClick = btnConnectOnClick;
window.btnPopulateProductsOnClick = btnPopulateProductsOnClick;
window.btnTestOnClick = btnTestOnClick;