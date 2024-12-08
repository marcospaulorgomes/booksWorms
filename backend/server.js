import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { selectQuery } from './src/bookQuery.js';
import { jsonToCSV } from './src/jsonToCSV.js';

const app = express();
const port = 8080;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON e URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/json', async (req, res) => {
    try {
        const prisma = new PrismaClient();
        const response = await selectQuery(req.body.selectedTables, prisma);

        await prisma.$disconnect().catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });

        res.json(response);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error: ' + error.toString());
    }
});


app.post('/csv', async (req, res) => {
    try {
        const prisma = new PrismaClient();

        let response = await selectQuery(req.body.selectedTables, prisma);

        await prisma.$disconnect().catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        });

        response = jsonToCSV(response);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="query_response.csv"');
        console.log('Response CSV:', response);
        res.send(response)
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error: ' + error.toString());
    }
});

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Página não encontrada!' });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log('Servidor na porta: localhost:' + port);
});
