class cartPage{

    constructor(page)
    {
        this.page = page;
    }

    async clickOn(locator){
        await this.page.click(`.${locator}`)
    }

    async fillCheckoutInfo(firstName, lastName, zipCode){
        await this.page.fill("#first-name", firstName);
        await this.page.fill("#last-name", lastName);
        await this.page.fill("#postal-code", zipCode);
        await this.page.click("#continue");
    }


    async calculateCheckoutValues(products) {
        let total = 0.00;
        let taxRate = 1.08002667;

        for (let product of products) {
            total += parseFloat(product);
        }

        let tax = (total * taxRate) - total;
        let totalWithTax = total + tax;

        let finalValues = [];
        finalValues.push(total.toFixed(2), tax.toFixed(2), totalWithTax.toFixed(2));

        return finalValues;
    }

}

module.exports = cartPage;