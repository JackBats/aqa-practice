const BaseController = require('./baseController');

class AccountController extends BaseController {
    async accountInfo(userId, token) {
        return await this.axiosInstance.get(`/Account/v1/User/${userId}`, {
       	headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	async createAccount(userName, password) {
		return await this.axiosInstance.post('/Account/v1/User', {
			userName: userName,
			password: password,
		});
	}

	async generateToken(userName, password) {
		const response = await this.axiosInstance.post('/Account/v1/GenerateToken', {
			userName: userName,
			password: password,
		});
		return response;
	}

	async userLogin(userName, password) {
		const response = await this.axiosInstance.post('/Account/v1/Login', {
			userName: userName,
			password: password,
		});
		return response;
	}

	async deleteAccount(userId, token) {
		return await this.axiosInstance.delete(`/Account/v1/User/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
}
module.exports = new AccountController();
