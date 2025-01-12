import axios from 'axios';

// Save spreadsheet data
export const saveSpreadsheet = async (name, data) => {
  try {
    const response = await axios.post('http://localhost:5000/save', { name, data });
    if (response.status === 200) {
      console.log('Spreadsheet saved:', response.data.message);
    } else {
      throw new Error('Failed to save the spreadsheet');
    }
  } catch (error) {
    console.error('Error saving spreadsheet:', error);
    throw error;
  }
};

// Load spreadsheet data
export const loadSpreadsheet = async (name) => {
  try {
    const response = await axios.get(http://localhost:5000/load/${name});
    if (response.status === 200) {
      return response.data; // Return the data of the loaded spreadsheet
    } else {
      throw new Error('Failed to load the spreadsheet');
    }
  } catch (error) {
    console.error('Error loading spreadsheet:', error);
    throw error;
  }
};

// Delete spreadsheet data (optional)
export const deleteSpreadsheet = async (name) => {
  try {
    const response = await axios.delete(http://localhost:5000/delete/${name});
    if (response.status === 200) {
      console.log('Spreadsheet deleted:', response.data.message);
    } else {
      throw new Error('Failed to delete the spreadsheet');
    }
  } catch (error) {
    console.error('Error deleting spreadsheet:', error);
    throw error;
  }
};