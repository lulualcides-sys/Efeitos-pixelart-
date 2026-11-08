# Revisão obrigatória de seis golpes — V5 (08/11/2026)

**Finalidade:** impedir recomendação/produção de golpes já existentes no Pokémon Torre 2. A V5 antiga não representa seis movimentos inéditos. Nenhuma integração ao jogo autorizada.

## Checagem da V5 original

| Golpe | Resultado conferido | Ação |
|---|---|---|
| Aqua Tail | `pokearena2d-source-moves.json`: ID `aquatail`, `nativeScopes: active`, forma `tajo` no Gyarados; Arena 121 contém Aqua Tail; Feraligatr também possui `aqua-tail`. | Excluir |
| Dragon Rush | `pokearena2d-source-moves.json`: ID `dragonrush`, forma `dash`, escopo `disabled`, exemplos Gible/Gabite/Garchomp. | Excluir; existe no catálogo nativo, mesmo desabilitado |
| Power Gem | `kanto-new-phaser-moves.json`: apenas plano `needs-new-phaser-vfx`; aparece em learnsets e na matriz de faltantes. Não foi comprovado efeito funcional. | Excluir preventivamente do lote 'não temos', revisar runtime separado |
| Leaf Storm | `kanto-new-phaser-moves.json`: apenas plano `needs-new-phaser-vfx`; aparece em learnsets e na matriz de faltantes. Não foi comprovado efeito funcional. | Excluir preventivamente do lote 'não temos', revisar runtime separado |
| Night Daze | Não apareceu nas fontes verificadas. | Manter, sob ressalva de branches ainda não vistas |
| Boomburst | Não apareceu nas fontes verificadas. | Manter, sob ressalva de branches ainda não vistas |

## Seis candidatos para substituir a seleção anterior

1. Night Daze — sombrio — onda de escuridão e explosão localizada.
2. Boomburst — normal — pressão acústica e pulso multidirecional.
3. Mystical Fire — fogo — chamas místicas de perfil próprio, sem copiar Sacred Fire.
4. Spirit Shackle — fantasma — flecha sombria de aprisionamento, não um genérico Shadow Ball.
5. Plasma Fists — elétrico — punhos elétricos e descargas de contato.
6. Diamond Storm — pedra — cristais facetados lançados em leque, distintos de Power Gem.

**Escopo efetivamente consultado:** catálogo nativo do cliente (`data/pokearena2d-source-moves.json`), kits de Arena 121, Johto 100 e campanha, decisões VFX, política de reuso, catálogos personalizados, lista de VFX planejados, learnsets, documentação de ataques instalados não usados na campanha e biblioteca de efeitos V4/V5. Conclusão limitada aos arquivos inspecionados; branches e conteúdo externo podem mudar. **Não confundir compatibilidade de learnset com golpe renderizado.**

**Estado:** auditoria e seleção corrigidas; não geradas nem aprovadas as quatro animações substitutas. A V4 segue aprovada e preservada. A V5 original segue em revisão e não deve ser apresentada como seis golpes novos.

## Arquivos consultados

- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/data/pokearena2d-source-moves.json
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/tools/pokearena/torre2-arena-approved-121.js
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/tools/pokearena/torre2-johto-100-species.js
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/data/kanto-new-phaser-moves.json
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/data/vfx-selection-decisions.json
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/data/move-reuse-policy.json
- https://github.com/lulualcides-sys/Pok-mon-torre-2/blob/main/docs/MATRIZ-GOLPES-FALTANTES-SPRITES-E-ESTATISTICAS.md
