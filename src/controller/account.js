const fs = require('fs/promises');
const z = require('zod');

const data = require('../database.json');
const { updateDatabase, verifyExistingCpf, verifyExistingEmail, findAccount } = require('../scripts/scripts');

const listAccounts = async (req, res) => {
    try {
        return res.send(data.contas);
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const createAccount = async (req, res) => {
    try {
        const validationSchema = z.object({
            nome: z.string(),
            cpf: z.string(),
            data_nascimento: z.string(),
            telefone: z.string(),
            email: z.string().email(),
            senha: z.string()
        })
        validationSchema.parse(req.body);

    } catch (error) {
        return res.status(400).json({ error });
    }

    try {
        let errors = [];
        if (verifyExistingCpf(req)) {
            errors.push({ cpf: "Já existe uma conta com este cpf" });
        }
        if (verifyExistingEmail(req)) {
            errors.push({ email: "Já existe uma conta com este email" });
        }

        if (errors.length !== 0) {
            return res.status(400).send({ errors });
        }

        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const database = JSON.parse(await fs.readFile('./src/database.json'));
        const newAccount = {
            numero: database.idNovaConta++,
            saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha,
            }
        };

        database.contas.push(newAccount);
        updateDatabase(database);

        return res.status(201).send();
    } catch (error) {
        return res.status(500).json({ error });
    };
}

const updateAccount = async (req, res) => {
    const id = Number(req.params.numeroConta);

    const accountFound = findAccount(id);
    if (!accountFound) {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
    }

    try {
        const validationSchema = z.object({
            nome: z.string(),
            cpf: z.string(),
            data_nascimento: z.string(),
            telefone: z.string(),
            email: z.string().email(),
            senha: z.string()
        })
        validationSchema.parse(req.body);

    } catch (error) {
        return res.status(400).json({ error });
    }

    try {
        let errors = [];
        if (verifyExistingCpf(req)) {
            errors.push({ cpf: "Já existe uma conta com este cpf" });
        }
        if (verifyExistingEmail(req)) {
            errors.push({ email: "Já existe uma conta com este email" });
        }

        if (errors.length !== 0) {
            return res.status(400).send({ errors });
        }

        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

        let accountIndex = data.contas.findIndex((account) => account.numero === id);
        let database = JSON.parse(await fs.readFile('./src/database.json'));

        database.contas[accountIndex].usuario.nome = nome;
        database.contas[accountIndex].usuario.cpf = cpf;
        database.contas[accountIndex].usuario.data_nascimento = data_nascimento;
        database.contas[accountIndex].usuario.telefone = telefone;
        database.contas[accountIndex].usuario.email = email;
        database.contas[accountIndex].usuario.senha = senha;
        updateDatabase(database);

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ error })
    }
}

const deleteAccount = async (req, res) => {
    const id = Number(req.params.numeroConta);

    try {
        const accountFound = findAccount(id);
        if (!accountFound) {
            return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
        }

        let accountIndex = data.contas.findIndex((account) => account.numero === id);

        if (data.contas[accountIndex].saldo !== 0) {
            return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
        }

        let database = JSON.parse(await fs.readFile('./src/database.json'));

        database.contas.splice(accountIndex, 1);
        updateDatabase(database);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports = {
    listAccounts,
    createAccount,
    updateAccount,
    deleteAccount
}