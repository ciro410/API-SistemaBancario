const {contas} = require('../bancodedados') 

function validações(conta) {
    const cpfVerificado = contas.some((x => x.usuario.cpf === conta.cpf));
    const emailVerificado = contas.some((x => x.usuario.email === conta.email));
    if (cpfVerificado) {
        return { erro: "Cpf informado já existe, por favor insira um cfp válido" }
    }
    if (emailVerificado) {
        return { erro: "Email informado já existe, por favor insira um e-mail válido" }
    }
    if (!conta.nome) {
        return { erro: "O campo nome precisa ser preenchido" }
    }
    if (!conta.cpf) {
        return { erro: "O campo cpf precisa ser preenchido" }
    }
    if (!conta.data_nascimento) {
        return { erro: "O campo data de nascimento precisa ser preenchido" }
    }
    if (!conta.email) {
        return { erro: "O campo email precisa ser preenchido" }
    }
    if (!conta.senha) {
        return { erro: "O campo senha precisa ser preenchido" }
    }


}

function validacoesDeTransacoes(transacao) {
    if (!transacao.numero_conta) {
        return { erro: "Por favor, preencha o campo numero da conta" }
    }
    if (transacao.valor === undefined) {
        return { erro: "Por favor, preencha o campo valor" }
    }
    if (transacao.valor <= 0) {
        return { erro: "Impossível realizar saques ou depósitos de 0 reais" }
    }
}

module.exports = {
    validacoesDeTransacoes,
    validações
}