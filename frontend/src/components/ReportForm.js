import React, { useState } from 'react';
import './ReportForm.css';

const tableFields = {
    livro: ["isbn (livro)", "titulo (livro)", "autor (livro)", "categoria (livro)", "data_publicacao (livro)", "descricao (livro)", "num_paginas (livro)", "link_thumbnail (livro)", "nota_media (livro)"],
    review: ["livro_isbn (review)", "autor (review)", "data_publicacao (review)", "sumario (review)", "link_url_review (review)", "numero_review (review)"],
    lista: ["nome (lista)", "data_publicacao (lista)", "frequencia (lista)"],
    livros_da_lista: ["lista_nome (livros_da_lista)", "livro_isbn (livros_da_lista)", "rank (livros_da_lista)"]
};

const filterOperators = {
    text: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'contains', label: 'Contém' }
    ],
    number: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '>=' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '<=' },
        { value: 'in', label: 'Entre' },
        { value: 'notIn', label: 'Não Entre' }
    ],
    date: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '>=' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '<=' },
        { value: 'in', label: 'Entre' },
        { value: 'notIn', label: 'Não Entre' }
    ]
};

const havingOperators = {
    text: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'contains', label: 'Contém' }
    ],
    number: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '>=' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '<=' },
        { value: 'in', label: 'Entre' },
        { value: 'notIn', label: 'Não Entre' }
    ],
    date: [
        { value: 'equals', label: '=' },
        { value: 'not', label: '!=' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '>=' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '<=' },
        { value: 'in', label: 'Entre' },
        { value: 'notIn', label: 'Não Entre' }
    ]
};

const aggregationTypes = [
    { value: 'count', label: 'Contagem (COUNT)' },
    { value: 'sum', label: 'Soma (SUM)' },
    { value: 'avg', label: 'Média (AVG)' },
    { value: 'min', label: 'Mínimo (MIN)' },
    { value: 'max', label: 'Máximo (MAX)' }
];

const sortOrders = [
    { value: 'asc', label: 'Ascendente (ASC)' },
    { value: 'desc', label: 'Descendente (DESC)' }
];

