# V8 — seis ataques com material específico e ação de combate em pixel art

**Estado: experimental, revisão estética pendente, sem integração ao Pokémon Torre 2.** O trabalho é uma continuação isolada da V7 e substitui somente a prévia `moves-v8.html`, que tem comparação A/B com V7. A Slash V5.4 permanece inalterada.

## Revisão visual e correções feitas

- Na inspeção das capturas V7, o fogo era pequeno, o gelo criava bloco duro, Air Slash tinha faíscas amareladas e Razor Shell/Shadow Punch/Meteor Mash pareciam ícones planos ou luvas estáticas.
- O V8 usa `src/moves-v8-director.js` com **26 quadros**, interpolação da posição entre os quadros, antecipação, ataque acelerado, impacto com pequena retenção e dissipação. Não desenha VFX com `Phaser.Graphics` ou CSS: todas as formas são imagens PNG.
- Flame Burst: projétil com cauda e sete línguas de fogo surgindo no impacto, com diminuição gradual da energia.
- Frost Breath: dois fluxos frios translúcidos e estilhaços selecionados **depois** do quadro de bloco intacto, com posição que acompanha o alvo.
- Air Slash: três cortes independentes, além de impacto separado; folha `sky-cut.png` efetivamente exportada sem partículas laranja de espada.
- Razor Shell: lâmina de concha nova de 160x144px com veios radiais, facetamento e recorte, animada em 18 poses; corte do vento em cyan e salpicos de água.
- Shadow Punch: punho espectral de quatro dedos com fissuras internas e partículas em azul/índigo, efeitos de sombra atrás e impacto ametista exportado em atlas separado.
- Meteor Mash: manopla metálica 160x144px com placas facetadas, juntas e rebites; trilha de velocidade fria e impacto estelar branco-prateado exportado independentemente.

## Arquivos reais produzidos

| Arquivo | Conteúdo |
| --- | --- |
| `tools/build-v8-heroes.py` | Fonte editável dos 3 heróis com 18 cels cada, Pillow nativo de 160×144px |
| `assets/v8/hero/{shell,ghost,steel}.png` | 54 cels, 3 spritesheets 2880×144px |
| `tools/build-v8-material-atlases.mjs` | Fonte de exportação PixelFX MIT com 3 paletas distintas em revisão upstream fixa |
| `assets/v8/atlases/{sky-cut,spectral-hit,meteor-hit}.png` | 3 novos atlases PNG transparentes de vento, fantasma, aço |
| `src/moves-v8-director.js` | Animador com 6 composições e velocidade temporal independente |
| `moves-v8.html` | Visualizador V8 com escolha de golpe, comparação V7, quadros-chave, velocidade e fundos |
| `tests/moves-v8.test.mjs` | Verifica fontes, identidades, proteção dos anteriores e formatos |
| `tests/moves-v8-browser.cjs` | Playwright Chromium WebGL desktop/Android, screenshots reais e estados de A/B |

## Direitos de uso e técnica

O material complementar vem de `patch-gg/pixelfx` sob MIT, commit `a84159688af3ca37a4be05a0d422b94451b2e24e`. O código-fonte dos três heróis foi criado para este projeto. Nenhuma imagem foi extraída do cliente proprietário do Poké Arena 2D. O jogo e a Slash V5.4 continuam fora de escopo.

A textura V8 mantém resolução nativa; não há ampliação de spritesheets previamente pixelados em 2×. No navegador móvel, a tela reduz o viewport com escala CSS apropriada, preservando o trabalho em nível de pixel sem quadrados artificiais de grandes dimensões.

## Qualidade e limites

Os testes automatizados validam PNG, pipeline e animação, mas não determinam se o resultado é esteticamente equivalente ao Poké Arena 2D. As capturas reais e a revisão do usuário devem aprovar o resultado antes de integrar na `main` ou Pokémon Torre 2. Não houve intervenção na batalha do jogo, nos salvamentos, em cooldowns, golpes existentes ou efeitos aprovados.
