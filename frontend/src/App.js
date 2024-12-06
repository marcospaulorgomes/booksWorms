import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ReportForm from './components/ReportForm';
import ReportResult from './components/ReportResult';

const App = () => {
  const [reportData, setReportData] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [showCsvDownload, setShowCsvDownload] = useState(false);

  const handleGenerateReport = async (formData) => {
    console.log('Form data submitted', formData); // Adiciona log da forma enviada
    try {
      if (formData.deliveryFormat === 'csv' || formData.deliveryFormat === 'screen_csv') {
        console.log('Generating CSV report');
        const responseCsv = await fetch('http://localhost:8080/csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!responseCsv.ok) {
          throw new Error('Erro ao gerar o CSV');
        }

        const blob = await responseCsv.blob();
        const url = window.URL.createObjectURL(blob);
        setCsvData(url);
        setShowCsvDownload(true);

        if (formData.deliveryFormat === 'screen_csv') {
          const responseJson = await fetch('http://localhost:8080/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!responseJson.ok) {
            throw new Error('Erro ao obter dados JSON');
          }

          const jsonResponse = await responseJson.json();
          console.log('JSON Response:', jsonResponse); // Adiciona log da resposta JSON
          setReportData(jsonResponse.data);
        } else {
          setReportData(null);
        }
      } else {
        console.log('Generating screen report');
        const responseJson = await fetch('http://localhost:8080/json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!responseJson.ok) {
          throw new Error('Erro ao obter dados JSON');
        }

        const result = await responseJson.json();
        console.log('JSON Result:', result); // Adiciona log da resposta JSON
        setReportData(result.data);
        setCsvData(null);
        setShowCsvDownload(false);
      }
    } catch (error) {
      console.error('Erro ao gerar o relatório:', error);
    }
  };


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Gerar Relatório</h1>
                <ReportForm onGenerateReport={handleGenerateReport} />
                {reportData && <ReportResult reportData={reportData} />}
                {showCsvDownload && (
                  <div>
                    <a href={csvData} download="report.csv">
                      <button>Baixar CSV</button>
                    </a>
                  </div>
                )}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