const ReportForm = ({ onGenerateReport }) => {
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedFields, setSelectedFields] = useState({});
    const [filters, setFilters] = useState([]);
    const [aggregations, setAggregations] = useState([]);
    const [groupBy, setGroupBy] = useState([]);
    const [orderBy, setOrderBy] = useState([]);
    const [deliveryFormat, setDeliveryFormat] = useState('screen');
    const [responseFormat, setResponseFormat] = useState('table');
    const [take, setTake] = useState('');
    const [havingConditions, setHavingConditions] = useState([]);
    const [filterLogicalOperator, setFilterLogicalOperator] = useState('AND');
    const [havingLogicalOperator, setHavingLogicalOperator] = useState('AND');


    const handleTableSelection = (table) => {
        setSelectedTables(prev => {
            const updatedTables = prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table];
            const updatedFields = {};

            updatedTables.forEach(t => {
                tableFields[t].forEach(field => {
                    const fieldName = `${field}`;
                    updatedFields[fieldName] = selectedFields[fieldName] || false;
                });
            });

            setSelectedFields(updatedFields);
            return updatedTables;
        });
    };

    const handleFieldSelection = (field) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleFilterChange = (index, field, value) => {
        setFilters(prev => {
            const updatedFilters = [...prev];
            updatedFilters[index] = { ...updatedFilters[index], [field]: value };
            return updatedFilters;
        });
    };

    const handleAddFilter = () => {
        setFilters(prev => [...prev, { field: '', operator: '', value: '', value2: '' }]);
    };

    const handleRemoveFilter = (index) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    const handleFilterLogicalOperatorChange = (e) => {
        setFilterLogicalOperator(e.target.value);
    };

    const handleHavingLogicalOperatorChange = (e) => {
        setHavingLogicalOperator(e.target.value);
    };

    const handleAggregationSelection = (index, field, value) => {
        setAggregations(prev => {
            const updatedAggregations = [...prev];
            updatedAggregations[index] = { ...updatedAggregations[index], [field]: value };
            return updatedAggregations;
        });
    };

    const handleAddAggregation = () => {
        setAggregations(prev => [...prev, { field: '', type: '' }]);
    };

    const handleRemoveAggregation = (index) => {
        setAggregations(prev => prev.filter((_, i) => i !== index));
    };

    const handleGroupByChange = (index, value) => {
        setGroupBy(prev => {
            const updatedGroupBy = [...prev];
            updatedGroupBy[index] = value;
            return updatedGroupBy;
        });
    };

    const handleHavingChange = (index, field, value) => {
        setHavingConditions(prev => {
            const updatedHaving = [...prev];
            updatedHaving[index] = { ...updatedHaving[index], [field]: value };
            return updatedHaving;
        });
    };

    const handleAddHaving = () => {
        setHavingConditions(prev => [...prev, { field: '', operator: '', value: '' }]);
    };

    const handleRemoveHaving = (index) => {
        setHavingConditions(prev => prev.filter((_, i) => i !== index));
    };


    const handleAddGroupBy = () => {
        setGroupBy(prev => [...prev, '']);
    };

    const handleRemoveGroupBy = (index) => {
        setGroupBy(prev => prev.filter((_, i) => i !== index));
    };

    const handleOrderByChange = (index, key, value) => {
        const updatedOrderBy = [...orderBy];
        updatedOrderBy[index] = {
            ...updatedOrderBy[index],
            [key]: value,
        };
        setOrderBy(updatedOrderBy);
    };

    const handleAddOrderBy = () => {
        setOrderBy([...orderBy, { field: '', order: 'asc' }]);
    };

    const handleRemoveOrderBy = index => {
        setOrderBy(orderBy.filter((_, i) => i !== index));
    };


    const cleanObject = (obj) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => {
                if (Array.isArray(v)) {
                    return v.length > 0; // Remove arrays vazios
                }
                if (typeof v === 'object' && v !== null) {
                    return Object.keys(v).length > 0; // Remove objetos vazios
                }
                return v !== undefined && v !== null && v !== '';
            })
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const getFieldName = (field) => field.split(' ')[0];
        const getTableNameFromField = (field) => field.substring(field.indexOf('(') + 1, field.indexOf(')')).trim();

        const convertValueToNumber = (value) => {
            const num = Number(value);
            return isNaN(num) ? value : num;
        };

        // Agrupar filtros por tabela
        const filtersByTable = filters.reduce((acc, filter) => {
            const fieldName = getFieldName(filter.field);
            const tableName = getTableNameFromField(filter.field);

            if (!acc[tableName]) {
                acc[tableName] = { filters: [], logicalOperator: filterLogicalOperator };
            }

            const filterObject = {
                [fieldName]: {
                    [filter.operator]: filter.operator === 'in' || filter.operator === 'notIn'
                        ? { value1: convertValueToNumber(filter.value), value2: convertValueToNumber(filter.value2) }
                        : convertValueToNumber(filter.value)
                }
            };

            acc[tableName].filters.push(filterObject);
            return acc;
        }, {});

        // Mapear groupBy e orderBy para cada tabela
        const getGroupByForTable = (tableName) => {
            return groupBy
                .filter(field => getTableNameFromField(field) === tableName)
                .map(field => getFieldName(field));
        };

        const getOrderByForTable = (tableName) => {
            return orderBy
                .filter(({ field }) => getTableNameFromField(field) === tableName)
                .map(({ field, order }) => ({
                    [getFieldName(field)]: order
                }));
        };

        // Mapear having para cada tabela
        const getHavingForTable = (tableName) => {
            return havingConditions
                .filter(having => getTableNameFromField(having.field) === tableName)
                .reduce((acc, having) => {
                    if (having.field && having.operator) {
                        acc.push({
                            [getFieldName(having.field)]: {
                                [having.operator]: convertValueToNumber(having.value)
                            }
                        });
                    }
                    return acc;
                }, []);
        };

        // Mapear aggregations para cada tabela
        const getAggregationsForTable = (tableName) => {
            return aggregations
                .filter(agg => getTableNameFromField(agg.field) === tableName)
                .reduce((acc, agg) => {
                    if (agg.field && agg.type) {
                        if (!acc[`_${agg.type}`]) {
                            acc[`_${agg.type}`] = {};
                        }
                        acc[`_${agg.type}`][getFieldName(agg.field)] = true;
                    }
                    return acc;
                }, {});
        };

        // Formatar os dados para cada tabela
        const formattedData = selectedTables.map(tableName => {
            const tableFieldsForTable = tableFields[tableName];

            return {
                tableName,
                attributes: Object.fromEntries(
                    tableFieldsForTable.map(field => [getFieldName(field), selectedFields[field]])
                ),
                filters: filtersByTable[tableName]?.filters || [],
                logicalOperator: filtersByTable[tableName]?.logicalOperator || undefined,
                orderBy: getOrderByForTable(tableName),
                groupBy: getGroupByForTable(tableName),
                aggregations: getAggregationsForTable(tableName),
                having: getHavingForTable(tableName),
                havingLogicalOperator: havingLogicalOperator,
                take: parseInt(take) || undefined
            };
        });

        // Limpar os dados antes de enviar
        const sendToBackend = formattedData.map(tableData => cleanObject({
            tableName: tableData.tableName,
            attributes: tableData.attributes,
            filters: tableData.filters,
            logicalOperator: tableData.logicalOperator,
            orderBy: tableData.orderBy,
            groupBy: tableData.groupBy,
            aggregations: tableData.aggregations,
            having: tableData.having,
            havingLogicalOperator: tableData.havingLogicalOperator,
            take: tableData.take
        }));

        // Enviar os dados ao backend
        onGenerateReport({
            selectedTables: sendToBackend,
            deliveryFormat,
            responseFormat
        });
    };





    const getFieldType = (fieldName) => {
        const table = fieldName.substring(fieldName.indexOf('(') + 1, fieldName.indexOf(')')).trim();
        const field = fieldName.substring(0, fieldName.indexOf('(')).trim();

        switch (field) {
            case 'isbn':
            case 'titulo':
            case 'categoria':
            case 'descricao':
            case 'link_thumbnail':
            case 'nome':
            case 'frequencia':
                return 'text';
            case 'data_publicacao':
                return 'date';
            case 'num_paginas':
            case 'nota_media':
            case 'numero_review':
            case 'rank':
                return 'number';
            default:
                return 'text';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
                <label>Selecione as Tabelas:</label>
                <div className="button-group">
                    {Object.keys(tableFields).map((table) => (
                        <button
                            type="button"
                            key={table}
                            className={`toggle-button ${selectedTables.includes(table) ? 'selected' : ''}`}
                            onClick={() => handleTableSelection(table)}
                        >
                            {table}
                        </button>
                    ))}
                </div>
            </div>
            {selectedTables.length > 0 && (
                <>
                    <div className="form-group">
                        <label>Selecione os Campos:</label>
                        <div className="button-group">
                            {selectedTables.flatMap(table =>
                                tableFields[table].map((field) => (
                                    <button
                                        type="button"
                                        key={field}
                                        className={`toggle-button ${selectedFields[field] ? 'selected' : ''}`}
                                        onClick={() => handleFieldSelection(field)}
                                    >
                                        {field.replace('_', ' ').toUpperCase()}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Filtros:</label>
                        <div>
                            {filters.map((filter, index) => (
                                <div key={index} className="filter-group">
                                    <select
                                        name="field"
                                        value={filter.field}
                                        onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                    >
                                        <option value="">Selecione um campo</option>
                                        {Object.keys(selectedFields).map((field) => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                    </select>
                                    <select
                                        name="operator"
                                        value={filter.operator}
                                        onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                                    >
                                        <option value="">Operador</option>
                                        {filter.field && filterOperators[getFieldType(filter.field)].map(op => (
                                            <option key={op.value} value={op.value}>{op.label}</option>
                                        ))}
                                    </select>
                                    {filter.operator === 'in' || filter.operator === 'notIn' ? (
                                        <>
                                            <input
                                                type={getFieldType(filter.field) === 'date' ? 'date' : 'text'}
                                                name="value"
                                                value={filter.value}
                                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                            />
                                            <span>e</span>
                                            <input
                                                type={getFieldType(filter.field) === 'date' ? 'date' : 'text'}
                                                name="value2"
                                                value={filter.value2}
                                                onChange={(e) => handleFilterChange(index, 'value2', e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <input
                                            type={getFieldType(filter.field) === 'date' ? 'date' : 'text'}
                                            name="value"
                                            value={filter.value}
                                            onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                        />
                                    )}
                                    <button type="button" onClick={() => handleRemoveFilter(index)}>Remover</button>
                                </div>
                            ))}
                            <button type="button" className="add-filter-button" onClick={handleAddFilter}>Adicionar Filtro</button>
                        </div>
                    </div>
                    {filters.length > 1 && (
                        <div className="form-group">
                            <label>Operador Lógico para Filtros:</label>
                            <select value={filterLogicalOperator} onChange={handleFilterLogicalOperatorChange}>
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                                <option value="NOT">NOT</option>
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label>Agregações:</label>
                        <div>
                            {aggregations.map((agg, index) => (
                                <div key={index} className="aggregation-group">
                                    <select
                                        name="field"
                                        value={agg.field}
                                        onChange={(e) => handleAggregationSelection(index, 'field', e.target.value)}
                                    >
                                        <option value="">Selecione um campo</option>
                                        {Object.keys(selectedFields).map((field) => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                    </select>
                                    <select
                                        name="type"
                                        value={agg.type}
                                        onChange={(e) => handleAggregationSelection(index, 'type', e.target.value)}
                                    >
                                        <option value="">Selecione uma agregação</option>
                                        {aggregationTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    <button type="button" className="remove-button" onClick={() => handleRemoveAggregation(index)}>Remover</button>
                                </div>
                            ))}
                            <button type="button" className="add-aggregation-button" onClick={handleAddAggregation}>Adicionar Agregação</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Agrupamento (Group By):</label>
                        <div>
                            {groupBy.map((group, index) => (
                                <div key={index} className="group-by-group">
                                    <select
                                        name="field"
                                        value={group}
                                        onChange={(e) => handleGroupByChange(index, e.target.value)}
                                    >
                                        <option value="">Selecione um campo</option>
                                        {Object.keys(selectedFields).map((field) => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                    </select>
                                    <button type="button" className="remove-button" onClick={() => handleRemoveGroupBy(index)}>Remover</button>
                                </div>
                            ))}
                            <button type="button" className="add-group-by-button" onClick={handleAddGroupBy}>Adicionar Agrupamento</button>
                        </div>
                    </div>
                    {groupBy.length > 0 && (
                        <div className="form-group">
                            <label>HAVING:</label>
                            <div>
                                {havingConditions.map((having, index) => (
                                    <div key={index} className="having-group">
                                        <select
                                            name="field"
                                            value={having.field}
                                            onChange={(e) => handleHavingChange(index, 'field', e.target.value)}
                                        >
                                            <option value="">Selecione um campo</option>
                                            {Object.keys(selectedFields).map((field) => (
                                                <option key={field} value={field}>
                                                    {field}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="operator"
                                            value={having.operator}
                                            onChange={(e) => handleHavingChange(index, 'operator', e.target.value)}
                                        >
                                            <option value="">Operador</option>
                                            {having.field && havingOperators[getFieldType(having.field)].map(op => (
                                                <option key={op.value} value={op.value}>{op.label}</option>
                                            ))}
                                        </select>
                                        {having.operator === 'in' || having.operator === 'notIn' ? (
                                            <>
                                                <input
                                                    type={getFieldType(having.field) === 'date' ? 'date' : 'text'}
                                                    name="value"
                                                    value={having.value}
                                                    onChange={(e) => handleHavingChange(index, 'value', e.target.value)}
                                                />
                                                <span>e</span>
                                                <input
                                                    type={getFieldType(having.field) === 'date' ? 'date' : 'text'}
                                                    name="value2"
                                                    value={having.value2}
                                                    onChange={(e) => handleHavingChange(index, 'value2', e.target.value)}
                                                />
                                            </>
                                        ) : (
                                            <input
                                                type={getFieldType(having.field) === 'date' ? 'date' : 'text'}
                                                name="value"
                                                value={having.value}
                                                onChange={(e) => handleHavingChange(index, 'value', e.target.value)}
                                            />
                                        )}
                                        <button type="button" onClick={() => handleRemoveHaving(index)}>Remover</button>
                                    </div>
                                ))}
                                <button type="button" className="add-having-button" onClick={handleAddHaving}>Adicionar HAVING</button>
                            </div>
                        </div>
                    )}
                    {havingConditions.length > 1 && (
                        <div className="form-group">
                            <label>Operador Lógico para Having:</label>
                            <select value={havingLogicalOperator} onChange={handleHavingLogicalOperatorChange}>
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                                <option value="NOT">NOT</option>
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label>Order By:</label>
                        {orderBy.map((order, index) => (
                            <div key={index} className="order-by-group">
                                <select
                                    value={order.field}
                                    onChange={e => handleOrderByChange(index, 'field', e.target.value)}
                                >
                                    <option value="">Selecione um Campo</option>
                                    {Object.keys(selectedFields)
                                        .filter(field => selectedFields[field])
                                        .map(field => (
                                            <option key={field} value={field}>
                                                {field}
                                            </option>
                                        ))}
                                </select>
                                <select
                                    value={order.order}
                                    onChange={e => handleOrderByChange(index, 'order', e.target.value)}
                                >
                                    <option value="asc">ASC</option>
                                    <option value="desc">DESC</option>
                                </select>
                                <button type="button" onClick={() => handleRemoveOrderBy(index)}>
                                    Remover
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddOrderBy} className="add-order-by-button">
                            Adicionar Order By
                        </button>
                    </div>
                    <div className="form-group">
                        <label>Limitar Busca (Take):</label>
                        <input
                            type="number"
                            value={take}
                            onChange={(e) => setTake(e.target.value)}
                            placeholder="Quantidade máxima de registros"
                        />
                    </div>
                    <div className="form-group">
                        <label>Formato de Entrega:</label>
                        <select
                            value={deliveryFormat}
                            onChange={(e) => setDeliveryFormat(e.target.value)}
                        >
                            <option value="screen">Mostrar na Tela</option>
                            <option value="csv">Download em CSV</option>
                            <option value="screen_csv">Mostrar na Tela e Download em CSV</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Formato da Resposta:</label>
                        <select
                            value={responseFormat}
                            onChange={(e) => setResponseFormat(e.target.value)}
                        >
                            <option value="table">Tabela</option>
                            <option value="cards">Cartões/Caixas</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Gerar Relatório</button>
                </>
            )}
        </form>
    );


};

export default ReportForm;
