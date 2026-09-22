# Direção de produto — Portal Turístico Evastur

Documento de direção para evoluir a Evastur em um portal turístico de Cruzeiro do Sul e região, com venda integrada de passeios, experiências e viagens.

Este documento registra a proposta discutida. Não significa que as funcionalidades abaixo já estejam implementadas. O acompanhamento técnico existente permanece em `TASKS.md`.

> **Direção revisada em 21/09/2026:** a Evastur optou por tornar pacotes externos e experiências regionais autocontidos. O destino/local, as fotografias, a descrição e o roteiro passam a ser cadastrados diretamente no pacote. As páginas e o cadastro separado de destinos turísticos serão descontinuados para eliminar duplicidade. As seções abaixo que propõem guias independentes ficam preservadas apenas como histórico da decisão anterior.

## 1. Visão

A Evastur deve permitir que o visitante descubra a região, conheça seus pontos turísticos e encontre experiências para vivenciar esses lugares. A venda de viagens externas continua fazendo parte do negócio, com apresentação distinta do conteúdo turístico regional.

O resultado deve combinar:

- Uma experiência visual premium, com fotografia valorizada, boa leitura e navegação clara.
- Conteúdo turístico útil mesmo para quem não pretende comprar.
- Ofertas comerciais objetivas e fáceis de reservar.
- Um painel que a equipe consiga manter sem repetir informações ou depender de conhecimento técnico.

## 2. Problema que precisamos resolver

Atualmente, cadastrar um destino e depois um pacote pode exigir preencher títulos, descrições e imagens semelhantes duas vezes. No site, o visitante encontra uma apresentação extensa do lugar e, ao abrir o pacote relacionado, vê outra apresentação parecida. Isso gera trabalho para a equipe e sensação de repetição para o cliente.

A solução não é eliminar o conteúdo dos destinos. História, paisagens, localização e orientações são essenciais à proposta de portal turístico. Precisamos separar a função do guia da função da oferta e permitir o reaproveitamento de mídia.

## 3. Dois conteúdos com funções claras

| Conteúdo | Pergunta que responde | Informações principais | Ação do visitante |
| --- | --- | --- | --- |
| Lugar / destino turístico | Por que conhecer este lugar? | História, paisagens, atrativos, galeria, localização, como chegar e orientações | Explorar o guia e descobrir experiências |
| Passeio / experiência regional | Como será o passeio que vou contratar? | Programação, duração, ponto de encontro, inclusões, condições, disponibilidade e preço | Escolher e reservar |
| Viagem externa | Como será minha viagem? | Destinos visitados, datas, transporte, hospedagem, roteiro, condições e preço | Escolher e comprar |

### Exemplo: Rio Croa

**Guia — “Conheça o Rio Croa”**

Apresenta o lugar, sua história, natureza, fotografias e orientações para o visitante. Pode existir e ser publicado mesmo sem passeios à venda.

**Oferta — “Passeio de um dia no Rio Croa”**

Apresenta o que acontecerá naquele passeio: programação, duração, serviços incluídos, ponto de encontro, data e preço. Pode usar fotos do guia, mas não deve repetir sua história e descrição extensa.

Um lugar pode ter vários passeios. Uma viagem também pode visitar vários lugares. A relação entre destinos e produtos deve continuar existindo internamente, sem tornar o cadastro complicado.

## 4. Página inicial

A home deve evidenciar a identidade de portal turístico e facilitar o acesso às ofertas. Ordem inicial proposta:

1. **Apresentação da região:** fotografia de destaque, chamada curta e acesso à descoberta dos lugares.
2. **Conheça Cruzeiro do Sul e região:** galeria visual dos pontos turísticos.
3. **Viva essas experiências:** passeios regionais com informações comerciais objetivas.
4. **Histórias e cultura da região:** destaques editoriais dos guias; não exige criar um blog na primeira etapa.
5. **Viaje com a Evastur:** pacotes externos em uma seção identificada.
6. **Atendimento e informações da agência:** caminhos para tirar dúvidas e entrar em contato.

### Galeria de pontos turísticos

