# V7 — seis golpes reconstruídos do zero

**Estado: revisão estética pendente.** Este trabalho não utiliza os módulos, cels ou assets rejeitados V1–V6. Branch criado a partir da base isolada dos efeitos Slash V5.4, que não foram editados.

## Motivo de abandonar a V6

A V6 misturava sprites pequenos e texturas CC0 do Effekseer por cima de formas procedurais. As capturas reais mostraram Flame Burst como um impacto pouco legível, outros golpes com anéis de energia e pouca identidade. CI verde não é aprovação estética.

## Nova produção e procedência

- Base nova: nove spritesheets geradas a partir do [PixelFX](https://github.com/patch-gg/pixelfx) no commit fixo `a84159688af3ca37a4be05a0d422b94451b2e24e`, sob licença MIT. Ativos são exportados, não cópias de sprites do Poké Arena 2D. [Fonte e créditos](../../assets/v7/manifest.json).
- Fonte de importação repetível: `tools/export-v7-from-pixelfx.mjs`, que clona e fixa o commit, rende frames transparentes e valida PNG, metadados e SHA256. O GitHub Actions não altera o upstream.
- Três novas artes de ataque originais (sem reuso V5/V6): `shell`, `ghost`, `steel`, desenhadas por código editável em `tools/build-relics-v7.py` e exportadas em 16 quadros de 112×112 px. Foram inspecionadas em montagem 3×3.
- Animações Phaser: `src/moves-v7-clean.js`; galeria de foco individual `moves-v7.html`.
- O padrão aprovado do Pokémon Torre 2 continua sendo a referência estética; não foi copiada nenhuma sprite do cliente Poké Arena 2D.

## Identidade de cada golpe

| Golpe | Trajetória | Contacto | Recuperação |
| --- | --- | --- | --- |
| Flame Burst | projétil de fogo com cauda | rompe em 5 línguas de chama | brasas dispersas e dissipação |
| Frost Breath | sopro de ar congelado saindo do atacante | cristais estilhaçados | névoa fria perde intensidade |
| Air Slash | três foices finas sequenciais | lâmina curva de vento | corte se desfaz em partículas |
| Razor Shell | concha desenhada com sete nervuras, empunhadura e rotação | corte aquático com respingos | concha prossegue e a água cai |
| Shadow Punch | punho púrpura definido, quatro placas de dedos e polegar | choque localizado na ponta dos dedos | sombra residual |
| Meteor Mash | manopla metálica com quatro dedos e rebites | faíscas e impacto físico na ponta dos dedos | contração rápida de brilho |

## Segurança, arte e testes

- Apenas laboratório isolado, sem merge. `gameIntegrationEnabled=false` e `approved=false` no manifesto.
- A Slash V5.4 não foi reescrita; o manifesto anterior conserva exatamente o estado `pending_visual_review` registrado na origem (não afirmar que consta como `approved=true`).
- Sem alteração no Pokémon Torre 2, HUD de batalha, saves, efeitos nativos ou lógicas de jogo.
- Testes Node verificam sha256 dos nove arquivos, transparência/frames, os três desenhos originais e a ausência de importações V1–V6.
- Chromium Phaser/WebGL desktop+mobile verifica carregamento, seleção dos 6 golpes, frame de preparação 2, movimento 9, contato 14, dissipação 20, mudança de fundo, pausa/velocidade e screenshots de cada ataque.
- Conferência de arte usa `tools/analyze-v7-frames.py` para identificar quadros vazios/dissipados. Os primeiros testes foram reprovados manualmente porque o Fire Burst surgia como um ponto luminoso e Air Slash já havia desaparecido: isso motivou remapeamento dos quadros.
- **Sem aprovação visual humana, não mesclar.** Capturas comprovam renderização e ajudam a revisar arte, não provam qualidade comparável ao cliente.

## Teste

[Laboratório V7](../moves-v7.html). Scripts: `node --test tests/moves-v7.test.mjs`; `node tests/moves-v7-browser.cjs` com Chromium. Para reconstruir do zero, execute a Action `V7 Original PixelFX Animations — clean-room build` no branch V7.
