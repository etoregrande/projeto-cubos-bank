const fs = require('fs/promises');
const z = require('zod');

const data = require('../database.json');
const { findAccount } = require('../scripts/scripts');

const verifyBankPassword = (req, res, next) => {
    const password = req.query.senha_banco;

    try {
        if (!password) {
            return res.status(401).send('Insira a senha do banco');
        }
        if (password !== data.banco.senha) {
            return res.status(401).send('A senha do banco informada é inválida!');
        }

        next();

    } catch (error) {
        return res.status(500).json({ error });
    }
}

const verifyAccountPassword = (req, res, next) => {
    const id = req.params.numeroConta ??
        req.body.numero_conta ??
        req.body.numero_conta_origem ??
        req.query.numero_conta;

    try {
        const accountFound = findAccount(Number(id));
        if (!accountFound || id === "") {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        const account = data.contas.find((account) => account.numero === Number(id));
        const password = req.body.senha
            ?? req.params.senha
            ?? req.query.senha;

        try {
            const validatePassword = z.string();
            validatePassword.parse(password)

        } catch (error) {
            return res.status(401).json({ error });
        }

        if (account.usuario.senha !== password) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        next()

    } catch (error) {
        return res.status(500).json({ error });
    }


}

module.exports = {
    verifyBankPassword,
    verifyAccountPassword
}