// entityApi.js

import { apiUrl } from "utils/httpclient-handler";

const API_ENDPOINT = `${apiUrl}/entity`;

export const CONFIG_ENTITIES = ['user_role', 'privilege', 'file_upload'];

export const fetchEntityList = async (userData,
  activeAppApiKey)=>{
    const requestData = {
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
    try {
      const response = await fetch(`${API_ENDPOINT}/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching entity data:", error);
      return [];
    }
};

export const fetchEntityData = async (
  entityName,
  userData,
  activeAppApiKey
) => {
  const requestData = {
    entity_name: entityName,
    username: userData.username,
    login_token: userData.login_token,
    api_key: activeAppApiKey,
  };

  try {
    const response = await fetch(`${API_ENDPOINT}/read/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entity data");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching entity data:", error);
    return null;
  }
};

export const destroyEntity = async (entityName, userData, activeAppApiKey) => {
  try {
    const requestData = {
      entity_name: entityName,
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
    const response = await fetch(`${API_ENDPOINT}/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
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
export const deleteEntityInstance = async (entityName, instanceId, userData, activeAppApiKey) => {
  try {
    const requestData = {
      entity_name: entityName,
      instance_id: instanceId,
      username: userData.username,
      login_token: userData.login_token,
      api_key: activeAppApiKey,
    };
    const response = await fetch(`${API_ENDPOINT}/instance/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
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

export const fetchEntityProperties = async (
  entityName,
  userData,
  activeAppApiKey
) => {
  const requestData = {
    entity_name: entityName,
    username: userData.username,
    login_token: userData.login_token,
    api_key: activeAppApiKey,
  };
  try {
    const response = await fetch(`${API_ENDPOINT}/read/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
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
