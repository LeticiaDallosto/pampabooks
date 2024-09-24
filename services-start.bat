@echo off
echo Iniciando a execucao dos microservicos e da aplicacao principal
cd users
echo Iniciando o microservico de usuarios
start cmd /k "npm start"
cd ..catalog
echo Iniciando o microservico de catalogo
start cmd /k "npm start"
cd ..\orders
echo Iniciando o microservico de pedidos
start cmd /k "npm start"
cd ..
echo Todos os servicos foram iniciados em janelas separadas
pause
