type Path = '/API'
type Method = 'GET' | 'PUT' | 'DELETE'
type ApiEndpoint = `${Method} ${Path}`

const server = Bun.serve({
    port: 3000,
    hostname: "testhost.com", 
    fetch(req) {
        try {
            const url = new URL(req.url)
            const method = req.method
        
            const apiEndpoint: ApiEndpoint = `${method as Method} ${url.pathname as Path}`
        
            switch(apiEndpoint) {
                case 'PUT /API':
                    return new Response(
                        JSON.stringify({ message: `You called ${apiEndpoint} ` }),
                        { headers: { 'Content-Type': 'application/json' }, status: 200 }
                    )
                case 'GET /API': 
                    return new Response(
                        JSON.stringify({ message: `You called ${apiEndpoint} ` }),
                        { headers: { 'Content-Type': 'application/json' }, status: 200 }
                    )
                case 'DELETE /API': 
                    return new Response(
                        JSON.stringify({ message: `You called ${apiEndpoint} ` }),
                        { headers: { 'Content-Type': 'application/json' }, status: 200 }
                    )
                default:
                    return new Response(
                        JSON.stringify({ message: `You called ${apiEndpoint}, Cannot handle!` }),
                        { headers: { 'Content-Type': 'application/json' }, status: 404 }
                    )
            }
        } catch(err) {
            console.log(err)
            return new Response(JSON.stringify({ message: 'Internal Server Error' }), { headers: { 'Content-Type': 'application/json' }, status: 500})
        }
        
    }
    
  });
  console.log(`Server running on ${server.hostname}`)
