const axios = require('axios');
const BooksController = require('../api-controllers/BooksController');
const AccountController = require('../api-controllers/AccountController');

let userId;
let bookIsbn;
let token;
let randomUserName;
const user = {
	//userName: `test-user${Date.now().toString().slice(5, 10)}`,
	password: 'Test1230!)',
};

describe('Account tests', () => {
	beforeAll(async () => {
		randomUserName = `test-user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
		createdUser = await AccountController.createAccount(randomUserName, user.password);
		expect(createdUser.status).toBe(201);
	});
	test('Create account [POST /Account/v1/User] and verify status, userId, userName', async () => {
		const randomName = `test-user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
		const createdUser = await AccountController.createAccount(randomName, user.password);
		const responseBody = createdUser.data;

		expect(createdUser.status).toBe(201);
		expect(responseBody.userID).toBeDefined();
		expect(responseBody.username).toBe(randomName);
	});

	test('Generate token [POST /Account/v1/GenerateToken] and verify status, token, message', async () => {
		const responseToken = await AccountController.generateToken(randomUserName, user.password);
		const responseBody = responseToken.data;

		expect(responseToken.status).toBe(200);
		expect(responseBody.token).toBeDefined();
		expect(responseBody.status).toBe('Success');
		expect(responseBody.result).toBe('User authorized successfully.');
	});

	test('Login [POST /Account/v1/Login] and verify status, userId', async () => {
		const loggedUserResponse = await AccountController.userLogin(randomUserName, user.password);
		const responseBody = loggedUserResponse.data;

		expect(loggedUserResponse.status).toBe(200);
		expect(responseBody.userId).toBeDefined();
		expect(responseBody.username).toBe(randomUserName);
	});

	test('Delete account [DELETE /Account/v1/User/{userId}] and verify status', async () => {
		const randomUserName = `test-user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
		const createdUser = await AccountController.createAccount(randomUserName, user.password);
		const userId = createdUser.data.userID;

		const responseToken = await AccountController.generateToken(randomUserName, user.password);
		const token = responseToken.data.token;

		const response = await AccountController.deleteAccount(userId, token);
		expect(response.status).toBe(204);

		const responseToken2 = await AccountController.generateToken(randomUserName, user.password);
		const responseTokenBody = responseToken2.data;

		expect(responseTokenBody.token).toBe(null);
		expect(responseTokenBody.result).toBe('User authorization failed.');
		expect(responseTokenBody.status).toBe('Failed');
	});
	afterAll(async () => {
		const tokenResponse = await AccountController.generateToken(randomUserName, user.password);
		const token = tokenResponse.data.token;

		const userData = await AccountController.userLogin(randomUserName, user.password);
		const userId = userData.data.userId;

		const response = await AccountController.deleteAccount(userId, token);
		expect(response.status).toBe(204);
	});
});

describe('Books tests', () => {
	beforeAll(async () => {
		let randomBookIndex = Math.floor(Math.random() * 8);
		randomUserName = `test-user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

		const responseRegisterUser = await AccountController.createAccount(randomUserName, user.password);
		const tokenResponse = await AccountController.generateToken(randomUserName, user.password);
		token = tokenResponse.data.token;

		const loginResponse = await AccountController.userLogin(randomUserName, user.password);
		userId = loginResponse.data.userId;

		const responseRegisterUserBody = responseRegisterUser.data;
		expect(responseRegisterUserBody.username).toBeDefined();

		const booksResponse = await BooksController.getAllBooks();
		const booksResponseData = booksResponse.data;
		bookIsbn = booksResponseData.books[randomBookIndex].isbn;
      
	});

	test('Get all books [GET /BookStore/v1/Books] and verify status, length, first book title', async () => {
		const response = await BooksController.getAllBooks();
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody.books).toHaveLength(8);
		expect(responseBody.books[0].title).toBe('Git Pocket Guide');
	});

	test('Add a book [POST /BookStore/v1/Books] and verify status, isbn', async () => {
		const response = await BooksController.addBook(userId, bookIsbn, token);
		const responseBody = response.data;
		expect(response.status).toBe(201);
		expect(responseBody.books[0].isbn).toBe(bookIsbn);

        await BooksController.deleteAllBooks(userId, token);
	});

    test('Delete all added books [DELETE /BookStore/v1/Books?UserId=${userId}] and verify', async () => {
        await BooksController.addBook(userId, bookIsbn, token);
        
        const accountInfoBeforeDelete = await AccountController.accountInfo(userId, token);
        const accountResponseBeforeDelete = accountInfoBeforeDelete.data;
        expect(accountResponseBeforeDelete.books[0].isbn).toBe(bookIsbn)

        const response = await BooksController.deleteAllBooks(userId, token);
		//const responseBody = response.data; 
        expect(response.status).toBe(204);

        const accountInfoAfterDelete = await AccountController.accountInfo(userId, token);
        const accountResponseAfterDelete = accountInfoAfterDelete.data;
        expect(accountResponseAfterDelete.books).toEqual([])
    })

    test('Get book [GET /BookStore/v1/Book?=${isbn}] and verify status, content', async () => {
        const bookResponse = await BooksController.getBookByISBN(bookIsbn);
        const responseBody = bookResponse.data;
        expect(bookResponse.status).toBe(200);
        expect(responseBody.isbn).toBe(bookIsbn);
        expect(responseBody.title).toBeDefined();
    })

    test('Delete book [DELETE /BookStore/v1/Book]', async () => {
        await BooksController.addBook(userId, bookIsbn, token);

        const accountInfoBeforeDelete = await AccountController.accountInfo(userId, token);
        const accountResponseBeforeDelete = accountInfoBeforeDelete.data;
        expect(accountResponseBeforeDelete.books[0].isbn).toBe(bookIsbn)

        const deleteResponse = await BooksController.deleteBook(bookIsbn, userId, token);
        const responseBody = deleteResponse.data;
        expect(deleteResponse.status).toBe(204);

        const accountInfoAfterDelete = await AccountController.accountInfo(userId, token);
        const accountResponseAfterDelete = accountInfoAfterDelete.data;
        expect(accountResponseAfterDelete.books).toEqual([])

    })

	afterAll(async () => {
	    const deleteBooksResponse = await BooksController.deleteAllBooks(userId, token);
	    expect(deleteBooksResponse.status).toBe(204);

		const deleteAccountResponse = await AccountController.deleteAccount(userId, token);
		expect(deleteAccountResponse.status).toBe(204);
	})
});



