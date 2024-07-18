import { serve } from 'bun';
import cors from 'cors';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Posts } from './entities/Posts.ts';



const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const corsMiddleware = cors(corsOptions);

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port:   5432,
    username: 'root',
    password: 'Adrian15',
    database: 'simple_api',
    synchronize: true,
    logging: true,
    entities: [Posts],
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
    id: number;
    title: string;
    content: string;
}

//let blogPosts: Post[] = [];

// Function to handle getting all posts \\

async function handleGetAllPosts() {
    console.log('Handling GET all posts');
        
    const blogPosts = await Posts.find();

    return new Response(JSON.stringify(blogPosts), {

       headers: { 'Content-Type': 'application/json' ,
                    'Access-Control-Allow-Methods': corsOptions.methods.join(','),
                    'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','),
                    'Access-Control-Allow-Origin': corsOptions.origin,
                    'Access-Control-Max-Age': '86400', // 24 hours
       },

   });
}

// Function to handle getting specific posts by their IDs\\

async function handleGetPostByID(id: string) {

    console.log(`Handling GET post by ID: ${id}`);

    const post = await Posts.findOneBy({ id: parseInt(id, 10) });
    if (!post) {
        return new Response("Post not found", { status: 404 });
    }

    // If no post if found return 404 \\
    if (!post) {
        return new Response("Post not found", { status: 404 });
    }
    // If a post is found return the post data \\
    return new Response(JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': corsOptions.methods.join(','),
                    'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','),
                    'Access-Control-Allow-Origin': corsOptions.origin,
                    'Access-Control-Max-Age': '86400', // 24 hours
         },
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
    const newPost = new Posts();
    newPost.title = title;
    newPost.content = content;


    const savedPost = await Posts.save(newPost);
    return new Response(JSON.stringify(savedPost), {
        headers: { 'Content-Type': 'application/json' ,
                    'Access-Control-Allow-Methods': corsOptions.methods.join(','),
                    'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','),
                    'Access-Control-Allow-Origin': corsOptions.origin,
                    'Access-Control-Max-Age': '86400', // 24 hours
        },
        status: 201,
    });
}

// Function to update 
async function handleUpdatePost(req: Request, id: string) {
    console.log(`Handling PATCH update post ID: ${id}`);

    const post = await Posts.findOneBy({ id: parseInt(id, 10) });
    if (!post) {
        return new Response("Post not found", { status: 404 });
    }

const { title, content } = await req.json();
    post.title = title;
    post.content = content;

    await Posts.save(post);

    return new Response("Post has been updated", { status: 200 });
}

async function handleDeletePost(id: string) {
    console.log(`Handling DELETE post ID: ${id}`);

    const post = await Posts.findOneBy({ id: parseInt(id, 10) });
    if (!post) {
        return new Response("Post not found", { status: 404 });
    }
 
    await Posts.remove(post);

    return new Response("Post has been deleted", { status: 200 });
}
const server = serve({
    port: PORT,
    fetch: async (req: Request) => {
        const { method } = req;
        const { pathname } = new URL(req.url);
        console.log(`Received request: ${method} ${pathname}`);
        const pathRegexForID = /^\/api\/posts\/(\d+)$/;

        if (method === 'OPTIONS') {
            // Respond with CORS headers
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Methods': corsOptions.methods.join(','),
                    'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','),
                    'Access-Control-Allow-Origin': corsOptions.origin,
                    'Access-Control-Max-Age': '86400', // 24 hours
                },
            });
        }

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
        return new Response(`Not Found`, { status: 404 }, );
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
