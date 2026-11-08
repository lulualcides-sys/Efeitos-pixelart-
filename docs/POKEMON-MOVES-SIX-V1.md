# Seis golpes novos — revisão de VFX, lote 1

## Escopo
Biblioteca visual independente do jogo. Desenhos autorais; não copiar frames do Poké Arena 2D, jogos comerciais ou fontes com licença não permitida.

| ID | Golpe | Tipo | Sequência |
|---|---|---|---|
| flame-burst | Flame Burst | Fogo | Projétil flamejante com forma irregular -> explosão curta -> brasas |
| frost-breath | Frost Breath | Gelo | Sopro divergente -> cristais facetados -> névoa residual |
| air-slash | Air Slash | Voador | Três lâminas de vento em arco, escalonadas -> corte -> dissipação |
| razor-shell | Razor Shell | Água | Golpe de concha cortante em meia-lua -> gotas -> respingos |
| shadow-punch | Shadow Punch | Fantasma | Punho espectral de quatro nós -> contato -> energia difusa |
| meteor-mash | Meteor Mash | Aço | Punho metálico em diagonal com faíscas -> estrela de impacto -> detritos |

## Contrato visual
- Cada spritesheet: PNG indexado, paleta específica de seis cores + transparência, 2304×288 px.
- Quadros: 16 por camada, 144×144 px. Corpo frames 0–15, partículas 16–31 no mesmo atlas de duas linhas.
- Frame de contato sugerido: 9; a mecânica real de acerto/colisão deve ser vinculada no motor do jogo **somente se o lote for aprovado e liberado para integração**.
- Timing variável `[50,45,43,42,40,38,37,40,44,85,55,52,55,60,65,70]` em milissegundos; sem filtros CSS, Canvas 2D ou vídeo.
- Renderizador Phaser/WebGL nearest-neighbor, 2 sprites por golpe, sem cópia de VFX anteriores.

## Preservação e critérios
- A versão aprovada Slash V5.4 permanece em `index.html` e `effects/slash/arc/material-v5-4/`.
- Novos golpes não substituem nem duplicam a origem nativa do cliente-base P2. A auditoria de nomes foi realizada antes da seleção em `data/pokearena2d-source-moves.json` e no cliente capturado em Pokémon Torre 2, mas a ausência nesses índices **não garante** ausência em toda versão futura.
- Os seis VFX são prévias, não golpes equipáveis. Não há alterações em Pokémon Torre 2 ou em seus saves.
- Aprovação visual distinta de integração funcional. Para integrar: conferir nome canônico atualizado, licença, hitbox/dano/status, renderizador real de cada modo, CI completo e visual browser na versão alvo.
- Testes: PNG byte a byte reproduzível, formato/compactação, movimento, contagem de texturas, Chromium desktop/mobile, alternância de fundos, quadros de impacto/dissipação.

## Visibilidade
Visualize `moves.html` no branch da PR. Todos os seis podem ser vistos e revisados juntos; não mesclar sem aprovação estética.
