# V9 — prévia online dos seis golpes

**Estado:** cinco PNGs publicados em branch de revisão, página HTML independente e testes automatizados. **Não aprovada visualmente, sem integração ao Pokémon Torre 2.**

## Arquivos publicados no GitHub

- Cinco spritesheets PNG indexadas com transparência em `assets/v9/`: `flame-burst.png`, `frost-breath.png`, `razor-shell.png`, `shadow-punch.png` e `meteor-mash.png`.
- Cada folha mede 320×320 px, com grade 4×4 de 16 quadros de 80×80 px. SHA256 e tamanho: `assets/v9/manifest.json`.
- Controlador Phaser/WebGL `src/moves-v9-phaser.mjs` carrega e reproduz as folhas sem alterar dano, cooldown ou as regras de batalha.
- Galeria [moves-v9.html](../moves-v9.html) reúne os cinco PNGs e o Air Slash V8 original. Controles para preparar, mover, impactar, dissipar, pausar e alternar fundos.
- Testes `tests/moves-v9-asset-integrity.test.mjs` e `tests/moves-v9-browser.cjs` verificam PNG/SHA256 e Chromium desktop/mobile.
- Workflow `.github/workflows/moves-v9-online.yml` executa a validação e captura screenshots.

## Correção de publicação

A falha HTTP 403 anterior ocorreu durante uma tentativa de transferência intermediária via serviço externo. Os cinco PNGs originais foram agora enviados diretamente por blobs GitHub API, sem converter os arquivos por miniaturas ou depender de assinaturas temporárias. A página carrega os PNGs do próprio repositório, com caminho relativo. O Phaser 3 continua vindo do jsDelivr.

O teste pode abrir em URL `https://raw.githack.com/.../moves-v9.html` fixada em commit, sem baixar arquivo ou ZIP.

## Preservação

- Air Slash V8 permanece como estava: `playV8(scene,'air-slash')`; a V9 não define um sexto PNG para ele.
- V8 e a Slash V5.4 permanecem sem modificações.
- Nenhum código integrado ao Pokémon Torre 2, combate, saves, golpes nativos ou `main`.
- Teste técnico não é aprovação estética. Nenhum merge antes da revisão visual.
