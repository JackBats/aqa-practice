const axios = require('axios');

describe('JSONPlaceholder GET API Tests', () => {
	test('Get all users [GET /users] and verify status, length', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/users');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(10);
		expect(responseBody[0]).toHaveProperty('id', 1);
	});
	test('Get all posts [GET /posts] and verify status, length', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(100);
	});
	test(' Get first post [GET /posts/1] and verify status, id, userId, title', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveProperty('id', 1);
		expect(responseBody).toHaveProperty('userId', 1);
		expect(responseBody).toHaveProperty(
			'title',
			'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		);
	});
	test('Get all comments [GET /comments] and verify status, length', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(500);
	});
	test('Get all albums [GET /albums] and verify status, length', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/albums');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(100);
	});
	test('Get first album [GET /albums/1] and verify status, id, userId, title', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/albums/1');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveProperty('id', 1);
		expect(responseBody).toHaveProperty('userId', 1);
		expect(responseBody).toHaveProperty('title', 'quidem molestiae enim');
	});
	test('Get album by userId [GET /albums?userId=1] and verify status, length, userId', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/albums?userId=1');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		responseBody.forEach((comment) => {
			expect(comment.userId).toBe(1);
		});
	});

	test('Get all photos [GET /photos] and verify response', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/photos');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(5000);
	});
	test('Get all todos [GET /todos] and verify status, length', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(200);
	});
	test('Get first totdo [GET /todos/1] and verify status, id, userIdm title', async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveProperty('id', 1);
		expect(responseBody).toHaveProperty('userId', 1);
		expect(responseBody).toHaveProperty('title', 'delectus aut autem');
	});

	test("Get post's comment [GET /posts/1/comments] and verify status, length, postId", async () => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1/comments');
		const responseBody = response.data;
		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(5);
		responseBody.forEach((comment) => {
			expect(comment.postId).toBe(1);
		});
	});
});

describe('JSONPlaceholder POST API Tests', () => {
	test('Create a new post [POST /posts] and verify status, id, userId, title', async () => {
		const newPost = {
			title: 'Test Post Title 1',
			body: 'Hello World',
			userId: 1,
		};
		const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
		const responseBody = response.data;
		expect(response.status).toBe(201);
		expect(responseBody).toHaveProperty('id');
		expect(responseBody.title).toBe(newPost.title);
		expect(responseBody.body).toBe(newPost.body);
		expect(responseBody.userId).toBe(newPost.userId);
	});

	test('Create a new comment [POST /comments] and verify status, id, postId, name, email, body', async () => {
		const newComment = {
			postId: 4,
			name: 'Test Comment Name 1',
			email: 'test@mail.com',
			body: 'Hello World',
		};
		const response = await axios.post('https://jsonplaceholder.typicode.com/comments', newComment);
		const responseBody = response.data;
		expect(response.status).toBe(201);
		expect(responseBody).toHaveProperty('id');
		expect(responseBody.postId).toBe(newComment.postId);
		expect(responseBody.name).toBe(newComment.name);
		expect(responseBody.email).toBe(newComment.email);
		expect(responseBody.body).toBe(newComment.body);
	});

    test('Create a new album [POST /albums] and verify status, id, userId, title', async () => {
        const newAlbum = {
            userId: 1,
            title: 'Test Album Title 1',
        };
        const response = await axios.post('https://jsonplaceholder.typicode.com/albums', newAlbum);
        const responseBody = response.data;
        expect(response.status).toBe(201);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.userId).toBe(newAlbum.userId);
        expect(responseBody.title).toBe(newAlbum.title);
    });
    test('Create a new todo [POST /todos] and verify status, id, userId, title', async () => {
        const newTodo = {
            userId: 1,
            title: 'Test Todo Title 2',
            completed: false,
        };
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
        const responseBody = response.data;
        console.log(responseBody);
        
        expect(response.status).toBe(201);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.userId).toBe(newTodo.userId);
        expect(responseBody.title).toBe(newTodo.title);
        expect(responseBody.completed).toBe(newTodo.completed);
    });
});
