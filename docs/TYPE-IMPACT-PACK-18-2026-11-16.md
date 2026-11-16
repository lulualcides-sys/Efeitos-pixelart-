# Pacote autoral de impactos — todos os 18 tipos Pokémon (16/11/2026)

Este lote completa **18 estudos genéricos de impacto, um para cada tipo**, sem atribuir animações genéricas a golpes específicos. Os quatro trabalhos já publicados foram **preservados byte a byte** (fogo, gelo, elétrico e água); 14 novos estudos têm **geometria e ritmos distintos**.

**Galerias:** [Ver GIFs animados diretamente no GitHub](../effects/type-impact-pack/README.md) · [Visualizador HTML](../type-impact-lab.html).

## Escopo exato

| Tipo | Arquivo GIF | Identidade do contato |
|---|---|---|
| Normal | normal-hit.gif | Ondas concêntricas e rajadas |
| Fogo | ../hns-impact-studies/ember-hit.gif | Chama quente e brasas ascendentes (existente) |
| Água | ../hns-impact-studies/tide-hit.gif | Ondas e gotas (existente) |
| Elétrico | ../hns-impact-studies/volt-hit.gif | Descarga de faíscas (existente) |
| Planta | grass-hit.gif | Folhas divergentes e chicotes |
| Gelo | ../hns-impact-studies/frost-hit.gif | Cristais e fratura (existente) |
| Lutador | fighting-hit.gif | Projeção diagonal de punho |
| Veneno | poison-hit.gif | Burbulhamento e respingos |
| Terra | ground-hit.gif | Fissuras e detritos baixos |
| Voador | flying-hit.gif | Correntes curvas e lâminas de vento |
| Psíquico | psychic-hit.gif | Losangos pulsantes e faíscas |
| Inseto | bug-hit.gif | Asas simétricas e fragmentos |
| Pedra | rock-hit.gif | Blocos facetados e estilhaços |
| Fantasma | ghost-hit.gif | Espirais espectrais dispersivas |
| Dragão | dragon-hit.gif | Lâminas helicoidais e energia |
| Sombrio | dark-hit.gif | Cortes em eclipse e sombras |
| Aço | steel-hit.gif | Placas metálicas e reflexos |
| Fada | fairy-hit.gif | Estrelas e ondas luminosas |

Todos os estudos novos usam **16 quadros de 96×96, transparência indexada, sem antialiasing**, exportados como spritesheet PNG 1536×96 e GIF animado 96×96. Os GIFs têm timings variados de 40–70 ms por quadro (mesmo ritmo base dos primeiros quatro). Quadros 0–3: aproximação; 4: contato; 5–8: projeção; 9–14: dispersão; 15: limpeza.

## Fonte reprodutível e validação

- Gerador original: `src/type-impact-pack.mjs`.
- Comando: `node tools/export-type-impact-pack.mjs`.
- Testes unitários automáticos: `node --test tests/type-impact-pack.test.mjs`.
- Fluxo de CI dedicado: `.github/workflows/type-impact-pack.yml`.
- Galeria garante GIFs animados **renderizados inline no GitHub** via `effects/type-impact-pack/README.md`, sem depender de GitHub Pages.
- Não foram importados sprites, arquivos ROM, patches BPS nem assets ou código do HnS Legends. A documentação pública do projeto foi apenas referência conceitual.

## Limites de aprovação

A galeria foi produzida como **laboratório isolado**; publicação no repositório de efeitos não equivale à aprovação estética nem ao uso em combate. O desempenho, impacto real e sincronização visual do jogo HnS Legends não foram medidos. Os 18 efeitos **não** equivalem a todas as centenas de golpes de HnS Legends, nem representam visualmente cada golpe canônico.

**Proibido** substituir golpes aprovados, reutilizar o mesmo efeito como se fosse um golpe novo sem auditoria, alterar o cliente base, cooldowns, dano, hitboxes, saves, Arena ou publicar alterações no Pokémon Torre 2 sem autorização específica.
