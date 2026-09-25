# Auditoria — Painel de Capacitações NEPE
**Referência das bases: 25/09/2026**

## 1. Bases conferidas
Foram consolidadas as cinco bases de capacitação fornecidas: Cursos Livres, SACDC, Obrigatórios, A Distância e Registros - PE (HC-UFPE), além da base de Certificados NEPE e da base de Avaliação de Reação.

## 2. Integridade da consolidação
- ✓ 56.863 linhas brutas nas cinco bases de capacitação.
- ✓ 884 duplicidades exatas identificadas e removidas usando os sete campos originais em conjunto.
- ✓ 55.979 participações permanecem na base consolidada.
- ✓ 2.899 nomes distintos após normalização apenas para contagem (acentos/caixa não diferenciam a busca).
- ✓ 41.238 registros na base de certificados.
- ✓ 41.238 códigos de certificado preenchidos e distintos.
- ✓ A aplicação preserva o nome original, curso, data, categoria original, instituição, vínculo e Processo SEI das bases de capacitação.
- ✓ A aplicação preserva nome, data de emissão, categoria, instituição, vínculo e código da base de certificados.

## 3. Auditoria dos filtros solicitados
- ✓ Nome: pesquisa parcial, sem diferenciar maiúsculas/minúsculas ou acentos.
- ✓ Vínculo: seleção pelos valores efetivamente existentes nas bases.
- ✓ Processo SEI: pesquisa pelo número completo ou por trecho.
- ✓ Ano: botões gerados a partir dos anos existentes nas bases.
- ✓ Curso/capacitação: pesquisa parcial pelo título.
- ✓ Filtros de nome, vínculo, processo, ano, grupo/base e curso podem ser combinados nas participações.
- ✓ Teste combinado realizado com registro de 2026 + vínculo + parte do nome + parte do Processo SEI retornou o registro esperado.

## 4. Certificados — limitação documental importante
⚠ A planilha `Certificados NEPE - Todos - por nome do empregado(2).csv` NÃO contém o título do curso nem o Nº do Processo SEI. Portanto, o painel não associa um código de certificado a um curso/processo específico por inferência.

Na tabela de certificados, são aplicados apenas os filtros que a própria base de certificados sustenta diretamente: ano, vínculo e nome. O código é exibido como código. O CSV fornecido não contém uma URL de destino separada; por isso o sistema não inventa um link.

## 5. Grupo/base x categoria
⚠ Para evitar classificação enganosa, o filtro principal usa o **grupo/base de origem**: Cursos livres, SACDC, Obrigatórios, A distância e Registros - PE. A `Nome da categoria` original continua preservada e aparece na tabela/exportação.

## 6. Definições dos indicadores
- **Participação:** uma linha consolidada após remoção das duplicidades exatas.
- **Participante único:** nome normalizado. Limitação: homônimos podem ser contados como uma pessoa e variações substanciais do mesmo nome podem ser contadas separadamente, pois as bases não trazem identificador funcional único.
- **Curso distinto:** combinação de ano + título normalizado do curso. Isso não equivale necessariamente a “edição/turma” quando o mesmo título ocorre mais de uma vez no ano.
- **Certificado:** um registro da base de certificados.

## 7. Exportação e apresentação
- ✓ Excel da área Cursos e Participantes inclui nomes e todos os registros filtrados de participações e certificados em abas separadas.
- ✓ Excel inclui Processo SEI nas participações e código na aba Certificados.
- ✓ A tabela em tela limita a exibição a 1.000 linhas por desempenho, mas o Excel exporta todas as linhas filtradas.
- ✓ Botão de imagem captura a área atual do painel.

## 8. Pontos de atenção para homologação
⚠ A pesquisa nominal está disponível conforme decisão do projeto. Como a aplicação é estática, os dados nominais ficam presentes nos arquivos JSON publicados junto ao site.

⚠ Não foi criada correspondência artificial entre certificado e curso/processo. Para disponibilizar “Abrir certificado”, será necessária uma fonte que forneça a URL ou uma regra oficial/documentada para construir o endereço a partir do código.

## Conclusão
✓ A versão atual implementa os quatro critérios solicitados — nome, vínculo, processo e ano — e permite combiná-los. A auditoria de consistência confirmou os totais da consolidação e a preservação dos campos necessários. Permanecem como limitações documentais a ausência de identificador único de pessoa e a ausência de curso/processo/URL na base de certificados.
