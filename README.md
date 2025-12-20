<h1>
  ConGa API
  <img src="./src//financial-report//templates//logo-conga.png" alt="Logo do projeto" width="23" />
</h1>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Nest](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Puppeteer](https://img.shields.io/badge/Puppeteer-%2340B5A4.svg?style=for-the-badge&logo=Puppeteer&logoColor=black) ![Handlebars](https://img.shields.io/badge/Handlebars-%23000000?style=for-the-badge&logo=Handlebars.js&logoColor=white)

Backend desenvolvido para o ConGa, um software desktop especializado para pequenos e médios produtores de leite, com o objetivo de otimizar o gerenciamento de despesas e da produção de leite, automatizar o controle de receitas e cálculos financeiros e viabilizar a geração de relatórios para apoio à tomada de decisão.

## INSTRUÇÕES DE INSTALAÇÃO

### Pré-requisitos

[![Node version](https://img.shields.io/badge/node-v20.17.0-blue.svg)](https://shields.io/)
[![Npm version](https://img.shields.io/badge/npm-11.6.2-blue.svg)](https://shields.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue.svg)](https://shields.io/)

### Etapas

```bash
git clone https://github.com/Lipez-x/api-conga.git
cd api-conga
```

#### 2. Instale as depêndencias

```bash
npm install
```

#### 3. Configure variáveis de ambiente

Crie um um arquivo `.env` e adicione as variáveis conforme necessário. Aqui está um exemplo de como configurar essas variáveis:

###### .env

```ts
// Configurações do banco de dados
DB_HOST=db_host
DB_PORT=db_port
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=conga_database

// Configurações de JWT
JWT_SECRET = jwt_secret
ACCESS_TOKEN_EXPIRE=1d

// Configurações de login
LOGIN_ATTEMPT_LIMIT = 1
LOGIN_ATTEMPT_PERIOD = 1

// Senha padrão de usuário
DEFAULT_PASSWORD=default_password
```

#### 4. Rode as migrations

```bash
npm run migration:run
```

#### 5. Execução

```bash
npm run start:dev
```
