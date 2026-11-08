# Slash V5.2 — acabamento sutil e reversível

## Preservação
O usuário gostou da V5.1. Nenhum pixel da lâmina, da V5, V5.1, V2 ou V1 foi alterado. V5.2 é opt-in, com comparação A/B no laboratório Phaser/WebGL.

## Mudanças
- Cinco camadas V5.1 existentes intactas, com curva suave de alpha por quadro.
- Sexta camada pequena e temporária: microglints originais para fogo, solar, gelo, vento, natureza e espectro.
- Paleta indexada com transparência, spritesheet 1728×144, 12 quadros por elemento.
- Só existem pixels de micro-reflexo nos quadros 3–7, com 20–44 pixels no quadro 4. Nada é desenhado depois do quadro 7.
- Sprite ADD no topo, alpha máximo 0.65; camada innerGlow ADD máximo 0.19. Não usar blur/bloom ou ampliar a lâmina.
- A dissipação gradativa usa envelopes de alpha: rastro cai a 0.06 no último quadro e fragmentação a 0.15.
- Phaser usa 16 FPS, NEAREST e depth crescente; a galeria tem botões V5.2, V5.1, V5, V2 e V1 e comparação glow ON/OFF.

## Frames
| Fase | Frames | Glow | Micro |
|---|---:|---:|---:|
| Antecipação | 0–1 | 0 | 0 |
| Corte | 2–3 | 0.06–0.13 | 0–0.30 |
| Pico | 4 | 0.19 | 0.65 |
| Final do corte | 5 | 0.12 | 0.48 |
| Fragmentação | 6–7 | 0 | 0.23–0.10 |
| Dissipação | 8–11 | 0 | 0 |

## Testes e aprovação
Gerador determinístico: src/build-slash-v52-micro.mjs, exportação via node tools/export-slash-v52-micro.mjs. Node valida cores, frames, densidade, transição e integridade; navegador testa WebGL desktop/mobile e comparações.
PR DRAFT, sem publicação no jogo Pokémon Torre 2. Aprovação estética exclusivamente do usuário.