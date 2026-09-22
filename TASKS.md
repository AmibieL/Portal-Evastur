# Plano de implementação — Catálogo Evastur

Este arquivo é a fonte de acompanhamento da reorganização do catálogo. Cada item deve ser marcado somente depois de implementado e verificado.

## 0. Preparação e segurança

- [x] Criar este arquivo de acompanhamento.
- [x] Corrigir o vínculo local do Supabase para o projeto Evastur (`ryzggxbhxoclojqejjne`).
- [ ] Registrar o esquema remoto atual em migrations locais sem alterar dados.
- [x] Regenerar os tipos TypeScript a partir do banco remoto.
- [x] Registrar e validar o estado inicial de build, testes e lint.

Estado inicial em 17/09/2026: testes e build aprovados; lint falha com 159 erros e 10 avisos preexistentes, principalmente por `no-explicit-any`.

Observação atualizada em 20/09/2026: o `db pull` completo continua pendente porque a conta da CLI retorna `Your account does not have the necessary privileges to access this endpoint` ao tentar vincular o projeto. A migration `catalog_foundation` foi registrada no histórico remoto pelo MCP no projeto Evastur, mas o histórico anterior do banco ainda precisa ser consolidado localmente.

## 1. Novo modelo de catálogo

- [x] Adicionar `package_type` (`external` ou `regional`) aos pacotes.
- [x] Adicionar `travel_scope` (`national`, `international` ou `null`) aos pacotes.
- [x] Separar estado de publicação e estado de venda.
- [x] Migrar os pacotes atuais para `external` + `national`.
- [x] Criar `package_destinations` para relacionar pacotes e destinos.
- [x] Criar/ajustar tabelas de atrativos e roteiro dos destinos.
- [x] Evoluir `destination_gallery` com caminho do arquivo, legenda e texto alternativo.
- [x] Criar políticas RLS para as novas tabelas.
- [x] Restringir leitura pública a registros publicados.
- [x] Verificar a migration no banco e executar os advisors do Supabase.

Verificação da etapa 1: migration reaplicável sem erro; tipos gerados; TypeScript, testes e build aprovados. O Security Advisor ficou apenas com o aviso de proteção contra senhas vazadas, que depende de configuração do Auth.

## 2. Organização do painel administrativo

- [x] Reorganizar a navegação em Catálogo, Vendas e Configurações.
- [x] Criar listagem de pacotes externos.
- [x] Criar listagem de experiências regionais.
- [x] Manter as rotas antigas funcionando durante a transição.
- [x] Remover “Cruzeiro do Sul” como módulo paralelo somente após a migração.

## 3. Cadastro de destinos turísticos

- [x] Substituir a gaveta atual por uma página completa de criação/edição.
- [x] Criar seção de informações gerais e localização.
- [x] Criar seção de conteúdo e recomendações.
- [x] Criar gestão de atrativos.
- [x] Criar gestão do roteiro sugerido.
- [x] Fazer a galeria persistir corretamente em `destination_gallery`.
- [x] Criar seção de publicação e SEO.
- [x] Criar um destino real de validação (sugestão: Rio Croa).

Validação em 20/09/2026: Rio Croa foi criado e publicado com conteúdo editorial, capa, duas imagens de galeria, três atrativos e roteiro. As imagens já existiam no Storage do projeto Evastur e foram conferidas visualmente antes do vínculo.

## 4. Gestão de imagens

- [x] Fazer upload usando pastas por entidade.
- [x] Salvar o caminho do Storage além da URL pública.
- [x] Excluir o arquivo físico ao remover ou substituir uma imagem.
- [x] Permitir reordenar imagens da galeria.
- [x] Configurar limite de tamanho e MIME types nos buckets.
- [x] Revisar os arquivos órfãos atuais antes de qualquer exclusão.

Verificação da etapa 4: os novos formulários de pacotes e destinos usam pastas por ID, persistem `storage_path`, permitem reordenar a galeria e só removem arquivos antigos depois do salvamento do banco. Os buckets rejeitam arquivos fora dos formatos JPG, PNG, WEBP e GIF ou acima de 5 MB. Três imagens auditadas foram associadas ao Rio Croa; restam 42 candidatos a órfãos (17,32 MB), preservados para conferência manual em `STORAGE_AUDIT.md`.

## 5. Formulários dos produtos

- [x] Preservar o formulário ao alternar para outra aba e recuperar o rascunho de um novo pacote após recarregar a página.
- [x] Corrigir a exclusão de destinos ainda referenciados pelo campo legado dos pacotes e traduzir erros de integridade do catálogo.
- [x] Extrair campos compartilhados do formulário monolítico.
- [x] Criar formulário específico de pacote externo.
- [x] Criar formulário específico de experiência regional.
- [x] Relacionar produtos a destinos cadastrados.
- [x] Tornar o salvamento do pacote e tabelas filhas atômico.
- [x] Corrigir a edição de vagas para não sobrescrever a capacidade original.
- [x] Melhorar validações de preço, datas, vagas, slug e imagens.

