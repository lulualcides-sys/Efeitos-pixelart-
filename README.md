# Efeitos Pixelart — laboratório VFX
Biblioteca independente de efeitos próprios em pixel art para reutilização futura no Pokémon Torre 2 e em outros projetos.

## Slash — linha aprovada de trabalho
A **V1** em arco é o ponto de partida preservado; nunca substituir seus pixels. A **V2** em arco de foice é um experimento de refino para revisão visual, não uma aprovação automática. A versão lateral anterior foi descartada, sem entrar na branch principal.

- `effects/slash/archive/v1/`: seis PNGs de arcos originais.
- `effects/slash/arc/refined-v2/`: seis efeitos em C/foice com corpo largo na base e ponta curva.
- `index.html`: **laboratório permanente Phaser/WebGL** em 2×3, com autoplay, pausa, velocidade e comparação V1/V2.
- `src/slash-vfx.js`: API de VFX exclusivamente visual, opt-in, nearest-neighbor.
- `docs/VFX-STANDARDS.md`: critérios de aprovação, autoria e integração.

## Referência visual
Vídeo enviado pelo proprietário: em cerca de 4,6 segundos aparecem os seis arcos, um no sentido de foice **da base esquerda, percorrendo o fundo, erguendo-se à direita e curvando a ponta por cima**. Não é uma faixa reta horizontal nem um semicírculo perfeito. O desenho é original; não extraímos sprites do vídeo.

## Garantias
A PR de homologação **não modifica** os golpes nativos do Poké Arena 2D, o jogo Pokémon Torre 2, os salvamentos, os efeitos aprovados ou a batalha.

**Status:** V1 recuperada, V2 refinada em revisão, não publicada.


## V5 — Corte fino e fragmentação

A V4 foi rejeitada e fechada. A V5 é uma nova linha **não aprovada** com corpo de golpe mais estreito, trajetória alongada e duas fases de movimento: ataque luminoso rápido e desintegração em material elemental. Veja `docs/SLASH-V5-ART-DIRECTION.md`.

Código-fonte de cada folha: `src/build-slash-v5.mjs`; reconstrução `node tools/export-slash-v5.mjs`. Prévia no `index.html`: V5 / V2 / V1 e botões `Ver golpe` e `Ver fragmentos`.


## V5.1 — refinamento em cinco camadas (revisão)

Sem modificar os seis sprites V5, criei um pacote independente em `effects/slash/arc/layers-v5/` com **um PNG compactado de 5 linhas × 12 quadros para cada efeito**. As camadas são `residualTrail`, `core`, `outerAccent`, `breakup` e `innerGlow`. O Phaser permite comparar **V5.1 Camadas** com **V5 Original**, V2 e V1, além de ativar/desativar o brilho leve, pausar e inspecionar o golpe/fragmentação.

Gerador determinístico: `node tools/export-slash-layers.mjs`. Documentação: `docs/SLASH-V5-1-LAYERS.md`. Todos os PNGs V1/V2/V5 permanecem intactos. A V5.1 é somente visualização, não altera mecânica do jogo.


## V5.2 — microacabamento opcional

**V5.1 preservada.** V5.2 traz micro-reflexos diferentes para os seis materiais (brasa, luz solar, prisma gelado, rastro de vento, folha e espectro) e controla suavemente a intensidade das cinco camadas no decorrer dos 12 quadros. Os novos reflexos usam 20 a 44 pixels no impacto e desaparecem após o quadro 7. Sem alterar a largura do arco ou as sprites V1, V2, V5 e V5.1.

Galeria compara V5.2 / V5.1 / V5 / V2 / V1. O modo brilho ON/OFF altera ambas as camadas luminosas da V5.2. Gerador: `node tools/export-slash-v52-micro.mjs`. Documentação: `docs/SLASH-V5-2-REVIEW.md`. Status: **pendente de aprovação visual**, sem integração no Pokémon Torre 2.
