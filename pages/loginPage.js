class loginPage{

    constructor(page)
    {
        this.page = page;
    }

    async login(user, pass){
        await this.page.fill("#user-name", user);
        await this.page.fill("#password", pass);
        await this.page.click("#login-button");
    }

}

module.exports = loginPage;