Progresso da etapa 5: existem entradas específicas para pacote externo e experiência regional, ambas reutilizando o editor-base durante a extração gradual dos campos compartilhados. O formulário permite selecionar vários destinos cadastrados, definir o principal e sincronizar `package_destinations`. Capacidade total e vagas disponíveis são campos independentes. O salvamento de pacote, inclusões, roteiro, imagens, cardápio e destinos agora acontece na mesma transação por meio da RPC `save_package_catalog`; qualquer falha reverte a operação completa. As validações cobrem preço, parcelamento, tipo de produto, destino, imagem de capa para publicação, ordem das datas, slug e vagas.

Os campos compartilhados foram divididos em componentes próprios: relacionamento com destinos, capacidade, mídia, descrição, inclusões, roteiro e detalhes do produto. O editor-base ficou responsável por estado, validação e salvamento; voo e cardápio permanecem isolados como blocos específicos de cada modalidade.

Estabilidade do editor: renovações da sessão ao retornar para a aba não desmontam mais o painel administrativo. Durante a criação, todos os campos do pacote são mantidos em um rascunho temporário da própria aba, recuperado após uma recarga acidental e removido quando o cadastro é salvo com sucesso.

## 6. Páginas públicas

- [x] Redesenhar os detalhes do pacote com capa imersiva, apresentação editorial, navegação por seções, galeria ampliável e acesso fixo à reserva no celular, inspirado na referência Rio Crôa.
- [x] Criar a nova página pública de destino turístico.
- [x] Exibir galeria, atrativos, acesso, roteiro e recomendações.
- [x] Exibir experiências e pacotes relacionados ao destino.
- [x] Adaptar a página do produto para pacote externo ou experiência regional.
- [x] Impedir acesso público direto a rascunhos e itens arquivados.

Verificação da etapa 6: a página usa `package_type`, `travel_scope` e `sales_status`, mantendo compatibilidade com registros legados. Experiências regionais exibem seleção de data/horário e cardápio; pacotes externos exibem data definida e dados de voo. Os destinos relacionados aparecem com link para o respectivo guia público.

## 7. Migração e limpeza

- [x] Migrar relacionamentos antigos de destino por texto.
- [x] Migrar conteúdo útil de `cruzeiro_categories` para `destinations`.
- [x] Parar de gravar `destination_name` após a migração.
- [ ] Avaliar e remover estruturas sem uso, como `gallery_images`.
- [ ] Remover campos legados somente após confirmar que não possuem consumidores.
- [ ] Revisar e, mediante confirmação, remover arquivos órfãos do Storage.

## 8. Verificação final

- [ ] Testar criação e edição dos dois tipos de produto.
- [ ] Testar destinos em rascunho e publicados.
- [ ] Testar upload, ordenação, troca e exclusão de imagens.
- [x] Testar permissões de administrador, usuário autenticado e visitante.
- [ ] Testar carrinho, checkout, reservas, pagamentos e cancelamentos.
- [x] Executar testes, lint e build de produção.
- [ ] Validar o layout em dispositivos móveis e desktop.

Validação em 20/09/2026: TypeScript, lint completo, 5 testes automatizados e build de produção aprovados. O lint não possui erros e mantém 10 avisos preexistentes de Fast Refresh. A RPC foi testada com criação transacional dos dois tipos de produto e rollback; usuário não administrador foi corretamente bloqueado. Visitante e usuário autenticado enxergam somente registros publicados. A home, a listagem de destinos, o Rio Croa e um pacote foram renderizados em viewport desktop/mobile por Chrome headless sem quebra visível. A revisão autenticada do painel e os fluxos comerciais reais permanecem pendentes.

Situação da limpeza em 20/09/2026: `cruzeiro_categories` não possuía registros, portanto não havia conteúdo a migrar. O módulo paralelo foi removido do frontend e substituído pela seção de destinos regionais. `gallery_images` também está vazia e sem consumidor no código, mas a tabela e os campos legados foram preservados no banco até o deploy do frontend normalizado, evitando quebrar a versão atualmente publicada. Restam 42 candidatos a órfãos (17,32 MB), sem exclusão automática.

## 9. Simplificação para pacotes autocontidos

- [x] Substituir o vínculo obrigatório com destino turístico por um campo direto de destino/local no pacote.
- [x] Remover o cadastro de destinos da navegação administrativa.
- [x] Remover o guia de destino clicável da página pública do pacote.
- [x] Adicionar descrição completa ao editor do pacote.
- [x] Adaptar listagens e favoritos para usar `packages.destination_name`.
- [x] Preparar migration para migrar nomes existentes e atualizar o salvamento atômico.
- [ ] Aplicar a migration `20260921120000_packages_direct_destination.sql` no projeto Supabase Evastur.
- [ ] Validar criação e edição autenticada de um pacote externo e de uma experiência regional após a migration.

Decisão de 21/09/2026: o pacote passa a concentrar localização, descrição, fotografias, roteiro e informações comerciais. As tabelas antigas de destinos serão preservadas durante a transição e só deverão ser removidas após a validação do novo fluxo e de um backup.
