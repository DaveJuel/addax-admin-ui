export const fetchWeatherData = async (location = 'Kigali')=>{
 try{
    const url = location.includes(',')
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${location.split(',')[0]}&lon=${location.split(',')[1]}&appid=03f5e7ede41608a45eacfebc3a016cd3&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=03f5e7ede41608a45eacfebc3a016cd3&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  return {
    success: true,
    result: data
  }
 }catch(error){
    console.error('Error fetching weather data:', error);
    return {
        success: false,
        message: error.message || 'Error fetching weather data'
    }
 }
}