const fs = require('fs/promises');
const z = require('zod');
const { format } = require('date-fns');

const data = require('../database.json');
const { updateDatabase, findAccount } = require('../scripts/scripts');

const deposit = async (req, res) => {
    try {
        const validationSchema = z.object({
            numero_conta: z.string(),
            valor: z.number()
        });
        validationSchema.parse(req.body);

    } catch (error) {
        return res.status(400).json({ error });
    }

    const id = Number(req.body.numero_conta);
    const valor = Number(req.body.valor);

    try {
        const accountFound = findAccount(id);
        if (!accountFound) {
            return res.status(400).json({ mensagem: "Conta bancária não encontada!" })
        }

        let database = JSON.parse(await fs.readFile('./src/database.json'));
        const accountIndex = database.contas.findIndex((account) => account.numero === id);
        let deposit = {
            data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta: req.body.numero_conta,
            valor
        }

        database.depositos.push(deposit);
        database.contas[accountIndex].saldo += valor
        updateDatabase(database)

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const withdraw = async (req, res) => {
    try {
        const validationSchema = z.object({
            numero_conta: z.string(),
            valor: z.number(),
            senha: z.string()
        });
        validationSchema.parse(req.body);

    } catch (error) {
        return res.status(400).json({ error });
    }

    const id = Number(req.body.numero_conta);
    const accountFound = findAccount(id);

    const valor = Number(req.body.valor);
    if (valor > accountFound.saldo) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente!" });
    }

    try {
        let database = JSON.parse(await fs.readFile('./src/database.json'));
        const accountIndex = database.contas.findIndex((account) => account.numero === id);

        let withdraw = {
            data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta: req.body.numero_conta,
            valor
        }

        database.saques.push(withdraw);
        database.contas[accountIndex].saldo -= valor
        updateDatabase(database)

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const transfer = async (req, res) => {
    try {
        const validationSchema = z.object({
            numero_conta_origem: z.string(),
            numero_conta_destino: z.string(),
            valor: z.number(),
            senha: z.string()
        });
        validationSchema.parse(req.body);

    } catch (error) {
        return res.status(400).json({ error });
    }

    const originId = Number(req.body.numero_conta_origem);
    const destinationId = Number(req.body.numero_conta_destino);

    try {
        const originAccountFound = findAccount(originId);
        const destinationAccountFound = findAccount(destinationId);
        if (!destinationAccountFound) {
            return res.status(400).json({ mensagem: "Conta bancária de destino não encontada!" })
        }

        const valor = req.body.valor
        if (valor > originAccountFound.saldo) {
            return res.status(400).json({ mensagem: "Saldo insuficiente!" })
        }

        let database = JSON.parse(await fs.readFile('./src/database.json'));

        let transfer = {
            data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta_origem: String(originId),
            numero_conta_destino: String(destinationId),
            valor
        }
        const originAccountIndex = database.contas.findIndex((account) => account.numero === originId);
        const destinationAccountIndex = database.contas.findIndex((account) => account.numero === destinationId);

        database.transferencias.push(transfer);
        database.contas[originAccountIndex].saldo -= valor
        database.contas[destinationAccountIndex].saldo += valor
        updateDatabase(database)

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const balance = (req, res) => {
    const id = Number(req.query.numero_conta);
    try {
        const accountFound = findAccount(id);
        return res.status(200).json({ saldo: accountFound.saldo });

    } catch (error) {
        return res.status(500).json({ error });
    }
}

const statement = (req, res) => {
    try {
        const id = req.query.numero_conta;
        const accountFound = findAccount(Number(id));
        if (!accountFound) {
            return res.status(400).json({ mensagem: "Conta bancária não encontada!" })
        }

        const deposits = data.depositos.filter((deposit) => deposit.numero_conta === id);
        const withdrawals = data.saques.filter((withdraw) => withdraw.numero_conta === id);
        const sentTransfers = data.transferencias.filter((transfer) => transfer.numero_conta_origem === id);
        const receivedTransfers = data.transferencias.filter((transfer) => transfer.numero_conta_destino === id);

        const accountStatement = {
            depositos: deposits,
            saques: withdrawals,
            transferenciasEnviadas: sentTransfers,
            transferenciasRecebidas: receivedTransfers
        }

        return res.status(200).json(accountStatement);
    } catch (error) {
        return res.status(500).json(error);
    }

}

module.exports = {
    deposit,
    withdraw,
    transfer,
    balance,
    statement
}