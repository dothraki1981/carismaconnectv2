# Firebase Studio

Este é um NextJS starter no Firebase Studio.

Para começar, dê uma olhada em `src/app/page.tsx`.

---

## Como Gerenciar seu Código no GitHub

### Para Atualizações do Dia a Dia

Use os seguintes comandos para salvar e enviar suas alterações para o GitHub.

**1. Preparar todas as suas alterações**
```bash
git add .
```

**2. Salvar suas alterações (Commit)**
Use uma mensagem que descreva o que você mudou.
```bash
git commit -m "Descreva as alterações que você fez aqui"
```

**3. Enviar as alterações para o GitHub**
```bash
git push
```

---

### Para a Primeira Vez (Configuração Inicial)

Use estes passos apenas se estiver configurando o repositório pela primeira vez.

**1. Iniciar o repositório local**
```bash
git init -b main
```

**2. Conectar seu repositório local ao GitHub**
**Importante:** Crie um novo repositório no GitHub primeiro e substitua a URL abaixo.
```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
```

**3. Enviar o código e conectar a branch**
Este comando envia seu código e também conecta sua branch local `main` com a branch remota `main` no GitHub. **Você só precisa usar o `-u` na primeira vez.**
```bash
git push -u origin main
```

---

### Solução de Problemas Comuns

**Erro: `remote origin already exists`**
*   **O que significa:** Você já conectou um repositório remoto.
*   **Solução:** Se você quer **mudar** a URL (apontar para um novo repositório), use:
    ```bash
    git remote set-url origin https://github.com/seu-usuario/novo-repositorio.git
    ```

**Erro: `rejected (non-fast-forward)` ou `(fetch first)`**
*   **O que significa:** O repositório no GitHub tem alterações que seu computador não tem.
*   **Solução:** Primeiro puxe as alterações do GitHub e depois envie as suas.
    ```bash
    git pull origin main --rebase
    git push
    ```

**Erro: `fatal: Need to specify how to reconcile divergent branches`**
*   **O que significa:** O Git quer que você decida como combinar as alterações.
*   **Solução Momentânea:** Use o comando de pull com a estratégia definida:
    ```bash
    git pull origin main --rebase
    ```
*   **Solução Permanente:** Configure o Git para sempre usar `rebase` (recomendado):
    ```bash
    git config --global pull.rebase true
    ```
