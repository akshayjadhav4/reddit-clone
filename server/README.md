# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

## DB

login: psql -U postgres
list DB: \l
switch DB : \c db_name

## Migration

npm run typeorm migration:generate -- --name create-comments-table
npm run typeorm migration:run
npm run typeorm migration:revert
