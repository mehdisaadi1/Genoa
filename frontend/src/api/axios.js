import axios from 'axios';

// Replace with local IP of your machine if running on a physical device, e.g., 'http://192.168.1.50:3000'
// Use http://10.0.2.2:3000 for Android Emulator
// Default to localhost for web/iOS Simulator
const API_URL = 'http://192.168.59.107:3000';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
