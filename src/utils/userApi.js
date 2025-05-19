import { apiUrl } from "utils/httpclient-handler";
const userData = JSON.parse(localStorage.getItem("user"));
const activeAppApiKey = localStorage.getItem("activeApp") || "";

const API_ENDPOINT = `${apiUrl}/user`;

export const fetchUserProfiles = async(user, apiKey) =>{
  try {
    const response = await fetch(`${API_ENDPOINT}/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": user.login_token,
        "api_key": apiKey
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${API_ENDPOINT}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": userData.login_token,
      "api_key": activeAppApiKey,
    },
  });
  const data = await response.json();
  return data.result;
}

export const saveUserProfile = async (isActionEdit, data) => {
  const path = isActionEdit? `${API_ENDPOINT}/profile/` : `${API_ENDPOINT}/profile/`;
  const method = isActionEdit? `PATCH`: `POST`;
  const response = await fetch(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "token": userData.login_token,
      "api_key": activeAppApiKey,
    },
    body: JSON.stringify(data),
  });
  const jsonBody = await response.json();
  if (!response.ok) {
    throw new Error(jsonBody.result);
  }
  return jsonBody.result;
};