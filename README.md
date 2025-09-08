# Carisma Connect (Firebase Studio)

Este é um projeto Next.js gerado pelo Firebase Studio.

**Nota Importante sobre o Fluxo de Trabalho:** As alterações de código que o assistente de IA faz são aplicadas **localmente** no seu ambiente do Firebase Studio. Para que essas alterações sejam salvas no seu repositório e publicadas na sua URL do Firebase, você precisa **manualmente** executar os comandos `git add`, `git commit` e `git push` no seu terminal.

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

## Como Enviar Atualizações para o GitHub (Dia a Dia)

Depois que a conexão inicial com o GitHub foi configurada, use estes três comandos simples para enviar suas atualizações:

**1. Adicione todos os arquivos modificados:**
```bash
git add .
```

**2. Crie um "pacote" de alterações com uma mensagem descritiva:**
```bash
git commit -m "Sua mensagem descrevendo a alteração"
```
*(Ex: `git commit -m "Conecta tela de professores ao Firebase"`)*

**3. Envie o pacote para o GitHub:**
```bash
git push
```
É só isso! Como a conexão já foi estabelecida, o Git sabe exatamente para onde enviar seu código.

---

## Como Publicar no Firebase (Obter URL Pública)

Para que seu projeto tenha uma URL pública e acessível a todos, você precisa publicá-lo usando o **Firebase App Hosting**. O processo é automatizado através do seu repositório no GitHub.

**O que você precisa:**
1.  Um projeto Firebase.
2.  Um repositório no GitHub com o código do seu projeto.

**Passos:**

1.  **Acesse o Console do Firebase:**
    *   Vá para o [Console do Firebase](https://console.firebase.google.com/).
    *   Selecione o seu projeto (ou crie um novo).

2.  **Vá para o App Hosting:**
    *   No menu lateral, clique em **Build** e depois em **App Hosting**.

3.  **Crie um "Backend":**
    *   Clique em **"Começar"** e siga as instruções para criar um novo backend.
    *   O Firebase pedirá para você conectar sua conta do GitHub.
    *   Selecione o repositório do seu projeto (`carismaconnectv2` ou o nome que você usou).

4.  **Configure o Deploy:**
    *   **Região:** Escolha uma perto de você (ex: `us-central1`).
    *   **Branch de Produção:** Deixe como `main`.

5.  **Finalize:**
    *   Clique em **"Concluir e implantar"**.

Após alguns minutos, o Firebase irá construir seu projeto e te dará uma URL pública (algo como `seu-projeto.web.app`). A partir de agora, toda vez que você fizer um `git push` para a branch `main`, o Firebase irá atualizar seu site automaticamente.

---

## Solução de Problemas Comuns e Comandos Iniciais

Esta seção é principalmente para a **primeira vez** que você conecta o projeto a um repositório novo.

#### Erro: `remote origin already exists`
Se você receber este erro, significa que já existe uma conexão. Use o comando abaixo para atualizá-la para o novo repositório:
```bash
git remote set-url origin URL_DO_NOVO_REPOSITORIO
```

#### Erro: `[rejected] (fetch first)` ou `(non-fast-forward)`
Isso acontece quando o histórico do GitHub e o seu estão dessincronizados. Para resolver, puxe as alterações do GitHub primeiro e depois envie as suas:
```bash
git pull origin main --rebase
git push
```

#### Erro: `The current branch main has no upstream branch`
Este erro ocorre na primeira vez que você envia o código. O Git precisa que você confirme para onde a sua branch `main` deve apontar.
```bash
git push --set-upstream origin main
```
Depois de executar este comando uma vez, você poderá usar apenas `git push` nas próximas vezes.
