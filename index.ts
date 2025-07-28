 
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import cors from 'cors';
import express, { Request, Response } from 'express';
 
 
const getServer = () => {
  //  MCP server
  const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0'
  }, { capabilities: { logging: {} } });
 
 
  // const apiEndPoint = "http://localhost:9100/secure/";
 
 
 
 
 
  // Register the get_project_list tool with schema
  server.registerTool(
    'get_project_list',
    {
      title: 'Fetch Project Data',
      description: 'Fetch project list from API',
      inputSchema: {
        companyId: z.number().optional().default(1),
        gridType: z.boolean().optional().default(false),
        lastFetchDate: z.number().optional().default(0),
        startsWith: z.string().optional(),
        limit: z.number().optional().default(5)
      }
    },
    async ({ companyId, gridType, lastFetchDate, startsWith, limit }) => {
      // call your actual fetchProjectData here
      const data = await fetchProjectData({ companyId, gridType, lastFetchDate });
      // filter and format...
      return {
        content: [{
          type: 'text',
          text: `Found ${data?.list.length ?? 0} projects. Showing first ${Math.min(limit, data?.list.length ?? 0)}`
        }]
      };
    }
  );
 
  async function fetchProjectData(requestBody: {
    companyId?: number;
    gridType: boolean;
    lastFetchDate?: number;
  }): Promise<any | null> {
    try {
      const cleanRequestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, v]) => v !== undefined)
      );
 
      const response = await fetch(apiEndPoint + "project/list", {
        method: "POST",
        headers: {
          "Authorization": accessToken,
          "realm": "qnopycommon",
          "Content-Type": "application/json",
          "siteId": "0"
        },
        body: JSON.stringify(cleanRequestBody)
      });
 
      if (!response.ok) {
        console.error("API Error:", response.statusText);
        return null;
      }
 
      return await response.json();
    } catch (error: any) {
      console.error("Fetch failed:", error.message);
      return null;
    }
  }
  return server;
}
 
const app = express();
app.use(express.json());
 
// Configure CORS to expose Mcp-Session-Id header for browser-based clients
app.use(cors({
  origin: '*', // Allow all origins - adjust as needed for production
  exposedHeaders: ['Mcp-Session-Id']
}));
 
 
app.post('/mcp', async (req: Request, res: Response) => {
 
  try {
 
    const server = getServer();
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
 
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});
 
app.get('/get/mcp', async (req: Request, res: Response) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});
 
app.delete('/mcp', async (req: Request, res: Response) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});
 
 
// Start the server
const PORT = 3100;
app.listen(PORT, (error: any) => {
  if (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
 
// Handle server shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});
 
 
