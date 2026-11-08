# Redesenho V4 — seis golpes em bitmap pixel art

A V1, V2 e V3 foram rejeitadas pelo proprietário por parecerem efeitos genéricos com formas geométricas/glow estilo CSS. A V4 substitui a **base dos desenhos**: 32 cels de oito tons com recortes explícitos por pixel, organizadas em ataques de 18 quadros. Fontes de bitmap originais são mantidas em `src/move-six-v4-cels.mjs` (todas as poses do VFX estão nela); não há imagens do Poké Arena 2D copiadas.

## Gestos e leitura, golpe por golpe

| Golpe | Keyframes físicos | Material e gesto |
| --- | --- | --- |
| Flame Burst | flame1/flame2/flame3, fireHit1/2/3 | chamas assimétricas com centro quente; explosão que se divide em línguas; brasas |
| Frost Breath | iceWind1/2, iceHit1/2 | correntes de sopro frio com vazios; cristais surgem e racham no impacto |
| Air Slash | air1/2, airHit | foices de vento com borda nítida em sequência; dissipação rápida |
| Razor Shell | shell1/2, shellGrooves, shellHandle, shellEdge, waterBurst | concha cortante, nervuras, empunhadura, lâmina aquática e gotas |
| Shadow Punch | ghost1/2, ghostKnuckles, ghostThumb, ghostImpact | punho fantasma com quatro conjuntos de nós, polegar e resíduo roxo |
| Meteor Mash | metal1/2, metalKnuckles, metalImpact | punho metálico com quatro placas articulares e faíscas amarelas |

## Separação estética e funcional

- **Nenhuma alteração em Pokémon Torre 2.** Não há implementação de dano, status, captura, cooldown ou troca de golpes.
- **Preserva Slash V5.4**, todas as spritesheets e versões antigas.
- Fonte visual estudada: cliente Poké Arena 2D capturado, sob `lulualcides-sys/Pok-mon-torre-2/src-968afec4c1/vfx.js` (padrões de spritesheets, tipos de paletas e tempo de animação), **sem importar pixels**.
- Direção de pixel art: quadros/cels separados e empilhados conforme o funcionamento de <https://aseprite.com/docs/basics/>; exposição rápida do frame de impacto e dissipação em formas partidas conforme <https://cursogame.dev/blog/pixel-art-explosao/>.
- Mecânica do golpe consultada em <https://bulbapedia.bulbagarden.net/wiki/Flame_Burst>, <https://bulbapedia.bulbagarden.net/wiki/Frost_Breath> e <https://bulbapedia.bulbagarden.net/wiki/Razor_Shell>.
- O **estado V4 é apenas prova técnica**. Passar testes não equivale a alcançar a qualidade estética solicitada. Qualquer integração exige aprovação visual explícita e testes no renderizador-alvo real.

## Formato e validação

- Cada PNG é indexado (8 tons + transparência), 2880×480: **18 frames de 160×160 em três linhas**, cada linha uma camada.
- Fonte lógica de 80×80 com zoom 2× inteiro; sem antialias ou filtros de borrão.
- Quadro de contato proposto: 9; o disparo de acerto real permanece fora da biblioteca.
- Criador e PNG validam igualdade bit a bit, tamanho e cor indexada, decodificação zlib e slots transparentes.
- Teste real Chromium WebGL (desktop e landscape mobile), com screenshots de contato e dissipação e comparação selecionável V4/V3/V2/V1.
