const BaseController = require('./baseController');

class BooksController extends BaseController {
	async getAllBooks() {
		return await this.axiosInstance.get('/BookStore/v1/Books');
	}

	async getBookByISBN(isbn) {
		return await this.axiosInstance.get(`/BookStore/v1/Book?ISBN=${isbn}`);
	}

	async addBook(userId, isbn, token) {
		return await this.axiosInstance.post(
			'/BookStore/v1/Books',
			{
				userId: userId,
				collectionOfIsbns: [
					{
						isbn: isbn,
					},
				],
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}

	async deleteAllBooks(userId, token) {
    return await this.axiosInstance.delete(`/BookStore/v1/Books?UserId=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

	async deleteBook(isbn, userId, token) {
		return await this.axiosInstance.delete('/BookStore/v1/Book', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				isbn: isbn,
				userId: userId,
			},
		});
	}
}

module.exports = new BooksController();
