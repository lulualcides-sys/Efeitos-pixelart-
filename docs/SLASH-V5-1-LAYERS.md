# Slash V5.1 — camadas e renderização Phaser/WebGL

## O que foi alterado
A V5 fina foi **preservada byte a byte**. A V5.1 é uma sobreposição de materiais mais refinada, baseada nos mesmos pixels, sem aumentar a largura da lâmina.

O novo gerador `src/build-slash-layers.mjs` separa as seis PNGs V5 em cinco linhas de spritesheet, cada linha com 12 quadros de 144×144 px. A composição das quatro camadas NORMAL é **exatamente igual ao original**: cada pixel pertence a uma, e somente uma, dessas camadas. A camada de brilho só reutiliza highlights já existentes do core; não desenha halos externos.

## Camadas e ordem de renderização
| Ordem | Camada | Blend | Alpha | Função |
| --- | --- | --- | --- | --- |
| 1 | `residualTrail` | NORMAL | 0,78 | Linhas residuais discretas, visíveis no fim |
| 2 | `core` | NORMAL | 1 | Lâmina original fina, frames 0–5 |
| 3 | `outerAccent` | NORMAL | 1 | Matéria específica de cada elemento |
| 4 | `breakup` | NORMAL | 1 | Brasas, gelo, folhas, vento, luz e espectro, frames 6–8 |
| 5 | `innerGlow` | ADD | 0,16 | Highlights internos finos, frames 2–5 |

A ordem deixa **um único lote adicional de blend ADD**, ao final, para reduzir mudanças de blend no WebGL. Não usar ADD indiscriminadamente ou blur/smoothing. O renderer `src/slash-vfx-layers.js` cria cinco sprites sincronizados e oferece controle `setFrame`, `pause`, `resume`, `timeScale`, `destroy` e `setGlowEnabled`.

## Timing das camadas
- Quadros 0–1: entrada/antecipação
- Quadros 2–5: corte fino e brilho interno
- Quadros 6–8: fragmentação elemental, sem lâmina principal
- Quadros 9–11: resíduos e dispersão

## Formato e testes
- 6 arquivos PNG indexados, largura 1728 e altura 720 (5 linhas de 144).
- 60 frames por PNG: `frameIndex=layerIndex*12+frameIndexNoEfeito`.
- Compressão Deflate fixed-Huffman (vários kB por arquivo); descompactação via padrão PNG no navegador.
- V1/V2/V5 continuam disponíveis para comparação. Não é a V6, nem substituição aprovada.
- `npm test` reconstrói as cinco camadas e verifica cada pixel contra a V5 original, além de tamanho de frame, transparência, timing e ausência de contorno novo.
- `npm run test:browser` deve validar Phaser/WebGL desktop e mobile, 24 texturas, 30 sprites das camadas, botão Brilho e quadros de golpe/fragmentação.

## Aprovação e segurança
A V5.1 continua **pendente de aprovação estética**. Não alterar `main` do Pokémon Torre 2, a HUD de batalha, kit Poké Arena 2D, efeitos aprovados, saves, dano ou física. Não fazer merge nem publicar no jogo principal sem autorização.
