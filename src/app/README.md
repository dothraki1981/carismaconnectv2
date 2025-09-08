# Firebase Studio

Este é um projeto Next.js no Firebase Studio.

---

## Como Enviar para um **Novo** Repositório no GitHub

Siga estes passos para conectar e enviar seu projeto para um repositório recém-criado no GitHub.

### Passo 1: Inicialize o Repositório Local
Este comando prepara sua pasta de projeto para o Git.
```bash
git init -b main
```

### Passo 2: Adicione Todos os Arquivos
Este comando adiciona todos os seus arquivos ao controle do Git.
```bash
git add .
```

### Passo 3: Salve Suas Alterações (Commit)
Este comando salva suas alterações com uma mensagem.
```bash
git commit -m "Commit inicial do projeto"
```

### Passo 4: Conecte ao Repositório do GitHub
**Importante:** Substitua a URL abaixo pela URL do seu **novo** repositório no GitHub.
```bash
git remote add origin https://github.com/seu-usuario/seu-novo-repositorio.git
```

### Passo 5: Envie o Código e Configure o Rastreamento
Este é o comando final e mais importante. Ele envia seus arquivos e cria a conexão permanente entre seu computador e o GitHub.
```bash
git push --set-upstream origin main
```
---

### Para Atualizações do Dia a Dia

Após a configuração inicial, use apenas estes três comandos para enviar novas alterações:

1.  **Preparar as alterações:** `git add .`
2.  **Salvar as alterações:** `git commit -m "Descreva suas alterações aqui"`
3.  **Enviar para o GitHub:** `git push`

---

## Solução de Problemas Comuns

### Erro 1: `remote origin already exists`

**O que significa:** Você tentou conectar (`add`) seu projeto a um repositório, mas ele já está conectado a outro.

**Como resolver:** Em vez de adicionar, **atualize** a URL do `origin` existente com o comando `set-url`.

```bash
# Substitua pela URL do seu NOVO repositório
git remote set-url origin https://github.com/seu-usuario/seu-novo-repositorio.git
```
Depois disso, você pode tentar o `git push` novamente.

### Erro 2: `[rejected] (fetch first)` ou `(non-fast-forward)`

**O que significa:** O repositório no GitHub tem alterações (como um README inicial) que seu computador não tem. Você precisa baixar essas alterações antes de poder enviar as suas.

**Como resolver:** Use `git pull --rebase` para baixar as alterações remotas e colocar as suas por cima.

```bash
# 1. Puxe as alterações do GitHub
git pull origin main --rebase

# 2. Agora envie suas alterações
git push
```