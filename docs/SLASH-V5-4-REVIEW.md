# Slash V5.4 — materiais com movimento e dissipação

## Motivação
A V5.3-R1 oferecia geometria detalhada sobretudo nos quadros 3–7. A V5.4 dá continuidade após o contato e busca mais diferenciação de materiais, com novas folhas isoladas e sem modificar qualquer arte anterior.

## Técnicas pesquisadas
- Animação com follow-through, diferenciação por material e timing do golpe: https://voidless.dev/tutorials/guides/animation-principles-for-sprites
- Princípio de chama ascendente irregular e fagulhas independentes: https://cursogame.dev/blog/fogo-pixel-art-jogos-2d
- Sequências elementais de cast/impact/fade e renderização indexed nearest: https://miraforge.itch.io/free-pixel-fire-and-elemental-effects

As referências servem para **princípios e estudo**, sem copiar pixels, animações ou assets comerciais.

## Efeito
- Fogo: ponta bifurcada variável, núcleo quente e brasas desprendidas.
- Gelo: borda de cristal triangular, face azul-clara, microfratura e estilhaços.
- Solar: dois filetes e pequena estrela radiante sem bloom intenso.
- Vento: correntes quebradas, espaçamento com transparência e alongamento.
- Natureza: folhas afiladas e nervuras com sementes dissipando.
- Espectral: wisps curvos em duas profundidades e motes.
- Quadros 2–9 visíveis no material, sem pixels no 0–1 e 10–11; 12 quadros de 144x144 por efeito, spritesheets 1728x144.
- Cap no alpha da camada material <=0.58 e animação própria sincronizada. Sete sprites por efeito, 42 texturas na galeria, sem aumentar espessura da lâmina base.
- Alteração isolada em repositório de efeitos com aprovação visual explícita (PR #10 publicada); manter V1/V2/V5/V5.1/V5.2/V5.3/R1 como comparativos e sem integração no jogo principal.

## Estado
V5.4 foi aprovada visualmente pelo usuário e publicada na `main` da biblioteca de efeitos. O adaptador de prévia é Phaser 3; a aplicação principal do Pokémon Torre 2 também usa PixiJS 7.4.3. Os PNGs indexados podem ser aproveitados em ambas as engines com adaptadores próprios, mas esta aprovação **não** autoriza substituir efeitos nativos do Poké Arena 2D ou efeitos exclusivos já aprovados, e não confirma integração ou testes de combate no jogo.

## Validação
Testes de integridade de PNG determinístico, limites de densidade, progressão temporal, compatibilidade Phaser/WebGL em Chromium desktop/mobile, fundos claro/escuro/batalha e botões de comparação.