- Usar fotos grandes, nome do lugar e uma chamada breve.
- Não apresentar preços nessa seção de descoberta.
- Ao clicar, abrir o guia do destino correspondente.
- Reaproveitar as capas dos destinos, evitando outro cadastro obrigatório de imagens.
- Permitir à equipe escolher os destaques e ordenar sua apresentação.
- Exibir somente destinos publicados; definir um comportamento automático quando não houver destaques selecionados.

### Vitrine de experiências

- Mostrar nome do passeio, fotografia, duração e preço.
- Usar uma ação clara, como “Ver passeio e reservar”.
- Diferenciar visualmente as ofertas da galeria editorial.
- Representar corretamente ofertas indisponíveis, sem permitir compras indevidas.

## 5. Guia do destino

O guia é a página editorial do lugar. Estrutura proposta:

1. Capa, nome e localização.
2. Apresentação e história.
3. Galeria de fotografias.
4. Atrativos e informações para visitação.
5. Como chegar e recomendações.
6. Seção “Experiências para conhecer este lugar”.

Os cards das experiências devem ser objetivos: fotografia, título, duração, preço e acesso aos detalhes da oferta. Não devem reproduzir uma segunda página completa dentro do guia.

Quando não houver experiências disponíveis, o guia continua útil e acessível. Evitar seções vazias ou botões que prometam uma oferta inexistente.

## 6. Detalhes do passeio ou pacote

A página comercial deve mostrar o que o cliente está contratando, com fotografia valorizada e acesso claro à reserva.

- Título específico da oferta, distinguindo-a do nome do lugar.
- Descrição curta da experiência contratada.
- Galeria selecionada para aquela oferta.
- Programação ou roteiro.
- Duração, local de saída ou ponto de encontro e demais informações pertinentes.
- Inclusões, extras e condições aplicáveis.
- Datas, disponibilidade e preço.
- Acesso à reserva e ao atendimento.

O guia pode ser acessado por um link secundário, como “Conheça mais sobre o Rio Croa”. A página comercial não deve devolver o visitante ao destino como etapa obrigatória para comprar.

Fluxos esperados:

- Home → ponto turístico → guia → passeio → reserva.
- Home → experiência → detalhes → reserva.
- Home → viagem externa → detalhes → compra.

## 7. Cadastro simples para a equipe

### Começando pelo lugar

1. Cadastrar nome, localização e conteúdo editorial do destino.
2. Adicionar fotos e escolher a capa.
3. Salvar como rascunho ou publicar quando estiver pronto.
4. Usar a ação “Criar passeio neste lugar”.
5. Preencher a oferta com o destino já vinculado e acesso às fotos existentes.

### Começando pelo passeio

1. Clicar em “Criar pacote ou experiência”.
2. Escolher experiência regional ou viagem externa.
3. Selecionar um destino existente ou criar um novo dentro do formulário.
4. Para um novo lugar, informar inicialmente nome e localização, sem exigir um guia completo.
5. Continuar o cadastro da oferta sem sair da página.
6. Completar o guia editorial depois, mantendo-o como rascunho até a publicação.

**Regra proposta:** a oferta pode ser publicada com seu conteúdo comercial completo mesmo que o guia esteja em rascunho. Nesse caso, o site não deve mostrar links públicos para o guia não publicado. As regras de leitura e apresentação precisam contemplar esse cenário sem expor conteúdo privado.

### Organização proposta do painel

- **Lugares e guias:** conteúdo turístico dos destinos.
- **Pacotes e experiências:** uma listagem com filtros para regionais e externos.
- **Página inicial:** seleção e ordenação de destaques, com prévia.
- **Vendas:** reservas, pagamentos e vouchers.
- **Configurações:** dados da agência e preferências do site.

Os campos específicos de cada modalidade devem aparecer conforme a escolha. Um passeio regional não precisa apresentar campos de voo como parte obrigatória do cadastro.

## 8. Reaproveitamento de conteúdo e imagens

- Não copiar automaticamente a descrição editorial inteira para o pacote.
- Permitir selecionar fotos já cadastradas no destino, sem reenviar arquivos.
- Permitir adicionar fotografias exclusivas da oferta.
- Manter capa e ordem das fotos independentes em cada página.
- Deixar claro no painel quando uma foto está sendo reutilizada.
- Remover uma foto de uma página deve desvinculá-la daquela página; o arquivo físico só pode ser excluído quando não houver outros usos.

