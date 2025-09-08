# Carisma Connect (Firebase Studio)

Este é um projeto Next.js gerado pelo Firebase Studio.

## Como Rodar o Projeto Localmente

Para ver e interagir com sua aplicação, você precisa iniciar o servidor de desenvolvimento.

**1. Instale as dependências (faça isso apenas uma vez):**
```bash
npm install
```

**2. Execute o servidor:**
```bash
npm run dev
```

Após executar o comando, o terminal mostrará uma mensagem indicando que o servidor está rodando. **Acesse a aplicação no seu navegador através do endereço:**

[http://localhost:9002](http://localhost:9002)

---

## Como Enviar para o GitHub

Use estes comandos para sincronizar suas alterações com o GitHub.

### Para a Primeira Vez (com um novo repositório)

**1. Inicialize o Git (se ainda não fez):**
```bash
git init -b main
```

**2. Adicione a URL do seu repositório:**
```bash
# Substitua pela URL do seu novo repositório
git remote add origin https://github.com/your-user/your-new-repository.git
```

**3. Adicione, confirme e envie seus arquivos:**
```bash
git add .
git commit -m "Commit inicial"
git push -u origin main
```

### Para o Dia a Dia

Depois da primeira configuração, use apenas estes comandos:
```bash
git add .
git commit -m "Sua mensagem de alteração"
git pull origin main --rebase
git push
```

### Solução de Problemas Comuns

**"remote origin already exists"**
Se você receber este erro, significa que já existe uma conexão. Use o comando abaixo para atualizá-la para o novo repositório:
```bash
git remote set-url origin URL_DO_NOVO_REPOSITORIO
```

**"[rejected] (fetch first) ou (non-fast-forward)"**
Isso acontece quando o histórico do GitHub e o seu estão dessincronizados. Para resolver:
```bash
git pull origin main --rebase
git push
```
Se isso não funcionar em um repositório novo, o `push` forçado pode ser necessário (use com cuidado):
```bash
git push --force origin main
```
