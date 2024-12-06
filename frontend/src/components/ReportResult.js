import React from 'react';
import './ReportResult.css';

const ReportResult = ({ reportData, responseFormat }) => {
    // Verifica se há dados válidos para renderizar
    if (!reportData || !reportData.data || reportData.data.length === 0) {
        return (
            <div className="report-result">
                <h2>Resultados do Relatório</h2>
                <p>Nenhum dado disponível para exibir.</p>
            </div>
        );
    }

    const renderTable = () => (
        <div className="report-table">
            <table>
                <thead>
                    <tr>
                        {Object.keys(reportData.data[0]).map((key, index) => (
                            <th key={index}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {reportData.data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(item).map((value, cellIndex) => (
                                <td key={cellIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCards = () => (
        <div className="report-cards">
            {reportData.data.map((item, rowIndex) => (
                <div key={rowIndex} className="report-card">
                    {Object.entries(item).map(([key, value], cellIndex) => (
                        <div key={cellIndex} className="card-item">
                            <div className="card-label">{key}</div>
                            <div className="card-value">{value}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className="report-result">
            <h2>Resultados do Relatório</h2>
            {responseFormat === 'table' && renderTable()}
            {responseFormat === 'cards' && renderCards()}
        </div>
    );
};

export default ReportResult;