Antes de implementar mídia compartilhada, revisar a limpeza atual do Storage. Uma exclusão em um formulário não pode quebrar imagens de outros destinos ou pacotes.

## 9. O que significa uma experiência premium

- Fotografias adequadas e bem enquadradas, preferencialmente sem textos promocionais embutidos nas capas.
- Tipografia legível, hierarquia clara e bom espaçamento.
- Identidade Evastur consistente nas páginas editoriais e comerciais.
- Conteúdo objetivo, sem títulos e seções repetidos desnecessariamente.
- Navegação confortável no celular, com reserva acessível.
- Galerias com ampliação de imagens e operação por teclado.
- Carregamento eficiente de imagens e animações discretas, respeitando redução de movimento.
- Estados claros para carregamento, ausência de conteúdo, falhas e indisponibilidade.
- Informações comerciais reais: não inventar avaliações, escassez de vagas, garantias ou condições.

A referência visual discutida foi a página de passeio do [Rio Crôa](https://www.riocroa.com/tours/um-dia-inteiro-no-rio-croa). Ela serve de inspiração para fotografia e organização, preservando a identidade e os conteúdos próprios da Evastur.

## 10. Sequência de implementação

### Etapa 1 — Revisar conteúdo e comportamento atuais

- Mapear os campos editoriais e comerciais existentes.
- Identificar repetições nas páginas e no cadastro.
- Definir campos mínimos para rascunho e publicação de cada conteúdo.
- Revisar vínculos, permissões e exclusão de imagens antes do reaproveitamento.

### Etapa 2 — Simplificar o painel

- Unificar a entrada de criação de pacotes e experiências.
- Permitir criar um destino básico dentro do formulário do produto.
- Adicionar “Criar passeio neste lugar” no destino.
- Disponibilizar seleção de mídia existente.
- Preservar dados ao alternar abas e tratar falhas de salvamento sem perder o trabalho.

### Etapa 3 — Diferenciar guia e oferta

- Concentrar história, galeria editorial e informações do lugar no guia.
- Concentrar detalhes contratados e compra na página comercial.
- Enxugar os cards de experiências relacionadas.
- Tratar guias em rascunho, destinos sem ofertas e produtos indisponíveis.

### Etapa 4 — Evoluir a home

- Criar a galeria de pontos turísticos.
- Separar descoberta regional, experiências e viagens externas.
- Implementar seleção, ordenação e prévia dos destaques.
- Reaproveitar conteúdo publicado com estados vazios adequados.

### Etapa 5 — Validar com a equipe

- Testar o cadastro de um destino e de dois passeios relacionados.
- Testar a criação de um passeio com novo destino sem sair do formulário.
- Testar a seleção e remoção de imagens compartilhadas.
- Conferir os fluxos de descoberta e compra em celular e desktop.
- Verificar permissões e publicação independente de guias e produtos.
- Pedir à equipe para executar cadastros e organizar a home, observando dúvidas e retrabalho.

## 11. Critérios de conclusão

- A home comunica que a Evastur é um portal turístico com ofertas de viagens e experiências.
- O visitante distingue o guia do lugar dos detalhes do passeio contratado.
- É possível cadastrar uma oferta sem preencher duas vezes a história, a galeria e a descrição do destino.
- A equipe consegue criar um destino básico durante o cadastro do produto.
- Um destino comporta vários passeios sem duplicar seu guia.
- As fotos podem ser reutilizadas sem que a exclusão em uma página prejudique outra.
- A equipe organiza os destaques da home sem editar código.
- Rascunhos não ficam expostos ao público.
- Os fluxos de reserva e compra continuam funcionando.

## 12. Cuidados com a evolução

- Implementar progressivamente, preservando os conteúdos, URLs e relações existentes sempre que possível.
- Não apagar descrições e galerias atuais automaticamente; revisar o conteúdo antes de redistribuí-lo.
- Registrar as mudanças de banco em migrations e validar o projeto antes de aplicá-las.
- O projeto Supabase correto é **Evastur**, referência **`ryzggxbhxoclojqejjne`**.
- A criação deste documento não executa migrações, exclui conteúdo ou publica alterações no site.
