# V9 — 5 golpes em spritesheets ilustradas

**Estado: integração em andamento.** A revisão visual da V8 foi rejeitada para cinco golpes, enquanto **Air Slash V8 permanece aprovado e intocado**.

## Feito

- Cinco imagens de 16 quadros geradas especificamente para Flame Burst, Frost Breath, Razor Shell, Shadow Punch e Meteor Mash.
- Imagens convertidas localmente em cinco atlases PNG transparentes, cada um de 320×320 px (16 cels 80×80), e um manifesto com SHA256.
- API Phaser 3/WebGL preparada: \`src/moves-v9-phaser.mjs\`, com \`preloadV9\` e \`playV9\` e sem alterar a lógica de batalha.
- Teste local dos PNGs, dimensions e integridade do controlador passou em Node.

## Pendente de verificação/publicação

**Os cinco PNGs do pacote local ainda não estão armazenados neste branch GitHub**; portanto a função Phaser de V9 só pode ser usada quando os arquivos PNG estão presentes em \`assets/v9/\`. Não colocar esta branch em produção ou alegar que a galeria está publicada enquanto faltar este passo.

A prévia autocontida, as cinco imagens PNG e o módulo Phaser estão disponíveis como artefato ZIP na conversa. Nenhuma arte do cliente base Poké Arena 2D foi extraída ou copiada.

Air Slash segue da V8: nunca sobrescrever \`src/moves-v8-director.js\` ou as respectivas spritesheets aprovadas. Os demais golpes não substituem V8 automaticamente até a aprovação visual e o upload dos PNGs.

## Controle de qualidade antes do merge

- Verificar os cinco arquivos PNG 320×320 RGBA/indexados com alfa.
- Verificar 16 frames uniformes por ataque, tamanho e transparência em todas as fases.
- Renderizar no Phaser/WebGL e revisar contato, trajetória, dissipação e escala real, em Android e desktop.
- Aprovação estética explícita antes de integrar qualquer efeito ao Pokémon Torre 2.
