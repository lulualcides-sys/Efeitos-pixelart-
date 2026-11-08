# V6 experimental — Arsenal, amostras CC0 e identidade dos seis golpes

**Status: revisão estética pendente.** V1–V5 foram rejeitadas por aparência genérica, renderização excessivamente geométrica ou pixelização grosseira. Passar testes técnicos não altera esse status.

## Fontes do Arsenal efetivamente pesquisadas

- Arsenal/ferramentas/ANIMACAO-VFX-10-FERRAMENTAS-2026-11-06.md: Effekseer é adequado a estudos de impacto e partículas; listado, não instalado.
- Arsenal/ferramentas/PIXELART-UI-PHASER-7-FERRAMENTAS-2026-11-04.md: Pixelorama/LibreSprite são editores de sprites, Playwright é validador visual. São referências catalogadas, não executáveis instalados neste projeto.
- Arsenal/toolkits/pokemon-campanha-design/README.md: limitações de integração e necessidade de teste isolado.
- Cliente Poké Arena 2D capturado em Pok-mon-torre-2/src-968afec4c1/vfx.js: consultadas as texturas pequenas, a estrutura MAPAS, as paletas PALETAS_VFX e o carregamento de spritesheets HOJAS como orientação técnica. Nenhum pixel desse cliente foi copiado.
- Effekseer sample library: 11 texturas PNG de terceiros com licença CC0 efetivamente baixadas e preservadas no branch V6 com hashes SHA256.

## Texturas incorporadas de verdade

Flame01, Burst01, Crystal001, Icicle001, SwordLine01, Foam001, Fog001, Spark001, Shock_wave004, SnowCrystals_S e Particle02.

Os arquivos estão em assets/vendor/effekseer-v6 e seu manifesto guarda nome, dimensões, tamanho, origem e SHA256. O script tools/import-arsenal-effekseer-v6.mjs reproduz a importação a partir do commit fixado b5700082b49bc5f919610880dafddc90211a9a4e. Licenciamento: https://github.com/effekseer/Effekseer/blob/b5700082b49bc5f919610880dafddc90211a9a4e/docs/readme_sample.txt (declara CC0 para as amostras).

**Não foi executado o editor desktop Effekseer.** Tampouco foram instalados Pixelorama, LibreSprite ou EffectCraft nesta etapa. O uso real é das texturas CC0 originais e do compositor Phaser/WebGL implementado aqui. Não confundir licença do editor e licença das texturas.

## Identidade por golpe preservada no laboratório

| Golpe | Estrutura V5 mantida | Material CC0 V6 específico |
| --- | --- | --- |
| Flame Burst | projétil de chamas deformáveis e explosão | Flame01 no avanço e Burst01 no impacto |
| Frost Breath | sopro de ar frio com cristais | Fog001, SnowCrystals_S, Icicle001 e Crystal001 |
| Air Slash | três lâminas finas de vento | SwordLine01 escalonado em trajetória e contato |
| Razor Shell | concha cortante com nervuras e água | Foam001 e SwordLine01 com gotas aquáticas |
| Shadow Punch | punho espectral de dedos distintos | Fog001 roxo, Particle02 e Shock_wave004 |
| Meteor Mash | manopla metálica angular | Spark001 dourado, Burst01 e anel de impacto |

O compositor src/move-six-v6.js não aplica um efeito genérico recolorido. Os materiais, trajetórias, quantidade de sprites, opacidade e dissipação são específicos de cada golpe. A nova prévia moves-v6.html oferece comparação V6 versus V5 e toggle que remove fisicamente as camadas de textura para detectar falsas melhorias.

## Critérios técnicos e segurança

- A V6 só existe no branch e na PR experimental, sem merge.
- A Slash V5.4 aprovada não sofre alterações.
- O Pokémon Torre 2, seus saves, golpes nativos, dano, status e cooldowns não foram modificados.
- Testes Node validam PNG real, SHA256 de todos os assets, origem e presença de todos os seis golpes.
- Teste Chromium Phaser/WebGL valida desktop/mobile, frame de contato 10, dissipação 13, presença real das texturas quando habilitadas, ausência quando desabilitadas e comparação V5/V6.
- A aprovação estética é responsabilidade de revisão visual posterior. Tecnologicamente válido não significa bonito ou equivalente ao Poké Arena 2D.

## Referências públicas

- https://effekseer.github.io/en/contribute.html
- https://effekseer.github.io/en/introduction.html
- https://pixelorama.org/user_manual/cli/
- https://www.phaser.io/oss/docs/phaser-editor/scene-editor/sprite-animations
