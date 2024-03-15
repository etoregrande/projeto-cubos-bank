const express = require('express');

const { listAccounts, createAccount, updateAccount, deleteAccount } = require('../controller/account');
const { deposit, withdraw, transfer, balance, statement } = require('../controller/transaction');
const { verifyBankPassword, verifyAccountPassword } = require('../middleware/middleware');

const routes = express();

routes.get('/contas', verifyBankPassword, listAccounts);
routes.post('/contas', createAccount);
routes.put('/contas/:numeroConta/usuario', updateAccount);
routes.delete('/contas/:numeroConta', deleteAccount);

routes.post('/transacoes/depositar', deposit);
routes.post('/transacoes/sacar', verifyAccountPassword, withdraw);
routes.post('/transacoes/transferir', verifyAccountPassword, transfer);
routes.get('/contas/saldo', verifyAccountPassword, balance);
routes.get('/contas/extrato', verifyAccountPassword, statement)

module.exports = routes;