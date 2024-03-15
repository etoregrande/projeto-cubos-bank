const fs = require('fs/promises');
const data = require('../database.json');

const updateDatabase = async (database) => {
    try {
        const databaseStringify = JSON.stringify(database);
        fs.writeFile('./src/database.json', databaseStringify);
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro ao escrever no banco de dados!" })
    }
}

const verifyExistingEmail = (req) => {
    const id = Number(req.params.numeroConta);

    const existingEmail = data.contas.some((account) => account.usuario.email === req.body.email && account.numero !== id);
    if (existingEmail) {
        return true;
    }
    return false;
}

const verifyExistingCpf = (req) => {
    const id = Number(req.params.numeroConta);

    const existingCpf = data.contas.some((account) => account.usuario.cpf === req.body.cpf && account.numero !== id);
    if (existingCpf) {
        return true;
    }
    return false;
}

const findAccount = (accountId) => {
    const accountFound = data.contas.find((account) => account.numero === accountId);
    if (!accountFound || accountId === "") {
        return false;
    }

    return accountFound;
};

module.exports = {
    updateDatabase,
    verifyExistingCpf,
    verifyExistingEmail,
    findAccount
}