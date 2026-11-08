# Slash V5.3 — refinamento cinematográfico controlado

## Objetivo
Preservar o corte fino e o visual V5.2. Melhorar três aspectos concretos: duração de quadros, geometria própria de cada elemento e legibilidade em fundos diversos.

## Novos assets
Gerador `src/build-slash-v53-material.mjs`; seis spritesheets indexadas 1728×144 (12×144), com transparência. Sprites individuais: brasa bifurcada, luz com traços e estrela, gelo facetado, vento paralelo, folha nervurada e névoa espectral. Os pixels novos existem somente nos frames 3–7, com máximo alpha 0.58. Todas as versões anteriores continuam byte a byte intactas.

## Durations ms
Frame:    0  1  2  3  4  5  6  7  8  9 10 11
Duration: 76 54 38 34 80 42 44 56 68 76 83 92

Total 743ms mais 1ms de base Phaser. Todos os sete sprites recebem o mesmo timing, via frame.duration e duration=1 para evitar a soma da duração uniforme. Os demais modos mantêm 16 FPS ou 24 FPS como antes.

## Camadas / performance
V5.3 tem sete sprites por efeito, seis efeitos = 42 sprites. O novo material usa blend NORMAL, depth intermediário, filtro NEAREST e nenhum blur. O brilho ADD existente é preservado. O laboratório apresenta fundos escuro, claro e arena demonstrativa, sem tocar nas cenas do jogo.

## Verificação
Node: determinismo PNG, dimensões, transparência, ausência de pixels nos frames 0–2/8–11, material esparso e tabela de duração. Browser: WebGL desktop/mobile, 36 texturas, 42 sprites, mudanças de fundo, impactos, dissipação e retorno instantâneo a V5.2/V5.1.

## Publicação
V5.3 está pendente de aprovação visual. Não integrar no Pokémon Torre 2 nem mesclar na branch principal. O fundo de batalha é apenas um teste.
