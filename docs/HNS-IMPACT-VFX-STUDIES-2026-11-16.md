# Impactos autorais de combate no mapa — laboratório V1 (16/11/2026)

Esta linha de pesquisa é **inspirada em conceitos de leitura de combate apresentados no HnS Legends** (https://github.com/HuyMai0509/HnS-Legends), **sem copiar sprites, ROM, patches, gráficos, música ou implementação**. O repositório de referência não informa licença para reutilização e a versão M9 (16/11) descreve animações ligadas à posição do Pokémon, avisos de ataque, esquivas e realce visual. A existência de boa fluidez e sensação de impacto **não foi aferida por gameplay frame a frame**; screenshots e documentação não comprovam timing, FPS ou qualidade operacional.

## Entrega

- `hns-impact-lab.html`: galeria animada Phaser/WebGL com replay, pausa, 0,5× e fundo claro/escuro.
- `effects/hns-impact-studies/{ember-hit,frost-hit,volt-hit,tide-hit}.png`: 4 spritesheets indexados com transparência (16 quadros de 96×96, 1536×96 no total).
- `effects/hns-impact-studies/{ember-hit,frost-hit,volt-hit,tide-hit}.gif`: 4 GIFs animados de prévia (96×96, 16 quadros).
- `src/hns-impact-studies.mjs`: fonte autoral determinística de desenho pixel a pixel, encoder PNG e encoder GIF.
- `tools/export-hns-impact.mjs`: reconstrói todas as 8 imagens com Node (sem dependência externa).
- `tests/hns-impact.test.mjs`: compara bytes da geração, dimensões, transparência e progressão de impacto.

## Direção de arte

| Estudo | Entrada | Contato | Saída |
|---|---|---|---|
| ember-hit | Cometa de brasa baixo | Núcleo quente, chamas irregulares e raios | Brasas ascendentes e fragmentos |
| frost-hit | Lasca pontiaguda | Cristais em oito direções | Estilhaços que se afastam |
| volt-hit | Raio em zigue-zague | Núcleo branco e ramos bifurcados | Faíscas curtas |
| tide-hit | Borda líquida em crescente | Anéis assimétricos e gotas | Gotas radiais, sem halo persistente |

A sequência separa aproximação (quadros 0–3), contato (4), explosão (5–8) e dispersão (9–14), deixando o 15 limpo para evitar resíduo no loop. Não há filtro de suavização e a paleta é curta. O efeito de dano só poderia ocorrer na engine se o hit fosse confirmado; **o laboratório não calcula dano nem sincroniza com hitboxes**.

## Segurança e compatibilidade

- **Não alterar o Pokémon Torre 2**, a Arena, o cliente base, os sprites aprovados, a biblioteca Slash ou arquivos de save.
- Estes são **estudos genéricos de impacto**, não cópias de animações de golpes canônicos; antes de criar um golpe novo seguir `docs/VFX-STANDARDS.md` e auditar a biblioteca real do jogo.
- Não tratar publicação neste repositório como aprovação estética. É necessário revisar a animação ao vivo em desktop e mobile antes de usar.
- Não reutilizar arte alheia; nenhum arquivo de HnS Legends foi importado.
- Os GIFs servem para ver o movimento diretamente; os PNGs e fonte autoral são preferíveis para render WebGL.

**Nota:** os comentários do autor sobre otimizações IWRAM no HnS M9 são alegações do release, ainda não validadas neste projeto.
