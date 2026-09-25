# AUDITORIA — Painel NEPE

Data de referência: **25/09/2026**

## Bases
- Linhas brutas nas cinco bases: **56.863**
- Duplicidades exatas removidas: **884**
- Registros consolidados: **55.979**
- Pessoas distintas por nome normalizado: **2.899**
- Certificados na base de códigos: **41.238**
- Códigos preenchidos: **41.238**
- Códigos únicos: **41.238**
- Datas de emissão duplicadas entre as duas colunas da base: **sim**
- Avaliações de reação: **5.587**

## Regra de certificação implementada
- **SACDC:** tratado como registro de certificação.
- **Registros - PE (HC-UFPE):** tratado como registro de certificação.
- **Cursos Livres:** participação/registro; não presumimos conclusão.
- **Obrigatórios:** participação/registro; não presumimos conclusão.
- **A Distância:** natureza indeterminada até validação da fonte.
- **Base Certificados NEPE:** o código comprova certificado emitido para a pessoa. mas não é ligado automaticamente a um curso porque a base não contém essa chave.

## Funcionalidades implementadas
- Pesquisa nominal parcial. sem diferenciar acentos/maiúsculas.
- Filtro por vínculo.
- Pesquisa por Processo SEI completo ou parcial.
- Filtro por ano.
- Pesquisa por curso/capacitação.
- Filtro por grupo/base.
- Combinação simultânea dos filtros.
- Consulta separada por código de certificado.
- Exportação Excel do recorte filtrado.
- Captura PNG do painel.
- Avaliação de reação integrada.

## Controle metodológico
A aplicação **não chama todos os registros de cursos concluídos** e **não associa um código de certificado a um curso sem evidência na fonte**.


## Regra revisada — 25/09/2026
- O indicador **Certificados emitidos** é calculado exclusivamente a partir da **Base de Certificados HC-UFPE/NEPE**.
- A categoria dos certificados também é obtida dessa mesma base.
- A aplicação informa explicitamente a fonte desse indicador.
- Na consulta nominal, registros de **SACDC** e **Registros - PE (HC-UFPE)** são apresentados como **Curso finalizado**.
- Registros das demais bases são apresentados como **Pode incluir curso em andamento ou finalizado**.
- O código de certificado não é associado automaticamente a um curso, pois a base de certificados não contém essa chave de relação.
- **Instituição** não é utilizada como filtro, pois o universo do painel é HC-UFPE.

## Alterações funcionais — revisão solicitada
- Visão Geral: indicador renomeado para **Participações (cursos concluídos ou em andamento)**.
- Visão Geral: indicador renomeado para **Certificados localizados por códigos**, com fonte explícita na Base de Certificados HC-UFPE/NEPE.
- Cursos e Participantes: incluído campo pesquisável/selecionável de trabalhador, além da pesquisa livre.
- Cursos e Participantes: incluída nota de que a data do SACDC corresponde à data de importação para o 3EC, não necessariamente à realização da capacitação.
- Avaliação de Reação: incluído campo pesquisável/selecionável por título da capacitação.
- Avaliação de Reação: gráfico de satisfação geral reduzido e área de respostas às questões ampliada.
- Avaliação de Reação: respostas da capacitação e do instrutor apresentadas em gráficos percentuais empilhados.
- Avaliação de Reação: clique em uma nota de satisfação geral filtra KPIs, questões e comentários; novo clique na mesma nota remove o filtro.


## Nota metodológica — SACDC e vínculo em 2023
- Os registros do SACDC foram importados para o 3EC em 2023; a data da base corresponde à importação/cadastro e não necessariamente à realização da capacitação.
- A importação apresenta forte predominância da classificação de vínculo **Empregado**.
- Por esse motivo, os vínculos do SACDC não devem ser interpretados como retrato da composição da força de trabalho do HC-UFPE em 2023.
- O gráfico foi renomeado para **Participantes distintos por vínculo registrado** e recebeu alerta metodológico específico para 2023.


## Ajuste — Avaliação de Reação
- A barra geral com Nome, Vínculo, Processo SEI, Ano, Curso e Grupo é ocultada integralmente na aba Avaliação de Reação.
- Permanece apenas a seleção pesquisável da capacitação por título.
- Texto da área: “Avaliação de reação dos cursos emitidos pelo NEPE”.
- O campo Nome não é utilizado na Avaliação de Reação.
