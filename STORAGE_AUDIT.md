# Auditoria de imagens no Supabase Storage

Auditoria executada em 17/09/2026 no projeto Evastur (`ryzggxbhxoclojqejjne`). Nenhum arquivo foi excluído.

Um arquivo foi classificado como **candidato a órfão** quando não foi encontrado em nenhum campo de URL/caminho usado atualmente pelo catálogo, perfis ou módulos legados. Isso não autoriza exclusão automática: os arquivos precisam de conferência visual antes da limpeza definitiva.

| Bucket | Arquivos | Referenciados | Candidatos a órfãos | Espaço dos candidatos |
| --- | ---: | ---: | ---: | ---: |
| `avatars` | 1 | 0 | 1 | 118,9 KB |
| `destinations` | 3 | 1 | 2 | 133,4 KB |
| `galleries` | 14 | 2 | 12 | 1,42 MB |
| `packages` | 31 | 4 | 27 | 15,67 MB |
| **Total** | **49** | **7** | **42** | **17,32 MB** |

## Decisão desta etapa

- Preservar os 42 candidatos restantes até confirmação manual.
- Três imagens anteriormente sem referência foram conferidas visualmente e associadas ao destino Rio Croa: uma capa no bucket `destinations` e duas fotos no bucket `galleries`.
- Novos uploads de pacotes e destinos passam a usar pastas com o ID da entidade.
- Trocas e remoções feitas nos novos formulários excluem o arquivo físico somente depois que o banco é salvo com sucesso.
- A limpeza dos arquivos listados acima permanece pendente na fase 7 do plano.
