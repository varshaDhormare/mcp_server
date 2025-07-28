import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { any, z, ZodError } from "zod";
// import fetch from "node-fetch";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});


const accessToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjNkp2dndka2FZbDFuRG8yUFNuQXFBWkRFUTZBMVE5WkIzY2NCTnhtc2NnIn0.eyJleHAiOjE3ODE0NDIwMTgsImlhdCI6MTc1MDMzODAxOCwiYXV0aF90aW1lIjoxNzUwMzMzMjc0LCJqdGkiOiIwYTc4MzQ3OC04NWIzLTQwYTMtOTlkZS05M2I3N2NjNjkxZDMiLCJpc3MiOiJodHRwczovL3N0YWdpbmcucW5vcHkuY29tL3NlY3VyaXR5L3JlYWxtcy9xbm9weWNvbW1vbiIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzYzkyMjRhOC0xNGU4LTQ5MDMtOGMwMS1mZTUzNjdhMWJlYTMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJxbm9weS13ZWIiLCJub25jZSI6ImNIRnZjbXBYWDNkb1ZqQTVUbmt5Y21waE5IZFNSRzVzWTNSclVWOWFVVE54U1ZsNGNESm9OM1JuTGt4VyIsInNlc3Npb25fc3RhdGUiOiIxMDEzZWYyZC1iNzI1LTQ0ZmQtYTY5Mi1hNDI1YTUwZjZlYzkiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzEyNy4wLjAuMTo0MjAwIiwiaHR0cHM6Ly9kZXYub3JkZXJwZW5ndWluLmNvbSIsIioiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtcW5vcHljb21tb24iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MgZW1haWwgcHJvZmlsZSIsInNpZCI6IjEwMTNlZjJkLWI3MjUtNDRmZC1hNjkyLWE0MjVhNTBmNmVjOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiRGhhbnVzaCBSYW5rYSIsInByZWZlcnJlZF91c2VybmFtZSI6ImRoYW51c2giLCJnaXZlbl9uYW1lIjoiRGhhbnVzaCIsImZhbWlseV9uYW1lIjoiUmFua2EiLCJlbWFpbCI6ImRoYW51c2gucmFua2FAcW5vcHkuY29tIn0.iLF_GILaxOWtLgK_EPxFI1rdLvjmmITRl3tuQEa2v9JUfIvbx7bYCnjaEK6v5T8VNwJ-QOyq8oA15CxFb1ds_ANyS3uHzbS_4FuBM_1nFEoewWhtuDQM1_ms2D8_0r75woSa3ibjk4PD_WBUS646ez48b3oStJU4N0Rjdgm_GQh0r2SDHFYdfc8uE_y6oOO4Tn088TIPRxz4XupYmspKwi-YwE3UMd2jl7sJDtzVG-p_dlEgP1XGiXO5LuAfnQGk59ftIVP64AzZY6GbJITIiM9YHgqdPpQe1NehRDilVeLZB44NtbHWRcXFK54k9UOPy5AF3DIjn7INjnOtzDprxA";
// const apiEndPoint = "http://localhost:9100/secure/";

const apiEndPoint ="https://staging.qnopy.com/serviceweb6/secure/";

//*************************************************** FETCH PROJECT START ************************************************************* */


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
        "Content-Type": "application/json"
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


server.registerTool(
  "get_project_list",
  {
    title: "Fetch Project Data",
    description: "Fetch and filter project data from Spring Boot API",
    inputSchema: {
      companyId: z.number().optional().default(1),
      gridType: z.boolean().optional().default(false),
      lastFetchDate: z.number().optional().default(0),
      startsWith: z.string().optional(),
      limit: z.number().optional().default(5)
    }
  },
  async ({ companyId, gridType, lastFetchDate, startsWith, limit }) => {
    const data = await fetchProjectData({ companyId, gridType, lastFetchDate });

    if (!data || !Array.isArray(data.list)) {
      return {
        content: [{ type: "text", text: "Failed to fetch project data or invalid response." }]
      };
    }

    // Filter by project name
    let filtered = data.list;
    if (startsWith) {
      const prefix = startsWith.toLowerCase();
      filtered = filtered.filter((item: any) =>
        item.project?.toLowerCase().startsWith(prefix)
      );
    }

    const count = Math.min(limit ?? 5, filtered.length);

    // Only show selected fields
    const previewItems = filtered.slice(0, count).map((p: any) => ({
      projectNumber: p.projectNumber,
      project: p.project,
      createdBy: p.createdBy,
      siteId: p.siteId
    }));

    return {
      content: [{
        type: "text",
        text:
          `Found ${filtered.length} project(s).\n\n` +
          `Showing first ${count}:\n` +
          JSON.stringify(previewItems, null, 2)
      }]
    };
  }
);

