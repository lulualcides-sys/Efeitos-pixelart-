# Padrão obrigatório — Biblioteca original de VFX

- Usar este repositório para os efeitos autorais; manter integração com Pokémon Torre 2 separada.
- Criar cada golpe como asset original em pixel art com variantes/spritesheets e licença/proveniência documentadas. Nunca copiar pixels do vídeo, marcas d'água ou artes sem permissão.
- **Laboratório animado Phaser/WebGL** sempre presente, com comparador antes/depois, loops, pausa e controle de velocidade; servir por HTTP no navegador, sem introduzir Canvas 2D no combate.
- PNG indexado com transparência real; nearest-neighbor; aprovação visual humana antes de liberar efeitos.
- Sempre manter a V1 original; versões rejeitadas não substituirão arquivos aprovados nem o baseline.
- Para Slash, conservar a curvatura de foice do vídeo (quadros 4,61–5,02s): parte inferior longa e espessa, ponta alta e fina que se curva à esquerda, duas ou três trilhas internas assimétricas, partículas de fragmentação coerentes. Não endireitar nem desenhar arco-íris simétrico.
- Seis personalidades visuais: rubro com pétalas/brasas, dourado com filamentos, ciano com estilhaços, marfim com vento, esmeralda com folhas e oliva com esporos. Cada um deve ter silhueta e ritmo próprios.
- Testar integridade PNG, número de quadros, regressão do arquivo original, Phaser/WebGL Chromium desktop/mobile e screenshots; **CI verde não implica aprovação estética**.
- Sem alterar dano, hitboxes, cooldowns, kits originais do Poké Arena 2D, golpes aprovados, saves, UI de batalha ou publicar mudanças no jogo sem autorização explícita.

### Histórico
- PR #1 (Slash lateral): **fechada, nunca mesclada**, após reprovação do proprietário.
- V1 = arc original preservado.
- V2 = refino em arco sob revisão no laboratório.


## Revisão da rejeição V4 (2026-11-07)

A V4 foi rejeitada: não manter seis arcos fechados com fragmentos presos à curvatura. Os elementos do vídeo original transitam em décimos de segundo de uma lâmina **alongada** para detritos separados. Na V5, limitar a largura do stroke e separar as fases: 0–5 (corte) / 6–11 (dissipação). Os sprites V1/V2 são imutáveis. Manter as seis identidades elementais separadas por geometria e material, e exibir quadro de impacto/fragmentação lado a lado com a V2.

## AUDITORIA ANTI-DUPLICATAS — regra obrigatória antes de sugerir golpes (2026-11-08)

**Jamais recomendar um golpe como ausente consultando somente o catálogo de efeitos aprovados.** Verificar a biblioteca completa do Pokémon Torre 2, incluindo golpe nativo, kit em uso, efeitos customizados, efeitos ainda não aprovados, planejamento e versões de revisão. Normalizar IDs: `Aqua Tail`, `aqua-tail` e `aquatail` são o mesmo golpe.

Fontes obrigatórias, nesta ordem:
1. `Pok-mon-torre-2/data/pokearena2d-source-moves.json`: os nomes nativos, `nativeScopes` (active / disabled), `forms`, `nativeExamples`; nunca chamar golpe desabilitado de inexistente.
2. `tools/pokearena/torre2-arena-approved-121.js`, `docs/ARENA-121-KITS-APROVADOS-2026-10-29.md`, `tools/pokearena/torre2-johto-100-species.js`, `tools/pokearena/torre2-move-pool.js`: Arena, Johto, campanha e golpes efetivamente equipados.
3. `data/vfx-selection-decisions.json`, `data/move-reuse-policy.json`, módulos `torre2-adapted-moves-fx.js`, `batch24`, `surge3` e outros catálogos/VFX do jogo: efeitos instalados ou em revisão, sem confundir aprovação com existência.
4. `data/kanto-new-phaser-moves.json`, `docs/MATRIZ-GOLPES-FALTANTES-SPRITES-E-ESTATISTICAS.md` e learnsets: distinguir planejado, compatível e implementado. Nomes em learnset ou plano NÃO provam uma animação pronta.
5. O repositório Efeitos-pixelart- e branches/PRs ainda abertas, incluindo a V4 aprovada e a V5 sob revisão; verificar duplicação contra todo o material da biblioteca, não só main.
6. Resultado obrigatório por candidato: nativo ativo, nativo desabilitado, kit existente, VFX customizado instalado, arte isolada em revisão, apenas planejado, não encontrado nas fontes verificadas ou não verificado. Citar fonte; nunca transformar 'não encontrei' em 'não existe'.

**Casos reais verificados em 2026-11-08:**
- Aqua Tail: nativo `aquatail` ativo, forma `tajo` (Gyarados), também aparece nos kits aprovados da Arena e em Feraligatr. **Não recomendar novamente** como novo golpe.
- Dragon Rush: `dragonrush` consta do catálogo nativo com `nativeScopes: disabled` (Gible/Gabite/Garchomp). Não recomendar como ausente, mesmo que o modo em produção esteja desabilitado.
- Power Gem e Leaf Storm: encontrados no catálogo de planejamento `data/kanto-new-phaser-moves.json` com `needs-new-phaser-vfx`; isso não comprova efeito implementado. Exigem inspeção do runtime antes de nova recomendação.
- Night Daze e Boomburst: ausentes dos registros principais consultados em 2026-11-08. Ausência no snapshot não garante ausência em branches externas.

**Escopo:** novas artes somente no laboratório de VFX. Não integrar golpe ou sobrepor biblioteca aprovada do jogo sem autorização explícita.
