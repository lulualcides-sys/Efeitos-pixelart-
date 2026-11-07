# Efeitos Pixelart — laboratório VFX
Biblioteca independente de efeitos próprios em pixel art para reutilização futura no Pokémon Torre 2 e em outros projetos.

## Slash — linha aprovada de trabalho
A **V1** em arco é o ponto de partida preservado; nunca substituir seus pixels. A **V2** em arco de foice é um experimento de refino para revisão visual, não uma aprovação automática. A versão lateral anterior foi descartada, sem entrar na branch principal.

- `effects/slash/archive/v1/`: seis PNGs de arcos originais.
- `effects/slash/arc/refined-v2/`: seis efeitos em C/foice com corpo largo na base e ponta curva.
- `index.html`: **laboratório permanente Phaser/WebGL** em 2×3, com autoplay, pausa, velocidade e comparação V1/V2.
- `src/slash-vfx.js`: API de VFX exclusivamente visual, opt-in, nearest-neighbor.
- `docs/VFX-STANDARDS.md`: critérios de aprovação, autoria e integração.

## Referência visual
Vídeo enviado pelo proprietário: em cerca de 4,6 segundos aparecem os seis arcos, um no sentido de foice **da base esquerda, percorrendo o fundo, erguendo-se à direita e curvando a ponta por cima**. Não é uma faixa reta horizontal nem um semicírculo perfeito. O desenho é original; não extraímos sprites do vídeo.

## Garantias
A PR de homologação **não modifica** os golpes nativos do Poké Arena 2D, o jogo Pokémon Torre 2, os salvamentos, os efeitos aprovados ou a batalha.

**Status:** V1 recuperada, V2 refinada em revisão, não publicada.


## V3 — Slash elementais (em revisão)

Novos efeitos em **`effects/slash/arc/elemental-v3/`** mantêm o arco em foice aprovado e criam seis materiais originais: **fogo** (línguas de chama/brasas), **luz solar** (filamentos/estrelas), **gelo** (facetas/estilhaços), **vento** (filetes paralelos), **natureza** (folhas com veias) e **espectro** (rastros violetas/fagulhas espectrais).

O laboratório carrega **V1, V2 e V3** na mesma cena Phaser/WebGL, com botões para comparar, pausar e mudar velocidade. V1 e V2 continuam preservadas bit a bit. Os PNGs V3 são autorais, não extraídos do vídeo de referência.

**Aprovação:** forma em arco aceita pelo proprietário; acabamento V3 continua pendente de revisão visual. Não existe integração automática com Pokémon Torre 2.
