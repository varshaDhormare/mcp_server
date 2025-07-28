 
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
 
 
  const accessToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjNkp2dndka2FZbDFuRG8yUFNuQXFBWkRFUTZBMVE5WkIzY2NCTnhtc2NnIn0.eyJleHAiOjE3ODM4NDkxMTUsImlhdCI6MTc1Mjc0NTExNSwiYXV0aF90aW1lIjoxNzUyNzM0NjY0LCJqdGkiOiI0YWY1NzM2YS00MmM0LTQ0NTItYWE4Ni0zNjdlNDc0OTY3MTgiLCJpc3MiOiJodHRwczovL3N0YWdpbmcucW5vcHkuY29tL3NlY3VyaXR5L3JlYWxtcy9xbm9weWNvbW1vbiIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzYzkyMjRhOC0xNGU4LTQ5MDMtOGMwMS1mZTUzNjdhMWJlYTMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJxbm9weS13ZWIiLCJub25jZSI6IlQxTlpZelZNU0RKU1lXOXJkVEk0VUU5c09ISmtja1ppU1VVd1VERlRNMDFPVlZoclJ6RTBUMFk0ZDBReiIsInNlc3Npb25fc3RhdGUiOiJlMTg5OTM5MS03ZGViLTQwMmQtYmM5NS0xMWUyMzNkYjk0N2UiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzEyNy4wLjAuMTo0MjAwIiwiaHR0cHM6Ly9kZXYub3JkZXJwZW5ndWluLmNvbSIsIioiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtcW5vcHljb21tb24iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MgZW1haWwgcHJvZmlsZSIsInNpZCI6ImUxODk5MzkxLTdkZWItNDAyZC1iYzk1LTExZTIzM2RiOTQ3ZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiRGhhbnVzaCBSYW5rYSIsInByZWZlcnJlZF91c2VybmFtZSI6ImRoYW51c2giLCJnaXZlbl9uYW1lIjoiRGhhbnVzaCIsImZhbWlseV9uYW1lIjoiUmFua2EiLCJlbWFpbCI6ImRoYW51c2gucmFua2FAcW5vcHkuY29tIn0.PHHh0bLSIgjzvDugCmHP8VPCgL9z-48vQAa9Ataz1frvWy-KFQi5gvWaxWC-89dInmIdem07IP9ov4SY_P0U_QFllqWrvXaOQnV3_tg3sQIR9r2gBmz9pfSPBjlBqDlW1IIALGf2d7-e3qlZH99Xc9IpzYhQ3NpCvZPejkIIkP1sIDlZ2bHGeV4CtXNuFG_bIdk2f4U8KPnb93bqJ9QqWuEZIHQ7-rmDD3CL-hXa2VwNZoPeexd0Ckd_xQoo8PE-sOpHxlj08S8ftSwuX8qLWdoT56WpaCDLBuXcu3Ik9bLwd6lGqbEpDzgnMUFi9s8ReTvhWVP_wQB4vtT-CFla1A";
  // const apiEndPoint = "http://localhost:9100/secure/";
 
  const apiEndPoint = "https://staging.qnopy.com/serviceweb6/secure/";
 
 
 
 
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
 
 