//*************************************************** FETCH PROJECT END ************************************************************* */



//****************************************************************************************************************************** */


server.registerTool(
  "create_project",
  {
    title: "Create Project & Assign Matching Forms",
    description: "Creates a project and assigns forms with similar names",
    inputSchema: {
      companyId: z.number().optional(),
      projectName: z.string(),
      projectNumber: z.string()
    }
  },
  async ({ companyId, projectName, projectNumber }) => {
    const finalCompanyId = companyId ?? 1;
    const payload = {
      companyId: finalCompanyId,
      project: projectName,
      siteName: projectName,
      projectNumber,
      siteNumber: projectNumber,
      status: 1,
      siteId: 0,
      confidential: false
    };

    try {
      // Step 1: Create project
      const createRes = await saveProject(payload);

      if (!createRes || createRes.success !== true) {
        const duplicateFlags = createRes?.data || {};
        const knownDuplicates: string[] = [];

        if (duplicateFlags["SITENUMBERDUBLICATE"]) {
          knownDuplicates.push("Project Number already exists");
        }

        if (duplicateFlags["PROJECTDUBLICATE"]) {
          knownDuplicates.push("Project Name already exists");
        }

        const errorSummary = knownDuplicates.length > 0
          ? `Cannot create project:\n\n${knownDuplicates.join("\n")}`
          : `Failed to create project.`;

        return {
          content: [{
            type: "text",
            text: `${errorSummary}\n\n Name: ${projectName}\n Number: ${projectNumber}`
          }]
        };
      }

      const siteId = createRes.data?.site_id?.toString();

      return {
        content: [{
          type: "text",
          text: `Project created successfully!\nSite ID: ${siteId}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Unexpected error: ${String(error)}`
        }]
      };
    }
  }
);


