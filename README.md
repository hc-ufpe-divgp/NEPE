# Painel NEPE — Avaliação de Reação

Aplicação web estática para disponibilizar os resultados da avaliação de reação das ações de capacitação do HC-UFPE/Ebserh.

## Publicação no GitHub Pages
1. Crie um repositório e envie **o conteúdo desta pasta** para a raiz do repositório.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)` e salve.

## Atualização dos dados
O painel lê `dados/dados_painel.json`. A planilha Excel original **não deve ser publicada**, pois contém colunas como Email e Nome.

Para atualizar o painel com uma nova planilha, gere novamente o JSON anonimizado mantendo a mesma estrutura. A aplicação usa apenas: ano, capacitação, respostas às perguntas, satisfação, comentário positivo e ponto de melhoria.

## Segurança
GitHub Pages não é uma área privada. Tudo que estiver no repositório/site público deve ser tratado como público. O arquivo incluído nesta versão não contém as colunas Email, Nome, ID ou horários individuais.
