# Cubos Bank
Este projeto é uma implementação backend de uma API REST bancária para o curso de formação Full Stack da [Cubos Academy](https://cubos.academy)

O projeto está estruturado com 9 endpoints para o gerenciameto de contas e transações bancárias 

<br>

## Configuração
1. Clone o repositório
2. Realize a instalação do [nodemon]([https://www.google.com](https://www.npmjs.com/package/nodemon))
3. Execute o comando "npm run dev"

<br>

## Endpoints de conta <br>
```
./src/controller/account
```

`GET /contas` Retorna um JSON com todas as contas criadas.

Query **?senha_banco**: obrigatória para validação da senha do banco

---

`POST /contas` Realiza a criação de uma nova conta.

**Payload:** <br>
``` json
{
	"nome": "Etore",
	"cpf": "12345678900",
	"data_nascimento": "2021-03-15",
	"telefone": "48999990000",
	"email": "etore@email.com",
	"senha": "123"
}
```

---

`PUT /contas/:numeroConta/usuario` Atualiza os dados do usuário de uma conta.

**Payload:** <br>
``` json
{
	"nome": "Etore",
	"cpf": "12345678900",
	"data_nascimento": "2021-03-15",
	"telefone": "48999990000",
	"email": "etore@email.com",
	"senha": "123"
}
```

---

`DELETE /contas/:numeroConta` Realiza a exclusão de uma conta.

<br>

## Endpoints de transação <br>
```
./src/controller/transaction
```

`POST /transacoes/depositar` Realiza um depósito na conta especificada.<br>
O valor deve ser especificado em centavos.

**Payload:** <br>
``` json
{
	"numero_conta": "0",
	"valor": 111
}
```

---

`POST /transacoes/sacar` Realiza um saque na conta especificada.<br>
O valor deve ser especificado em centavos.

**Payload:** <br>
``` json
{
	"numero_conta": "0",
	"valor": 111,
	"senha": "123"
}
```

---

`POST /transacoes/transferir` Realiza uma tranferência entre as contas especificadas.<br>
O valor deve ser especificado em centavos.

**Payload:** <br>
``` json
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "0",
	"valor": 111,
	"senha": "123"
}
```

---

`GET /contas/saldo` Verifica o saldo da conta especificada.

Query **?numero_conta**: obrigatória para buscar a conta desejada
<br>
Query **?senha**: obrigatória para validação da senha da conta

---

`GET /contas/extrato` Verifica o extrato completo da conta especificada.

Query **?numero_conta**: obrigatória para buscar a conta desejada
<br>
Query **?senha**: obrigatória para validação da senha da conta
