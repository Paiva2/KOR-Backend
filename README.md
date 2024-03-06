# Teste Técnico Backend Node.js - Desenvolvedor Júnior na Kor Solutions

Olá e seja bem-vindo ao teste técnico para a vaga de desenvolvedor backend junior na Kor Solutions!

## Desafio

Neste desafio, você terá a oportunidade de demonstrar suas habilidades na criação de uma API RESTful em Node.js com TypeScript. Utilizando o nosso Modelo de Entidade Relacionamento (MER) como referência, sua tarefa é implementar endpoints para gerenciar processos legais e participantes associados a eles.

Fique à vontade para utilizar os frameworks e bibliotecas que considerar mais adequados para este projeto.

Você pode consultar o modelo com mais detalhes [aqui](https://dbdiagram.io/d/dev-test-backend-node-jr-65e0e3cccd45b569fb3e18b4).

### Endpoints da API:

1.  Endpoints do CRUD de processo:

    - `POST /processo`: Criar um novo processo
    - `GET /processo/:id`: Obter detalhes de um processo específico
    - `PUT /processo/:id`: Atualizar os detalhes de um processo específico
    - `DELETE /processo/:id`: Excluir um processo específico

2.  Endpoint de listagem de processos com filtro por cliente e/ou participante:

    - `GET /processos`: Listar todos os processos, com a capacidade de filtrar por cliente e/ou participante

3.  Endpoint de listagem de participantes de um processo:

    - `GET /processo/:id/participantes`: Listar todos os participantes de um processo específico

## Tecnologias utilizadas

- TypeScript
- Express
- Postgres
- Docker

## Como instalar e rodar localmente

### Necessário node >= 18

Vou disponibilizar o .env para facilitar a utilização, por padrão a porta é a 8081.

A doc da api está em: /docs/#/

```
bash

$ git clone https://github.com/Paiva2/KOR-Backend.git

$ cd ./

$ npm install

$ docker compose up -d

$ npm run dev

```

## To run unit tests

```
bash

$ cd ./

$ npm install

$ npm run test or npm run test:watch

```

## Fluxo de funcionalidades

1 - Registrar um cliente;

2 - Autenticar como um cliente;

3 - Inserir o token de autenticação do cliente nos header de Authorization;

4 - Criar um processo utilizando o token;

5 - Registrar um novo participante no sistema;

6 - Inserir um dos participantes do sistema em um processo
