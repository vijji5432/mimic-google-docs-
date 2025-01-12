import React, { useState } from 'react';
import { saveSpreadsheet, loadSpreadsheet } from './Api';
import './App.css';

function App() {
  const [sheetName, setSheetName] = useState('TestSheet');
  const [cells, setCells] = useState(createEmptyGrid(50, 26)); // 50 rows, 26 columns (A-Z)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [fontStyle, setFontStyle] = useState({
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: '14px',
    color: 'black',
  });
  const [formula, setFormula] = useState('');
  const [selectedRow, setSelectedRow] = useState(null); // Track selected row
  const [selectedCol, setSelectedCol] = useState(null); // Track selected column
  const [testData, setTestData] = useState(''); // Store custom test data

  // Create an empty grid with specified number of rows and columns
  function createEmptyGrid(rows, cols) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(new Array(cols).fill(''));
    }
    return grid;
  }

  // Handle Save functionality
  const handleSave = async () => {
    setMessage('');
    setError(null);
    try {
      await saveSpreadsheet(sheetName, cells);
      setMessage('Spreadsheet saved successfully!');
    } catch (err) {
      setError('Error saving spreadsheet: ' + err.message);
    }
  };

  // Handle Load functionality
  const handleLoad = async () => {
    setLoading(true);
    setMessage('');
    setError(null);
    try {
      const data = await loadSpreadsheet(sheetName);
      setCells(data);
      setMessage('Spreadsheet loaded successfully!');
    } catch (err) {
      setError('Error loading spreadsheet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cell change with validation
  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedCells = [...cells];

    // Validate input: allow only numeric input for numeric columns
    if (colIndex === 0 || colIndex === 1) {
      // For demonstration, assume columns 0 and 1 should contain only numbers
      if (isNaN(value) && value !== '') {
        alert('Please enter a valid number');
        return; // Don't update the cell if the value is invalid
      }
    }

    updatedCells[rowIndex][colIndex] = value;
    setCells(updatedCells);
    handleFormulaEvaluation();
  };

  // Evaluate formula dependencies
  const handleFormulaEvaluation = () => {
    if (formula) {
      const [row, col] = parseCell(formula);
      if (row !== undefined && col !== undefined) {
        const cellValue = cells[row][col];
        setFormula(${cellValue});
      }
    }
  };

  // Parse formula like "=A1+B1" to get row/column indices
  const parseCell = (formula) => {
    const cellRegex = /([A-Z]+)(\d+)/;
    const match = formula.match(cellRegex);
    if (match) {
      const col = match[1].charCodeAt(0) - 65;
      const row = parseInt(match[2], 10) - 1;
      return [row, col];
    }
    return [undefined, undefined];
  };

  // Apply bold formatting
  const handleBold = () => {
    setFontStyle({ ...fontStyle, fontWeight: fontStyle.fontWeight === 'normal' ? 'bold' : 'normal' });
  };

  // Apply italic formatting
  const handleItalic = () => {
    setFontStyle({ ...fontStyle, fontStyle: fontStyle.fontStyle === 'normal' ? 'italic' : 'normal' });
  };

  // Change font size
  const handleFontSizeChange = (size) => {
    setFontStyle({ ...fontStyle, fontSize: size });
  };

  // Change font color
  const handleFontColorChange = (color) => {
    setFontStyle({ ...fontStyle, color });
  };

  // Add new row
  const handleAddRow = () => {
    setCells(prevCells => [...prevCells, new Array(cells[0].length).fill('')]);
  };

  // Add new column
  const handleAddColumn = () => {
    setCells(prevCells => prevCells.map(row => [...row, '']));
  };

  // Delete selected row
  const handleDeleteRow = () => {
    if (selectedRow !== null) {
      setCells(prevCells => prevCells.filter((_, index) => index !== selectedRow));
      setSelectedRow(null); // Clear selection after deletion
    }
  };

  // Delete selected column
  const handleDeleteColumn = () => {
    if (selectedCol !== null) {
      setCells(prevCells => prevCells.map(row => row.filter((_, index) => index !== selectedCol)));
      setSelectedCol(null); // Clear selection after deletion
    }
  };

  // Handle row selection
  const handleRowSelect = (rowIndex) => {
    setSelectedRow(rowIndex === selectedRow ? null : rowIndex); // Toggle row selection
  };

  // Handle column selection
  const handleColumnSelect = (colIndex) => {
    setSelectedCol(colIndex === selectedCol ? null : colIndex); // Toggle column selection
  };

  // Convert the spreadsheet data to CSV format
  const convertToCSV = (data) => {
    return data.map(row => row.join(',')).join('\n');
  };

  // Handle the download functionality
  const handleDownload = () => {
    const csvData = convertToCSV(cells);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = ${sheetName}.csv;
    link.click();
  };

  // Data Quality Functions (unchanged)

  // TRIM: Remove leading and trailing whitespace
  const handleTrim = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (typeof cell === 'string' ? cell.trim() : cell))
    );
    setCells(updatedCells);
  };

  // UPPER: Convert text to uppercase
  const handleUpper = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (typeof cell === 'string' ? cell.toUpperCase() : cell))
    );
    setCells(updatedCells);
  };

  // LOWER: Convert text to lowercase
  const handleLower = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (typeof cell === 'string' ? cell.toLowerCase() : cell))
    );
    setCells(updatedCells);
  };

  // REMOVE_DUPLICATES: Remove duplicate rows
  const handleRemoveDuplicates = () => {
    const uniqueRows = Array.from(
      new Set(cells.map(row => JSON.stringify(row)))
    ).map(e => JSON.parse(e));
    setCells(uniqueRows);
  };

  // FIND_AND_REPLACE: Find and replace specific text
  const handleFindAndReplace = (findText, replaceText) => {
    const updatedCells = cells.map(row =>
      row.map(cell => (typeof cell === 'string' && cell.includes(findText)
        ? cell.replace(findText, replaceText)
        : cell))
    );
    setCells(updatedCells);
  };

  // Test function to execute and show results
  const handleTest = () => {
    try {
      // Test the functions (here you can test more complex cases)
      handleTrim();
      setTestData('Trim operation completed!');
    } catch (error) {
      setTestData('Error during testing: ' + error.message);
    }
  };

  return (
    <div className="spreadsheet-container">
      <div className="header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="green" className="file-icon">
          <path d="M10 2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 1.99 2h14c1.1 0 1.99-.9 1.99-2V6l-6-4h-6c-1.1 0-2 .9-2 2zm1 0h4v4h4v12H5V6h4V2z"/>
        </svg>
        <h1>Google Sheets Mimic</h1>
      </div>

      <div className="toolbar">
        <button onClick={handleBold}>Bold</button>
        <button onClick={handleItalic}>Italic</button>
        <select onChange={(e) => handleFontSizeChange(e.target.value)} value={fontStyle.fontSize}>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
        <input type="color" onChange={(e) => handleFontColorChange(e.target.value)} value={fontStyle.color} />
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleAddColumn}>Add Column</button>
        <button onClick={handleDeleteRow}>Delete Selected Row</button>
        <button onClick={handleDeleteColumn}>Delete Selected Column</button>
        <button onClick={handleTrim}>Trim</button>
        <button onClick={handleUpper}>UPPER</button>
        <button onClick={handleLower}>LOWER</button>
        <button onClick={handleRemoveDuplicates}>Remove Duplicates</button>
        <button onClick={() => handleFindAndReplace('find', 'replace')}>Find and Replace</button>
      </div>

      <input
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        placeholder="Enter formula"
        className="formula-bar"
      />

      <button onClick={handleSave}>Save Spreadsheet</button>
      <button onClick={handleLoad}>Load Spreadsheet</button>
      <button onClick={handleDownload}>Download Spreadsheet</button>
      <button onClick={handleTest}>Test Functionality</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {testData && <p>{testData}</p>}

      <div className="spreadsheet">
        <table>
          <thead>
            <tr>
              {Array.from({ length: 26 }).map((_, colIndex) => (
                <th key={colIndex} onClick={() => handleColumnSelect(colIndex)}>
                  {String.fromCharCode(65 + colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={rowIndex} onClick={() => handleRowSelect(rowIndex)}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => {
                      setSelectedRow(rowIndex);
                      setSelectedCol(colIndex);
                    }}
                  >
                    <input
                      type={colIndex === 0 ? 'number' : 'text'} // Adjust input type based on column index (for example, numeric for col 0)
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      style={{
                        textAlign: 'center',
                        fontWeight: fontStyle.fontWeight,
                        fontStyle: fontStyle.fontStyle,
                        fontSize: fontStyle.fontSize,
                        color: fontStyle.color,
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;