async function saveProject(payload: any): Promise<any | null> {
  try {
    const response = await fetch(apiEndPoint + "project/save", {
      method: "POST",
      headers: {
        "Authorization": accessToken,
        "realm": "qnopycommon",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
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








//******************************************************************************************************************************* */



//******************************************** GET FORM LIST START *********************************************************************************** */

server.registerTool(
  "get_form_list",
  {
    title: "Get Form List",
    description: "Fetches and filters forms for the given company ID",
    inputSchema: {
      companyId: z.number().optional().default(1),
      keywords: z.array(z.string()).optional()
    }
  },
  async ({ companyId, keywords }) => {
    const finalCompanyId = companyId ?? 1;

    try {
      const formsRes = await getAllFormList({
        companyId: finalCompanyId,
        formTag: 0,
        date: 0
      });

      const allForms = formsRes?.list || [];

      if (allForms.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No forms found for company ID ${finalCompanyId}.`
            }
          ]
        };
      }

      // 🔍 Filter by keyword if provided
      const filteredForms = keywords?.length
        ? allForms.filter((form: any) =>
          keywords.some((kw: string) =>
            form.name?.toLowerCase().includes(kw.toLowerCase())
          )
        )
        : allForms;

      if (filteredForms.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No forms matched the provided keywords for company ID ${finalCompanyId}.`
            }
          ],
          data: {
            forms: []
          }
        };
      }

      // 📋 Display preview of matching forms
      const previewLimit = 10;
      const formPreview = filteredForms.slice(0, previewLimit)
        .map((f: any, i: number) => `#${i + 1}: ${f.name} (ID: ${f.mobileAppId})`)
        .join("\n");

      const extraText = filteredForms.length > previewLimit
        ? `\n\n...and ${filteredForms.length - previewLimit} more matching forms.`
        : "";

      return {
        content: [
          {
            type: "text",
            text:
              `Found ${filteredForms.length} form(s) for company ID ${finalCompanyId}:\n\n` +
              `${formPreview}${extraText}\n\nUse 'mobileAppId' from the data for further operations like assigning to a project.`
          }
        ],
        data: {
          forms: filteredForms
        }
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch forms: ${String(err)}`
          }
        ]
      };
    }
  }
);





async function getAllFormList(payload: any): Promise<any | null> {
  try {
    const { companyId = 1, formTag = 0, date = 0 } = payload;
    const url = `${apiEndPoint}project/list/mobile/form?date=${date}&companyId=${companyId}&formTag=${formTag}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": accessToken,
        "realm": "qnopycommon",
        "Content-Type": "application/json"
      }
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

//****************************************** GET FORM LIST END ************************************************************************************ */




//************************************   ASSIGN FORM TO PROJECT START ************************************************************************************ */

server.registerTool(
  "assign_forms_to_project",
  {
    title: "Assign Forms to Project",
    description: "Assigns selected forms to the given project site",
    inputSchema: {
      siteId: z.string(),
      mobileAppId: z.array(z.number()),
      companyIds: z.array(z.number())
    }
  },
  async ({ siteId, mobileAppId, companyIds }) => {
    try {
      const payload = {
        siteId,
        data: mobileAppId,
        companyId: companyIds
      };

      const assignRes = await assignFormsToProject(payload);

      if (assignRes?.success) {
        return {
          content: [{
            type: "text",
            text: `Successfully assigned ${mobileAppId.length} form(s) to project site ${siteId}.`
          }],
          data: assignRes
        };
      } else {
        return {
          content: [{
            type: "text",
            text: `Failed to assign forms to site ${siteId}.`
          }]
        };
      }
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `Unexpected error: ${String(error)}`
        }]
      };
    }
  }
);


async function assignFormsToProject(payload: {
  siteId: string;
  data: number[];
  companyId: number[]
}): Promise<any | null> {
  try {
    const response = await fetch(apiEndPoint + "project/save/mobile/form", {
      method: "POST",
      headers: {
        "Authorization": accessToken,
        "realm": "qnopycommon",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("API Error:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error("Assign failed:", error.message);
    return null;
  }
}


//************************************** ASSIGN FORM TO PROJECT END ************************************************************************* */



//***************************************GET LIST OF EVENTS START ********************************************************************************* */

server.registerTool("list_of_event", {
  title: "List Events by Site and Form ID",
  description: "Fetch events for the given site and form (mobileAppId), optionally filtered by a keyword",
  inputSchema: {
    companyId: z.number().optional(),
    siteId: z.union([z.string(), z.number()]),
    mobileAppId: z.union([z.string(), z.number()]),
    search: z.string().optional()
  }
}, async ({ companyId, siteId, mobileAppId, search }) => {
  const finalCompanyId = companyId ?? 1;

  // 1. Fetch all events for the site
  const eventsRes = await getEventList({
    finalCompanyId,
    siteId: Number(siteId)
  });

  const allEvents = eventsRes?.list || [];

  // 2. Filter by form (mobileAppId)
  let matchedEvents = allEvents.filter((e: any) =>
    Number(e.mobileAppId) == Number(mobileAppId)
  );

  // 3. If a search query is provided, filter further
  if (search) {
    const lowerSearch = search.toLowerCase();
    matchedEvents = matchedEvents.filter((e: any) =>
      e.eventDisplayName?.toLowerCase().includes(lowerSearch)
    );
  }

  if (matchedEvents.length === 0) {
    return {
      content: [{
        type: "text",
        text: `No events found for Site ID ${siteId}, Form ID ${mobileAppId}${search ? ` with search '${search}'` : ''}.`
      }]
    };
  }

  // 4. Limit the preview
  const displayLimit = 10;
  const previewEvents = matchedEvents.slice(0, displayLimit);
  const truncatedCount = matchedEvents.length - previewEvents.length;

  const eventList = previewEvents.map((e: any, i: number) =>
    `#${i + 1}: ${e.eventDisplayName}`
  ).join("\n");

  const truncatedNotice = truncatedCount > 0
    ? `\n\n...and ${truncatedCount} more event(s) not shown here.`
    : "";

  return {
    content: [{
      type: "text",
      text:
        `Events found:\nSite ID: ${siteId}\nForm ID: ${mobileAppId}` +
        `${search ? `\nSearch: "${search}"` : ''}` +
        `\nTotal: ${matchedEvents.length}\n\n${eventList}${truncatedNotice}`
    }],
    data: {
      siteId,
      mobileAppId,
      total: matchedEvents.length,
      preview: previewEvents,
      search,
      events: matchedEvents
    }
  };
});



async function getEventList(payload: { finalCompanyId: number, siteId: number }): Promise<any | null> {
  try {
    const response = await fetch(apiEndPoint + "event/list", {
      method: "POST",
      headers: {
        "Authorization": accessToken,
        "realm": "qnopycommon",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        companyId: payload.finalCompanyId,
        siteId: payload.siteId
      })
    });

    if (!response.ok) {
      console.error("API Error:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Event fetch failed", err);
    return null;
  }
}





// http://localhost:9100/secure/project/list/mobile/site/assign/form?date=0&siteId=15678&companyId=1

//***************************************** GET LIST OF EVENTS END ********************************************************************** */


//***************************************** GET LIST OF FORM FOR PARTICULAR SITE START ************************* */



server.registerTool(
  "get_form_list_for_site",
  {
    title: "Get Form List for a Site",
    description: "Fetch all assigned mobile forms for a given site ID and optionally filter by form name.",
    inputSchema: {
      siteId: z.union([z.number(), z.string()], {
        required_error: "siteId is required",
      }),
      companyId: z.number().optional().default(1),
      date: z.number().optional().default(0),
      searchTerm: z.string().optional().describe("Search term to filter form names"),
      limit: z.number().optional().default(20).describe("Maximum number of results to show"),
    },
  },
  async ({ siteId, companyId = 1, date = 0, searchTerm = "", limit = 20 }) => {
    const formList = await getAllFormListOfProject({
      siteId: Number(siteId),
      companyId,
      date,
    });

    if (!formList || formList.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No forms found for this site.",
          },
        ],
      };
    }

    // Search filtering
    const filteredForms = formList.filter((form: any) =>
      form.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredForms.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No forms matched your search term "${searchTerm}".`,
          },
        ],
      };
    }

    // Limit output
    const limitedForms = filteredForms.slice(0, limit);

    const formatted = limitedForms
      .map((form: any, index: number) => `${index + 1}. ${form.name} (ID: ${form.mobileAppId})`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text:
            `Showing ${limitedForms.length} of ${filteredForms.length} matched forms:\n\n` + formatted,
        },
      ],
      data: limitedForms,
    };
  }
);



interface GetFormListPayload {
  companyId?: number;
  siteId?: number;
  date?: number;
}

async function getAllFormListOfProject(payload: GetFormListPayload): Promise<any[] | null> {
  try {
    const { companyId = 1, siteId = 0, date = 0 } = payload;

    const url = `${apiEndPoint}project/list/mobile/site/assign/form?date=${date}&companyId=${companyId}&siteId=${siteId}`;

    if (!accessToken) {
      console.error("Missing access token");
      return null;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": accessToken,
        "realm": "qnopycommon",
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
      return null;
    }

    const jsonData: any = await response.json();

    // ✅ Return just the list property (assumes jsonData.list exists and is an array)
    return jsonData?.list ?? null;

  } catch (error: any) {
    console.error("Fetch failed:", error?.message || error);
    return null;
  }
}


//*************************************** GET LIST OF FORM FOR PARTICULAR SITE END ******************************** */



//****************************************  CREATE DYNAMIC FORM START ************************************************************************* */


const NonOptionFieldTypes = z.enum([
  "TEXTCONTAINER",
  "NUMERIC",
  "DATE",
  "TIME",
  "SINGLECHECK",
  "BARCODE",
  "PHOTOS",
  "SIGNATURE",
  "QRCODE",
  "Counter",
  "TOTALIZER",
  "RATING",
  "GPS",
  "DRAW",
  "TASK",
  "HEADER"
]);

const OptionFieldTypes = z.enum(["CHIPS", "RADIO", "PICKER", "CHECKBOX"]);

// Base schema
const BaseFieldSchema = z.object({
  fieldName: z.string().min(1),
  defaultValue: z.string().optional()
});

// Union schema for fields
const FieldSchema = z.union([
  BaseFieldSchema.extend({
    fieldType: NonOptionFieldTypes
  }),
  BaseFieldSchema.extend({
    fieldType: OptionFieldTypes,
    options: z.array(z.string().min(1)).min(1, "At least one option is required")
  })
]);

// Tool registration
server.registerTool(
  "create_dynamic_form",
  {
    title: "Create Dynamic Form",
    description: "Build a form with tabs and fields and send to backend",
    inputSchema: {
      formName: z.string().min(1, "Form name is required").max(500, "Form name too long"),
      companyId: z.number().optional(),
      tabs: z.array(
        z.object({
          tabName: z.string().min(1),
          fields: z.array(FieldSchema)
        })
      )
    }


  },

  async (input, ctx) => {
    try {
      // Duplicate check
      const tabNameSet = new Set();
      const fieldNameSet = new Set();

      for (const tab of input.tabs) {
        if (tabNameSet.has(tab.tabName)) {
          return {
            content: [{
              type: "text",
              text: `❌ Duplicate tab name: "${tab.tabName}"`
            }]
          };
        }
        tabNameSet.add(tab.tabName);

        for (const field of tab.fields) {
          const key = `${tab.tabName}::${field.fieldName}`;
          if (fieldNameSet.has(key)) {
            return {
              content: [{
                type: "text",
                text: `❌ Duplicate field name "${field.fieldName}" in tab "${tab.tabName}"`
              }]
            };
          }
          fieldNameSet.add(key);
        }
      }

      // Build form sections
      const sections = input.tabs.map((tab, index) => {
        const fields = [
          {
            fieldId: -1,
            name: "Date",
            fieldParameterId: 25,
            fieldType: "DATE",
            write: true,
            rowOrder: 5,
            defaultValue: new Date().toISOString().split("T")[0],
            guide: "",
            deleteFlag: false,
            mobileAppId: -1
          },
          {
            fieldId: -2,
            name: "Time",
            fieldParameterId: 15,
            fieldType: "TIME",
            write: true,
            rowOrder: 10,
            defaultValue: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
            guide: "",
            deleteFlag: false,
            mobileAppId: -1
          },
          ...tab.fields.map((field, i) => {
            const baseField = {
              fieldId: -100 - i,
              fieldParameterId: -200 - i,
              fieldType: field.fieldType,
              name: field.fieldName,
              write: true,
              rowOrder: 15 + i * 5,
              defaultValue: field.defaultValue || "",
              guide: "",
              deleteFlag: false,
              mobileAppId: -1
            };

            if ((field.fieldType === "CHIPS" || field.fieldType === "RADIO" || field.fieldType === "PICKER" || field.fieldType === "CHECKBOX") && field.options) {
              return {
                ...baseField,
                options: field.options
              };
            }

            return baseField;
          })
        ];

        return {
          subFormId: -1000 - index,
          subFormName: tab.tabName,
          write: true,
          appDescription: "",
          appType: "custom",
          fields,
          multiSet: false,
          appOrder: index + 1,
          headerFlag: 0,
          removeFlag: false,
          status: 1,
          deleteFlag: false
        };
      });

      const formPayload = {
        formId: -1,
        formName: input.formName,
        companyId: input.companyId,
        write: true,
        deleteFlag: false,
        sections
      };

      // API call
      const response = await fetch(`${apiEndPoint}form/builder/save/form`, {
        method: "POST",
        headers: {
          "Authorization": `${accessToken}`, realm: "qnopycommon",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formPayload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          content: [{
            type: "text",
            text: `❌ Failed to send form. Status: ${response.status}\n${errorBody}`
          }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `✅ Form "${input.formName}" created and sent successfully.`
        }]
      };

    } catch (err: any) {
      if (err instanceof ZodError) {
        return {
          content: err.errors.map((e) => ({
            type: "text",
            text: `❌ Error at "${e.path.join(".")}": ${e.message}`
          }))
        };
      }

      return {
        content: [{
          type: "text",
          text: `❌ Unexpected error: ${err?.message || err}`
        }]
      };
    }
  }
);


//*************************************** CREATE DYNAMIC FORM END *************************************************************************** */


//****************************************** GET USER OF COMPANY START *********************************************************************** */


server.registerTool(
  "get_user_list_for_company",
  {
    title: "Get User List for Company",
    description: "Returns a list of users for a given company. Supports search and limiting.",
    inputSchema: {
      companyId: z.number().default(1),
      searchTerm: z.string().optional().describe("Search by name or email"),
      limit: z.number().optional().default(20).describe("Limit number of results"),
    },
  },
  async ({ companyId, searchTerm = "", limit = 20 }) => {
    const users = await getUserListForCompany({ companyId });

    if (!users || users.length === 0) {
      return {
        content: [{ type: "text", text: "No users found for the specified company." }],
      };
    }

    // 🔍 Filter by search term
    const filtered = users.filter((user: any) => {
      const term = searchTerm.toLowerCase();
      return (
        user.userName?.toLowerCase().includes(term)
      );
    });

    if (filtered.length === 0) {
      return {
        content: [{ type: "text", text: `No users matched the search term "${searchTerm}".` }],
      };
    }

    // 📦 Limit the results
    const limited = filtered.slice(0, limit);

    const formatted = limited
      .map((user: any, i: number) => `${i + 1}. ${user.userName} ${user.userId} (${user.userRoleId})`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Showing ${limited.length} of ${filtered.length} matching users:\n\n${formatted}`,
        },
      ],
      data: limited,
    };
  }
);



interface GetUserListPayload {
  companyId: number;
}

export async function getUserListForCompany({ companyId }: GetUserListPayload): Promise<any[] | null> {
  try {
    const url = `${apiEndPoint}mobile/form/get/users?companyId=${companyId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: accessToken,
        realm: "qnopycommon",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API error:", response.statusText);
      return null;
    }

    const users: any = await response.json();
    return Array.isArray(users?.data) ? users?.data : null;
  } catch (err: any) {
    console.error("Fetch failed:", err?.message || err);
    return null;
  }
}


//***************************************** GET USER OF COMPANY END *************************************************************************** */


//********************************************* ASSIGN USER TO SITE START *************************************************************************** */
server.registerTool("assign_user_to_sites", {
  title: "Assign User to Multiple Sites (Projects)",
  description: "Assigns a user to multiple site IDs with a given role ID.",
  inputSchema: {
    userId: z.string(),
    siteIds: z.array(z.number()),
    roleId: z.string().default('5')
  }
}, async ({ userId, siteIds, roleId }) => {
  const result = await assignUserToProjectsBySite({ userId, siteIds, roleId:roleId });

  return {
    content: [
      {
        type: "text",
        text: `Assignment ${result.status}: ${result.message}`
      }
    ]
  };
});



async function assignUserToProjectsBySite({
  userId,
  siteIds,
  roleId
}: {
  userId: string;
  siteIds: number[];
  roleId: string;
}) {
  const url = new URL(`${apiEndPoint}project/assign/user/To/site`);
  url.searchParams.append("userId", userId);
  url.searchParams.append("roleId", roleId);
  url.searchParams.append("siteIds", siteIds.join(",")); // comma-separated

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Authorization": `${accessToken}`,
      "Content-Type": "application/json",
      realm: "qnopycommon"
    }
    // No body needed
  });

  let success = false;
  let message = "No message returned from API.";

  try {
    const data: any = await res.json();
    success = !!data.success;
    message = success
      ? "User assigned successfully to project."
      : "Failed to assign user to project.";
  } catch (err) {
    message = `Failed to parse API response: ${err}`;
  }

  return {
    status: success ? "success" : "failed",
    message
  };
}





//************************************************ ASSIGN USER TO SITE END *************************************************************************** */


//************************************************** CREATE EVENT FOR SITE START ******************************************************* */


server.registerTool(
  "create_site_event",
  {
    title: "Create Event",
    description: "Create a new event for a selected site and form.",
    inputSchema: {
      companyId: z.number(),
      projectId: z.number(),
      siteId: z.number().optional(),
      formId: z.number().optional(),
      eventDisplayName: z.string().optional(),
      startDateTime: z.string().datetime().optional()
    }
  },
  async (input) => {
    const { companyId, projectId, siteId, formId, eventDisplayName, startDateTime } = input;

    // Step 1: Ask for siteId
    if (!siteId) {
      return {
        content: [
          {
            type: "text",
            text: `📍 Please provide a valid \`siteId\`.`
          }
        ]
      };
    }

    // Step 2: Ask for formId
    if (!formId) {
      return {
        content: [
          {
            type: "text",
            text: `📄 Please provide a valid \`formId\` for site ${siteId}.`
          }
        ]
      };
    }

    // Step 3: Ask for eventDisplayName and startDateTime
    if (!eventDisplayName || !startDateTime) {
      return {
        content: [
          {
            type: "text",
            text: `📝 Please provide both:\n- \`eventDisplayName\`: "Event Name"\n- \`startDateTime\`: "YYYY-MM-DDTHH:mm:ss" (ISO format)`
          }
        ]
      };
    }

    // Step 4: Format startDate and startTime
    const dateObj = new Date(startDateTime);
    const startDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const startTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    // Step 5: Prepare and send payload
    const payload = {
      companyId,
      projectId,
      mobileAppId: formId,
      eventDisplayName,
      eventId: 0,
      file: null,
      folderId: "0",
      nameEvent: false,
      numberEvent: 1,
      startDate,
      startTime,
      remindersAlertTime: "02:00",
      repeat: "No",
      sendReminders: 0,
      timeZone: "Asia/Kolkata"
    };

    try {
      await createEvent(payload);

      return {
        content: [
          {
            type: "text",
            text: `✅ Event "${eventDisplayName}" created successfully.`
          }
        ]
      };
    } catch (err: any) {
      if (err.message === "DUPLICATE_EVENT_NAME") {
        return {
          content: [
            {
              type: "text",
              text: `⚠️ Event name "${eventDisplayName}" already exists. Please provide a new name.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to create event: ${err.message}`
          }
        ]
      };
    }
  }
);


