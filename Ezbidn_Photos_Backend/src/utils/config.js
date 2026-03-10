import dotenv from 'dotenv';
dotenv.config();
let incidentCredentials = {
  INCIDENT_ACCESS_TOKEN: process.env.INCIDENT_ACCESS_TOKEN,
  INCIDENT_ACCESS_TYPE: process.env.INCIDENT_ACCESS_TYPE,
};

// Function to update environment variable
export const updateEnvVar = (data) => {
  incidentCredentials.INCIDENT_ACCESS_TOKEN = data.access_token;
  incidentCredentials.INCIDENT_ACCESS_TYPE = data.token_type;
};

export const getDBDetails = () => {
  return incidentCredentials;
};
