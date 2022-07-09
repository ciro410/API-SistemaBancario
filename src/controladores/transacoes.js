const { banco, contas, saques, depositos, transferencias } = require('../bancodedados');
const { validacoesDeTransacoes } = require('./validacoes');
const {format} = require('date-fns');

function depositar(req, res) {
    const erro = validacoesDeTransacoes(req.body);
    if (erro) {
        res.status(400);
        res.json(erro);
    } else {
        const conta = contas.find((conta) => conta.numero === req.body.numero_conta);
        if (!conta) {
            res.status(400)
            res.json({ erro: "Não existe conta para o número informado, preencha um número válido" })
        }

        conta.saldo += req.body.valor;

        depositos.push({
            data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            numero_conta: req.body.numero_conta,
            valor: req.body.valor
        })

        res.status(200)
        res.json({ mensagem: "Depósito realizado com sucesso" })
    }

}

function sacar(req, res) {
    const erro = validacoesDeTransacoes(req.body);
    if (erro) {
        res.status(400);
        res.json(erro)
    } else {
        const conta = contas.find((conta) => conta.numero === req.body.numero_conta);
        if (!conta) {
            res.status(400)
            res.json({ erro: "Não existe conta para o número informado, preencha um número válido" })
        }

        if (req.body.senha !== conta.usuario.senha) {
            res.status(401);
            res.json({ erro: "Senha Incorreta" })
        }
        if (conta.saldo < req.body.valor) {
            res.status(400)
            res.json({ erro: "Não há saldo suficiente para realizar saque" })
        } else {
            conta.saldo -= req.body.valor;

            saques.push({
                data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                numero_conta: req.body.numero_conta,
                valor: req.body.valor
            })

            res.status(200)
            res.json({ mensagem: "Saque realizado com sucesso" })
        }


    }

}

function transferir(req, res) {
    if (!req.body.numero_conta_origem) {
        res.status(400);
        res.json({ erro: "Por favor preencha o campo numero da conta de origem" })
    }
    if (!req.body.numero_conta_destino) {
        res.status(400);
        res.json({ erro: "Por favor preencha o campo numero da conta de destino" })
    }
    if (!req.body.valor) {
        res.status(400);
        res.json({ erro: "Por favor preencha o campo valor" })
    }
    if (!req.body.senha) {
        res.status(400);
        res.json({ erro: "Por favor preencha o campo senha" })
    }
    let contaOrigem = contas.find((conta) => conta.numero === req.body.numero_conta_origem);
    let contaDestino = contas.find((conta) => conta.numero === req.body.numero_conta_destino);
    if (!contaOrigem || !contaDestino) {
        res.status(400)
        res.json({ erro: "Não existe conta para o número informado, preencha um número válido" })
    }

    if (req.body.senha !== contaOrigem.usuario.senha) {
        res.status(401);
        res.json({ erro: "Senha Incorreta" })
    }

    if (contaOrigem.saldo < req.body.valor) {
        res.status(400)
        res.json({ erro: "Não há saldo suficiente para realizar transferência" })
    } else {
        contaDestino.saldo += req.body.valor;
        contaOrigem.saldo -= req.body.valor;

        transferencias.push({
                    data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    numero_conta_origem: req.body.numero_conta_origem,
                    numero_conta_destino: req.body.numero_conta_destino,
                    valor: req.body.valor
                })

        res.status(200);
        res.json({ mensagem: "Transferência realizada com sucesso" })


    }
}

module.exports = {
    sacar,
    depositar,
    transferir
}