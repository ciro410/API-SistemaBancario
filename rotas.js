const express = require("express");
const { listarContas, criarConta, atualizarUsuario, deletarUsuario, exibirSaldo, exibirExtrato } = require("./src/controladores/contas");
const { depositar, sacar, transferir } = require("./src/controladores/transacoes");

const roteador = express();

roteador.get('/contas', listarContas);
roteador.post('/contas', criarConta);
roteador.put('/contas/:numeroConta/usuario', atualizarUsuario);
roteador.delete('/contas/:numeroConta', deletarUsuario);
roteador.post('/transacoes/depositar', depositar);
roteador.post('/transacoes/sacar', sacar);
roteador.post('/transacoes/transferir', transferir);
roteador.get('/contas/saldo', exibirSaldo);
roteador.get('/contas/extrato', exibirExtrato)




module.exports = {
    roteador
}                           