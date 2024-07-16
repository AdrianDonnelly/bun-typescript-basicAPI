import { serve } from 'bun';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
//import { Posts } from './entities/Posts.ts';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Adrian15',
    database: 'simple_api',
    synchronize: true,
    logging: false,
    //entities: [Posts],
  });

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const PORT = 3000;

interface Post {
    id: string;
    title: string;
    content: string;
}

let blogPosts: Post[] = [];

// Function to handle getting all posts \\

function handleGetAllPosts() {
    console.log('Handling GET all posts');
    return new Response(JSON.stringify(blogPosts), {
        headers: { 'Content-Type': 'application/json' },
    });
}

// Function to handle getting specific posts by their IDs\\

function handleGetPostByID(id: string) {
    console.log(`Handling GET post by ID: ${id}`);
    const post = blogPosts.find((post) => post.id === id);

    // If no post if found return 404 \\
    if (!post) {
        return new Response("Post not found", { status: 404 });
    }
    // If a post is found return the post data \\
    return new Response(JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json' },
    });
}

// Function to handle creating a post \\
async function handleCreatePost(req: Request) {
    console.log('Handling POST create new post');

    // Parse json post data into postData \\
    let postData;
    try {
        postData = await req.json();
    } catch (error) {
        return new Response("Invalid JSON input", { status: 400 });
    }

    // Check if post data has title and content in the correct format \\
    const { title, content } = postData;
    if (!title || !content) {
        return new Response("Title and content are required", { status: 400 });
    }

    // If everything is correct create a new post with the id as a sequential number \\
    const newPost: Post = {
        id: `${blogPosts.length}`,
        title,
        content
    };
    blogPosts.push(newPost);
    return new Response(JSON.stringify(newPost), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
    });
}

// Function to update 
async function handleUpdatePost(req: Request, id: string) {
    console.log(`Handling PATCH update post ID: ${id}`);
    const postIndex = blogPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        return new Response("Post not found", { status: 404 });
    }

    const { title, content } = await req.json();
    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title,
        content,
    };

    return new Response("Post has been updated", { status: 200 });
}

function handleDeletePost(id: string) {
    console.log(`Handling DELETE post ID: ${id}`);
    const postIndex = blogPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        return new Response("Post not found", { status: 404 });
    }

    blogPosts.splice(postIndex, 1);

    return new Response("Post has been deleted", { status: 200 });
}

serve({
    port: PORT,
    fetch: async (req: Request) => {
        const { method } = req;
        const { pathname } = new URL(req.url);
        console.log(`Received request: ${method} ${pathname}`);
        const pathRegexForID = /^\/api\/posts\/(\d+)$/;

        if (method === 'GET') {
            const match = pathname.match(pathRegexForID);
            const id = match && match[1];

            if (id) {
                return handleGetPostByID(id);
            }

            if (pathname === '/api/posts') {
                return handleGetAllPosts();
            }
        }

        if (method === 'POST' && pathname === '/api/posts') {
            return await handleCreatePost(req);
        }

        if (method === 'PATCH') {
            const match = pathname.match(pathRegexForID);
            const id = match && match[1];

            if (id) {
                return await handleUpdatePost(req, id);
            }
        }

        if (method === 'DELETE') {
            const match = pathname.match(pathRegexForID);
            const id = match && match[1];

            if (id) {
                return handleDeletePost(id);
            }
        }
        console.log('No matching route found');
        return new Response(`Not Found`, { status: 404 });
    },
    websocket: {
        message: (ws, message) => {
            console.log(`Received message: ${message}`);
        },
        open: (ws) => {
            console.log(`WebSocket connection opened`);
        },
        close: (ws) => {
            console.log(`WebSocket connection closed`);
        },
    },
});

console.log(`Listening on port http://localhost:${PORT}`);
