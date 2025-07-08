import { apiUrl } from "utils/httpclient-handler";

const API_ENDPOINT = `${apiUrl}`;

export const CONFIG_ENTITIES = ['user_role', 'privilege', 'file_upload'];
const activeAppApiKey = localStorage.getItem("activeApp") || "";

export const fetchEntityList = async (user, apiKey)=>{
  const response = await fetch(`${API_ENDPOINT}/entities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": user.login_token,
      "api_key": apiKey
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.result || "Failed to fetch data");
  }
  return data;
};

export const fetchEntityData = async (userData,
  entityName
) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/entity/data/${entityName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": userData.login_token,
        "api_key": activeAppApiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entity data");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching entity data:", error);
    return [];
  }
};

export const destroyEntity = async (userData, entityName) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/entity/${entityName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        api_key: activeAppApiKey,
        token: userData.login_token
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting entity ${entityName}:`, error);
    return null;
  }
};
export const deleteEntityInstance = async (userData, entityName, instanceId) => {
  try {

    const response = await fetch(`${API_ENDPOINT}/entity/${entityName}/${instanceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": userData.login_token,
        "api_key": activeAppApiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete record.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting entity ${entityName}:`, error);
    return null;
  }
};

export const fetchEntityProperties = async (userData,
  entityName
) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/entity/properties/${entityName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": userData.login_token,
        "api_key": activeAppApiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const exportEntityData = async (userData, entityName) =>{
  const response = await fetch(`${API_ENDPOINT}/export/${entityName}`, {
    method: "GET",
    headers: {
      "token": userData.login_token,
      "api_key": activeAppApiKey
    }
  });

  if (!response.ok) {
    throw new Error("Failed to export file");
  }

  // Convert response to blob
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  // Create a download link
  const a = document.createElement("a");
  a.href = url;
  a.download = "exported_data.xlsx";
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const uploadFile = async (user, apiKey, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${apiUrl}/upload/`, {
    method: 'POST',
    headers: {
      "token": user.login_token,
      "api_key": apiKey,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.result || 'File upload failed');
  }
  return data.result;
};

export const saveEntityData = async (userData, isActionEdit, entityName, formData) => {
  const requestData = {
    entity_name: entityName,
    details: formData,
  };
  const path = isActionEdit? `${API_ENDPOINT}/entity/${entityName}/${formData.id}` : `${API_ENDPOINT}/entity/${entityName}/`;
  const method = isActionEdit? `PATCH`: `POST`;
  const response = await fetch(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "token": userData.login_token,
      "api_key": activeAppApiKey,
    },
    body: JSON.stringify(requestData),
  });
  const jsonBody = await response.json();
  if (!response.ok) {
    throw new Error(jsonBody.result);
  }
  return jsonBody.result;
};

export const createEntity = async(userData, requestData) => {
  const jsonBody = JSON.stringify(requestData);
  const response = await fetch(`${API_ENDPOINT}/entity/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": userData.login_token,
      "api_key": activeAppApiKey,
    },
    body: jsonBody,
  });
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw new Error(jsonResponse.result);
  }
  return jsonResponse.result;
}