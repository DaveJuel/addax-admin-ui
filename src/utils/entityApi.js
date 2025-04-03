// entityApi.js

import { apiUrl } from "utils/httpclient-handler";

const API_ENDPOINT = `${apiUrl}`;

export const CONFIG_ENTITIES = ['user_role', 'privilege', 'file_upload'];

export const fetchEntityList = async (userData,
  activeAppApiKey)=>{
    try {
      const response = await fetch(`${API_ENDPOINT}/entities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": userData.login_token,
          "api_key": activeAppApiKey
        },
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

export const destroyEntity = async (entityName, userData, activeAppApiKey) => {
  try {
    const requestData = {
      entity_name: entityName,
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

export const fetchEntityProperties = async (
  entityName,
  userData,
  activeAppApiKey
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
