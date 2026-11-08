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


## V4 — seis arcos elementais fragmentados (revisão visual)

A V3 **foi rejeitada e fechada**, sem publicação. A V4 tenta corrigir o problema de desenho: em vez de arcos sólidos recoloridos, usa componentes descontínuos similares aos princípios observados em 00:04.76 do vídeo enviado, sem copiar arte externa. São seis linguagens: **brasas, fitas solares, cristais de gelo, correntes de vento, folhas, e partículas espectrais**.

- Pasta: `effects/slash/arc/fragmented-v4/`
- 12 quadros de **144×144** por animação; PNG paletizado com transparência.
- Laboratório Phaser/WebGL: **V4 · Elementos**, **V2 · Arco**, **V1 · Original**, controles de reprodução e velocidade.
- V1 e V2 não são alteradas. V4 é apenas um protótipo artístico, ainda não aprovado.

Veja `docs/SLASH-V4-ART-DIRECTION.md` para os detalhes extraídos da análise visual e limites de uso.
