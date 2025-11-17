class homePage{

    constructor(page)
    {
        this.page = page;
    }

async addToCart(product){
    await this.page.click(`#add-to-cart-${product}`)
}

async removeFromCart(product){
    await this.page.click(`#remove-${product}`)
}

async viewProduct(imageName){
    await this.page.click(`img[data-test=inventory-item-sauce-labs-${imageName}]`)
}

}

module.exports = homePage;