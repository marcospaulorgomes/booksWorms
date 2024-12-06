export async function selectQuery(params, prisma) {
    try {
        switch (params[0].tableName) {
            case 'livro':
                if (params[0].groupBy) return booksGroupByQuery(params, prisma);
                if (params[0].aggregations) return booksAggregateQuery(params, prisma);
                return booksQuery(params, prisma);

            case 'lista':
                if (params[0].groupBy) return listsGroupByQuery(params, prisma);
                if (params[0].aggregations) return listsAggregateQuery(params, prisma);
                return listsQuery(params, prisma);

            case 'livros_da_lista':
                if (params[0].groupBy) return booksOfListsGroupByQuery(params, prisma);
                if (params[0].aggregations) return booksOfListsAggregateQuery(params, prisma);
                return booksOfListsQuery(params, prisma);

            case 'review':
                if (params[0].groupBy) return reviewsGroupByQuery(params, prisma);
                if (params[0].aggregations) return reviewsAggregateQuery(params, prisma);
                return reviewsQuery(params, prisma);

            default:
                console.log("Nenhuma tabela com esse nome foi encontrada no banco!");
        }
    } catch (error) {
        return "Error: " + error.toString();
    }
}


//---------------------------------------Table livro -----------------------------------
async function booksQuery(params, prisma) {   //JOIN ou SELECT
    const response = await prisma.livro.findMany(
        buildJoinObject(params)
    );
    return response;
}

async function booksAggregateQuery(params, prisma) {   //AGGREGATIONS   
    const response = await prisma.livro.aggregate(buildAggregationObject(params));
    return response;
}


async function booksGroupByQuery(params, prisma) {   // GROUP BY OU GROUP BY + AGGREGATIONS
    const response = await prisma.livro.groupBy(
        buildAggregationObject(params)
    );
    return response;
}

//---------------------------------------Table lista -----------------------------------
async function listsQuery(params, prisma) {
    const response = await prisma.lista.findMany(
        buildJoinObject(params)
    );
    return response;
}

async function listsAggregateQuery(params, prisma) {
    const response = await prisma.lista.aggregate(buildAggregationObject(params));
    return response;
}


async function listsGroupByQuery(params, prisma) {
    const response = await prisma.lista.groupBy(
        buildAggregationObject(params)
    );
    return response;
}

//---------------------------------------Table livros_da_lista -----------------------------------
async function booksOfListsQuery(params, prisma) {
    const response = await prisma.livros_da_lista.findMany(
        buildJoinObject(params)
    );
    return response;
}

async function booksOfListsAggregateQuery(params, prisma) {
    const response = await prisma.livros_da_lista.aggregate(buildAggregationObject(params));
    return response;
}

async function booksOfListsGroupByQuery(params, prisma) {
    const response = await prisma.livros_da_lista.groupBy(
        buildAggregationObject(params)
    );
    return response;
}

//---------------------------------------Table review -----------------------------------
async function reviewsQuery(params, prisma) {
    const response = await prisma.review.findMany(
        buildJoinObject(params)
    );
    return response;
}

async function reviewsAggregateQuery(params, prisma) {
    const response = await prisma.review.aggregate(buildAggregationObject(params));
    return response;
}

async function reviewsGroupByQuery(params, prisma) {
    const response = await prisma.review.groupBy(
        buildAggregationObject(params)
    );
    return response;
}

//--------------------------------------- Aux Functions -----------------------------------
function buildJoinObject(params) {
    let joinObject = {}


    // console.log(params[0].filters);
    if (params[0].filters) {
        let whereObject = {}
        whereObject[params[0].logicalOperator] = buildWhereArray(params[0].filters);
        joinObject['where'] = whereObject;
    }

    if (!params[1] && params[0].attributes) joinObject['select'] = params[0].attributes;    // Caso não exista outra tabela e o usuário tenha especificado atributos que deseja escolher
    if (params[0].take) joinObject['take'] = params[0].take;
    if (params[0].orderBy) joinObject['orderBy'] = params[0].orderBy;

    if (params[1]) joinObject['include'] = buildIncludeObject(params);  // Caso exista pelo menos uma tabela para fazer JOIN
    return joinObject;
}

function buildIncludeObject(params) {
    let includeObject = {};

    if (params[0].attributes) {
        Object.keys(params[0].attributes).forEach((atribute) => {
            if (params[0].attributes[atribute] === false) includeObject[atribute] = params[0].attributes[atribute];
        });
    }

    params.forEach(param => {
        if (param.attributes) {
            includeObject[param.tableName] = { select: param.attributes };
        } else {
            includeObject[param.tableName] = true;
        }
    });

    delete includeObject[params[0].tableName];
    return includeObject;
}

function buildAggregationObject(params) {
    let aggregationObject = {};

    if (params[0].filters) joinObject['where'] = buildWhereArray(params[0].filters);
    if (params[0].groupBy) aggregationObject['by'] = params[0].groupBy; // Caso seja uma operação com groupBy
    if (params[0].take) aggregationObject['take'] = params[0].take;
    if (params[0].orderBy) aggregationObject['orderBy'] = params[0].orderBy;
    if (params[0].having) aggregationObject['having'] = params[0].having; // Caso seja uma operação com groupBy

    if (params[0].aggregations) {
        Object.keys(params[0].aggregations).forEach((aggregation) => { //Para cada função de agregação/ SVG, SUM e etc

            aggregationObject[aggregation] = {};

            Object.keys(params[0].aggregations[aggregation]).forEach((attribute) => { //Para cada campo da função de agregação/ data_publicacao e etc

                if (params[0].aggregations[aggregation][attribute] === true) {

                    aggregationObject[aggregation][attribute] = params[0].aggregations[aggregation][attribute];
                }
            });
        });
    }
    console.log(JSON.stringify(aggregationObject));
    return aggregationObject
}

function buildWhereArray(filters) {
    try {
        let whereArray = [];

        if (filters) {
            filters.forEach(filter => {
                let attributeObject = {};
                Object.keys(filter).forEach((attribute) => {
                    let operations = {};
                    Object.keys(filter[attribute]).forEach((operation) => {
                        operations[operation] = filter[attribute][operation];
                    });
                    attributeObject[attribute] = operations;
                });
                whereArray.push(attributeObject);
            });
        }

        console.log(JSON.stringify(whereArray));
        return whereArray;
    } catch (error) {
        console.log(error.toString());
    }
}