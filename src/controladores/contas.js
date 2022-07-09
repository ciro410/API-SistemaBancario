const fs = require('fs');
const { banco, contas, saques, depositos, transferencias, salvarContas } = require('../bancodedados');
const { validações } = require('./validacoes');


let proximoNumero = contas.length + 1;

function listarContas(req, res) {
    if (req.query.senha_banco === 'Cubos123Bank') {
        res.json(contas)
    } else {
        res.status(401);
        res.json({ erro: 'Senha Incorreta' })
    }

}


function criarConta(req, res) {
    const erro = validações(req.body)
    if (erro) {
        res.status(400)
        res.json(erro)
    } else {
        const novaConta = {
            numero: proximoNumero++,
            saldo: 0,
            usuario: {
                nome: req.body.nome,
                cpf: req.body.cpf,
                data_nascimento: req.body.data_nascimento,
                telefone: req.body.telefone,
                email: req.body.email,
                senha: req.body.senha
            }
        }

        contas.push(novaConta)
        res.status(200)
        res.json({ mensagem: "Conta Criada com sucesso" })
    }

}

function atualizarUsuario(req, res) {
    const numeroConta = Number(req.params.numeroConta);
    const conta = contas.find((conta) => conta.numero === numeroConta);
    if (!conta) {
        res.status(400)
        res.json({ erro: "Não existe conta para o número informado, preencha um número válido" })
    }
    const erro = validações(req.body)
    if (erro) {
        res.status(400)
        res.json(erro)
    } else {
        conta.usuario.nome = req.body.nome;
        conta.usuario.cpf = req.body.cpf;
        conta.usuario.data_nascimento = req.body.data_nascimento;
        conta.usuario.email = req.body.email;
        conta.usuario.senha = req.body.senha;

        res.status(200);
        res.json("Usuário Atualizado com sucesso")

    }



}

function deletarUsuario(req, res) {
    const numeroConta = Number(req.params.numeroConta);
    const conta = contas.find((conta) => conta.numero === numeroConta);
    if (!conta) {
        res.status(400)
        res.json({ erro: "Não existe conta para o número informado, preencha um número válido" })
    }
    if (conta.saldo !== 0) {
        res.status(400);
        res.json({ erro: "Não é possível excluir uma conta com saldo diferente de 0" })
    }

    const indice = contas.indexOf(conta);
    contas.splice(indice, 1);
    res.status(200);
    res.json({ mensagem: "Usuário deletado com sucesso" });

}

function exibirSaldo(req, res) {
    const numeroConta = Number(req.query.numero_conta)
    const senha = req.query.senha;
    console.log(numeroConta)

    if (!numeroConta) {
        res.status(400);
        res.json({ erro: "É necessário inserir um numero de conta válido" })
    }
    if (!senha) {
        res.status(400);
        res.json({ erro: "Senha inválida" })
    }

    const conta = contas.find((conta) => conta.numero === numeroConta);
    console.log(conta)
    if (!conta) {
        res.status(400);
        res.json({ erro: "Não existe conta com esse número" })
    }

    if (!senha === conta.usuario.senha) {
        res.status(400);
        res.json({ erro: "A senha está incorreta" })
    } else {
        res.status(200);
        res.json({ 'saldo': conta.saldo })
    }

}

function exibirExtrato(req, res) {
    const numeroConta = Number(req.query.numero_conta)
    const senha = req.query.senha;

    if (!numeroConta) {
        res.status(400);
        res.json({ erro: "É necessário inserir um numero de conta válido" })
    }
    if (!senha) {
        res.status(400);
        res.json({ erro: "Senha inválida" })
    }

    const conta = contas.find((conta) => conta.numero === numeroConta);
    console.log(conta)
    if (!conta) {
        res.status(400);
        res.json({ erro: "Não existe conta com esse número" })
    }

    if (senha !== conta.usuario.senha) {
        res.status(400);
        res.json({ erro: "A senha está incorreta" })
    } else {
        const extratoDepositos = depositos.filter((deposito)=> Number(deposito.numero_conta) === numeroConta);
        const extratoSaques = saques.filter((saque)=> Number(saque.numero_conta) === numeroConta);
        const transferenciasEnviadas = transferencias.filter(transferencia => Number(transferencia.numero_conta_origem) === numeroConta);
        const transferenciasRecebidas = transferencias.filter(transferencia => Number(transferencia.numero_conta_destino) === numeroConta);

        res.status(200);
        res.json({ 
            depositos: extratoDepositos,
            saques: extratoSaques,
            transferenciasEnviadas,
            transferenciasRecebidas
                        
        })
    }
}


module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarUsuario,
    exibirSaldo,
    exibirExtrato
}