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


## V5.3 — ritmo e materiais (revisão visual)

A V5.3 preserva V1/V2/V5/V5.1/V5.2, adicionando seis geometrias mínimas por elemento em `effects/slash/arc/material-v5-3/`, geradas por `src/build-slash-v53-material.mjs`. O Phaser usa timing variável idêntico nas sete camadas (aprox. 743 ms totais) e o laboratório compara seis versões e três fundos (escuro/claro/batalha). Sem merge e sem integração no Pokémon Torre 2. Ver `docs/SLASH-V5-3-REVIEW.md`.

## V5.4 experimental — movimento próprio de cada elemento

Pacote **novo e separado** em `effects/slash/arc/material-v5-4/` com seis folhas originais: fogo com chamas bifurcadas e brasas, gelo facetado e partículas de ruptura, vento com correntes interrompidas, folhas com veios, luz solar filamentada e espectros com wisps. O material aparece desde o frame 2 até o 9, com fade progressivo. V5.3-R1 e todas as anteriores permanecem intactas. No laboratório, compare os botões **V5.4 Elementos** e **V5.3 Cinemático**, em três fundos. **V5.4 aprovada visualmente e publicada nesta biblioteca; não integrada ao Pokémon Torre 2.**

## Seis golpes originais — lote de revisão visual (não aprovado)

O laboratório separado [moves.html](./moves.html) contém **Flame Burst, Frost Breath, Air Slash, Razor Shell, Shadow Punch, Meteor Mash**. Cada golpe possui 16 quadros de 144×144 px, dois canais geométricos (corpo e partículas), timing variável e quadro de impacto registrado no frame 9. O gerador `src/build-move-six.mjs` produz os PNGs originais em `effects/moves/six-v1/`. O renderizador opcional `src/move-six-vfx.js` usa Phaser 3/WebGL. O laboratório inclui pausa, impacto, dissipação, velocidade, partículas e três fundos.

**Status: revisão visual pendente.** Nenhuma mecânica de dano, status, cooldown, colisão, golpes nativos ou saves foi alterada. A V5.4 aprovada permanece intocada. Consulte `docs/POKEMON-MOVES-SIX-V1.md`.

## Seis golpes reconstruídos V2 — revisão visual, substitui a prévia V1

A galeria `moves.html` agora abre a **V2 com cinco camadas** por golpe, preservando a V1 rejeitada como comparação. Os seis golpes (Flame Burst, Frost Breath, Air Slash, Razor Shell, Shadow Punch, Meteor Mash) foram refeitos em spritesheets indexadas de 16 quadros × 5 camadas, sem alterar a Slash V5.4 aprovada. A arte V2 fica em `effects/moves/six-v2/`, o gerador em `src/build-move-six-v2.mjs` e o Phaser/WebGL em `src/move-six-v2.js`. A V2 tem antecipação curta, aceleração da trajetória, um quadro de contraste no impacto, destaque da silhueta e dissipação após o contato. **Não aprovada visualmente e não integrada ao Pokémon Torre 2.**


## V3 — seis golpes redesenhados em pixels nativos (pendente de aprovação)

**Abrir a prévia [V3 Pixel Art](./moves-v3.html)**. Os seis golpes foram construídos novamente a partir de máscaras autorais de pixels na resolução lógica de **72×72**, com ampliação exata 2× no PNG, contornos em escada, paletas de oito cores e **18 quadros**. Em vez de ampliar o mesmo efeito genérico com mais glow e círculos, cada golpe tem gesto próprio:

- **Flame Burst:** pequena chama moldada manualmente, cauda pulsante e explosão flamejante com brasas;
- **Frost Breath:** linhas frias onduladas saindo da origem, cristais e rompimento gelo no contato;
- **Air Slash:** cortes em arco finos em momentos diferentes, sem banda larga;
- **Razor Shell:** concha com recortes e nervuras físicas, acompanhada de água e gotas;
- **Shadow Punch:** punho espectral com quatro nós, polegar e rastros não esféricos;
- **Meteor Mash:** punho com placas de aço, trajetória diagonal e faíscas.

Arquivos: `src/build-move-six-v3.mjs` → `effects/moves/six-v3/*.png`; adaptador `src/move-six-v3.js`; laboratório `moves-v3.html`; testes em `tests/move-six-v3.test.mjs` e `tests/move-six-v3-browser.cjs`.

A estrutura de renderização/paletas do cliente capturado Poké Arena 2D foi estudada como referência; os novos pixels são próprios, sem copiar imagens do cliente. **V3 não aprovada visualmente, não mesclada e não integrada ao Pokémon Torre 2.** Slash V5.4 aprovada e todas as versões anteriores seguem intactas.

## Seis golpes V4 — pixel art redesenhada (revisão visual pendente)

**[Abrir laboratório da V4 (com comparador V3/V2/V1)](./moves-v4.html)**

Após as rejeições das primeiras três prévias, foi implementado um conjunto **totalmente novo de 32 matrizes de pixels originais**, usado como base de 18 quadros de animação para os seis golpes **Flame Burst, Frost Breath, Air Slash, Razor Shell, Shadow Punch e Meteor Mash**. O próprio desenho é bitmap indexado: não usa curvas CSS, blur, Canvas paths, polígonos ou primitivas de Phaser.Graphics. O renderizador apenas apresenta a folha PNG em WebGL com nearest-neighbor.

- Matrizes autorais: `src/move-six-v4-cels.mjs`.
- Compilação determinística: `src/build-move-six-v4.mjs`.
- Seis PNGs e manifesto: `effects/moves/six-v4/`.
- Adaptador Phaser 3/WebGL com relógio de quadros único: `src/move-six-v4.js`.
- Galeria independente: `moves-v4.html`.
- Testes Node e Chromium: `tests/move-six-v4.test.mjs`, `tests/move-six-v4-browser.cjs`.

**Situação:** V4 não aprovada visualmente e não instalada no Pokémon Torre 2; as versões anteriores continuam registradas apenas para A/B. A Slash V5.4 aprovada foi preservada sem alteração. Detalhes em `docs/POKEMON-MOVES-SIX-V4.md`.


## Laboratório V6 — composição com recursos reais do Arsenal (revisão pendente)

**[Prévia V6 — seis golpes com texturas CC0 e comparação V5](./moves-v6.html)**

Esta revisão experimental substitui a estratégia de acrescentar mais formas geradas por código por um compositor de sprites/imagens. Consulte [a auditoria da biblioteca e dos seis golpes](docs/POKEMON-MOVES-SIX-V6-ARSENAL.md).

- Fontes do Arsenal consultadas: Effekseer, Pixelorama, LibreSprite, Playwright e EffectCraft. **Somente 11 texturas CC0 do Effekseer foram efetivamente importadas**; os editores não foram instalados ou executados.
- As onze texturas estão em `assets/vendor/effekseer-v6/` com origem, licença, revisão upstream fixa e SHA256 por arquivo.
- `src/move-six-v6.js` posiciona as texturas conforme material e gesto real de Flame Burst, Frost Breath, Air Slash, Razor Shell, Shadow Punch e Meteor Mash. Quatro silhuetas de contato são explicitamente preservadas, evitando substituir concha e punhos por círculos genéricos.
- `moves-v6.html` permite inspecionar preparação, trajetória, contato, dissipação e V5/V6, além de ligar/desligar os materiais CC0.
- A prova técnica usa sprites reais no Phaser/WebGL em Chromium desktop e celular, e compara material ON/OFF; **a aprovação estética não é automática**.
- **Sem merge, sem integração ao Pokémon Torre 2, sem alterar V5.4 aprovada, saves ou mecânicas**.