async function createEvent(payload: any) {
    const res = await fetch(apiEndPoint + "event/save", {
        method: "POST",
        headers: {
            "Authorization": `${accessToken}`, realm: "qnopycommon",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) {
        if (text.includes("already exists")) {
            throw new Error("DUPLICATE_EVENT_NAME");
        }
        throw new Error(text);
    }
    return text;
}



//************************************************** CREATE EVENT FOR SITE END ************************************************************** */


//************************************************* EVENT PDF LOGS START ****************************************************************************** */

// server.registerTool(
//   "view_event_pdf_logs",
//   {
//     title: "Generate & View PDF Logs for Event",
//     description: "Generate the PDF report log for a given event and return a link to view it.",
//     inputSchema: {
//       eventId: z.number(),
//       reportId: z.number().default(794),
//       siteId: z.number(),
//       reportType: z.string().default("site"),
//       reportTable: z.string().default("s_report"),
//       format: z.string().default("pdf"),
//       putInQueue: z.boolean().default(true)
//     }
//   },
//   async (input:any) => {
//     try {
//       const response:any = await generatePdfLog(input);

//       if (!response?.s3File) {
//         return {
//           content: [
//             {
//               type: "text",
//               text: `No file generated. Please try again later.`
//             }
//           ]
//         };
//       }

//       const fileName = decodeURIComponent(response.fileKeyEncode || "PDF");
//       const downloadLink = response.s3File;

//       return {
//         content: [
//           {
//             type: "text",
//             text: `PDF log for Event ID ${input.eventId} generated successfully.\n\n📄 **File:** ${fileName}\n🔗 [Click here to view/download PDF](${downloadLink})`
//           }
//         ]
//       };
//     } catch (err: any) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Failed to generate PDF log: ${err.message}`
//           }
//         ]
//       };
//     }
//   }
// );



// async function generatePdfLog(payload: {
//   eventId: number;
//   reportId: number;
//   reportType: string;
//   siteId: number;
//   reportTable: string;
//   format: "pdf";
//   putInQueue: boolean;
// }) {
//   const res = await fetch(`${apiEndPoint}report/check/exist/true/view`, {
//     method: "POST",
//     headers: {
//       "Authorization": `${accessToken}`,realm: "qnopycommon",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   if (!res.ok) {
//     const errText = await res.text();
//     throw new Error(`API Error: ${errText}`);
//   }

//   const data = await res.json();
//   return data; // contains s3File, fileKeyEncode, etc.
// }



//***************************************************** EVENT PDF LOGS END *********************************************************************** */

// server.prompt("create_project_and_assign_forms", async (extra) => {
//   return {
//     messages: [
//       {
//         role: "user",
//         content: {
//           type: "text",
//           text: "Create a project and assign forms"
//         }
//       }
//     ]
//   };
// });









// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function truncate(str: string, max = 1500) {
  return str.length > max ? str.slice(0, max) + '\n... (output truncated)' : str;
}

main().catch(err => {
  console.error("Error starting server:", err);
});
