import { apiUrl } from "utils/httpclient-handler";
const API_ENDPOINT = `${apiUrl}/user`;

export const fetchUserProfiles = async(userData,
    activeAppApiKey) =>{
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
            console.error("Error fetching data:", error);
            return null;
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