import { apiUrl } from "utils/httpclient-handler";
const API_ENDPOINT = `${apiUrl}`;

export const fetchUserProfiles = async(userData,
    activeAppApiKey) =>{
          try {
            const response = await fetch(`${API_ENDPOINT}/user/list`, {
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
            console.error("Error fetching data:", error);
            return [];
          }
    };

export const fetchUserProfile = async (userData,activeAppApiKey) => {
  const requestData = {
    username: userData.username,
    login_token: userData.login_token,
    api_key: activeAppApiKey,
  };
  try {
    const response = await fetch(`${API_ENDPOINT}/profile/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": userData.login_token,
        "api_key": activeAppApiKey,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user prfile");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}