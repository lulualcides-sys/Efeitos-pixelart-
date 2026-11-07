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


## Regra adicionada — arte elemental V3 (07/11/2026)

Preservar **exatamente os arquivos V1 e V2** quando novos materiais forem criados. Usar IDs estáveis e versão `v3` para novos efeitos. Para cada elemento, construir silhueta/material real com núcleo, borda, rastro e fragmentação próprios; não apenas trocar a cor do mesmo arco. Os seis materiais oficiais deste lote: Fogo / Luz / Gelo / Vento / Natureza / Espectro.

A aprovação anterior refere-se ao **formato em arco**; não autoriza automaticamente nenhum acabamento elemental. Registrar testes Node, Phaser WebGL desktop/mobile, screenshot e resultado da avaliação humana antes de integrar ao jogo.
