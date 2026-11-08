# Slash V5 — correção de forma e movimento (2026-11-07)

## Conclusões do vídeo
Analisada a sequência original enviada pelo usuário de **4,53 a 5,12 s**:
- 4,53 s: traços de entrada e partículas esparsas;
- **4,66 s: golpe principal alongado**, base horizontal com ponta fina se elevando à direita;
- **4,76–5,12 s: fragmentação imediata**, com material separado e pouca persistência da lâmina principal.

**Erro da V4:** manter um arco praticamente circular, com os seis efeitos usando a mesma estrutura e os fragmentos presos a essa curva. O usuário rejeitou a V4 e foi fechada sem merge.

## Correção implementada V5
- Curvatura geral de foice preservada como conceito, mas **proporção horizontal alongada** no ataque.
- Largura de pincel restrita a poucos pixels nativos; highlights finos e interrupções em vez de massa colorida.
- Material específico nasce junto do golpe: fogo/brasas, brilho solar, cristais de gelo, vento fino, folhas verdes, energia espectral.
- A lâmina contínua desaparece depois da janela de ataque (frames 0–5) e os componentes seguem com velocidade tangencial/outward (frames 6–11).
- V5 144×144 nativo, 12 frames e 16 FPS (0,75s), PNG 8-bit indexado e transparente, filtro NEAREST.
- O código gerador reproduz as spritesheets `src/build-slash-v5.mjs` e `tools/export-slash-v5.mjs`.
- Laboratório Phaser/WebGL com V5/V2/V1, play/pause, velocidades, **Ver golpe** (frame 4), **Ver fragmentos** (frame 7).
- Sem reutilização ou redistribuição de pixels do vídeo original.

## Verificação
Executar `node tools/export-slash-v5.mjs` e `npm test` para integridade pixel por pixel. O CI deve capturar screenshots desktop/mobile nos dois quadros. A avaliação estética final pertence ao usuário, não ao teste.

## Segurança
V1 e V2 ficam sem alterações, PR V3 e V4 fechadas e nunca mescladas. V5 é **draft**, não publicada no Pokémon Torre 2. Não modificar golpes, código nativo do Poké Arena 2D, saves, HUD nem gameplay.
