# Slash V4 — estudo da referência e direção artística

**Vídeo de referência fornecido pelo usuário:** 1001014449.mp4, 1080×1920, 30 FPS. Quadro mais legível em **00:04.76** (compare também 00:04.66–00:05.12).

## O problema da V3
A V3 era uma **faixa grossa e contínua** em seis cores. O vídeo usa seis formas diferentes, com áreas transparentes grandes, lâminas secundárias e partículas separadas. A curvatura da foice foi aprovada; o acabamento V3 foi rejeitado.

## O que foi criado na V4
V4 é arte original pixel art de **144×144 por quadro**, 12 quadros a 24 FPS, paletas indexadas com transparência, compatível com Phaser/WebGL. A trajetória C é semelhante à V2, mas o efeito não usa preenchimento sólido.

| Arquivo | Leitura visual |
| --- | --- |
| ember-rake | Cacos de carvão incandescente, pontas de chama, brasas em movimento |
| solar-crescent | Ribbons finos dourados, pequenas estrelas luminosas |
| frost-shatter | Placas de gelo separadas, facetadas e estilhaços grandes |
| ivory-gale | Traços leves de vento, rastros longos e quebrados |
| verdant-sickle | Folhas pontiagudas, fragmentos orgânicos e lâminas verdes |
| astral-reaver | Rastros escuros, detritos lilás, luz amarela e motes espectrais |

Os elementos descritos são **interpretações originais** dos princípios da referência. Os arquivos e a marca do vídeo não foram extraídos nem redistribuídos.

## Critérios de revisão
- Avaliar quadros 3–9 em velocidade normal, não apenas screenshot estático.
- **V1/V2 preservadas** como base reversível; V3 rejeitada é descartada.
- O laboratório deve permitir alternância V1/V2/V4, pause, 0,5× e 1×.
- Renderer WebGL ativo, filtro NEAREST. V4 deve usar quadros **144×144**, não recortar como 96×96.
- Aprovação estética exige revisão do usuário. Testes automatizados apenas validam funcionalidade.
- Sem alteração nos golpes, HUD, clima, dano, cooldown, saves ou sprites aprovados do Pokémon Torre 2.

## Próxima iteração
Após revisão, ajustar individualmente apenas os estilos rejeitados; preservar os demais e manter identidade elemental. Para futuras mudanças, registrar receita de arte e fonte geradora com teste de reprodução antes de alterar a versão visual.
