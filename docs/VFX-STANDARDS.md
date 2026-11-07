# Padrão da biblioteca de VFX — Pixel Art

## Regras permanentes

1. **Toda nova arte é criada nesta biblioteca**, fora do jogo. Cada efeito possui ID estável, paleta, PNG 96×96 por quadro, manifesto e número de versão.
2. **Laboratório animado é obrigatório**: painel com reprodução contínua sem intervenção, pausa, controle de velocidade, comparação V1/V2. A prévia final deve usar Phaser/WebGL e filtro NEAREST; CSS só pode servir como opção auxiliar fora do jogo.
3. **Aprovação visual não é inferida de CI verde**. CI verifica integridade técnica e imagens renderizadas. Aprovação somente após avaliação visual do proprietário.
4. **Preservar todas as versões anteriores** em archive. Rejeições não apagam o histórico nem substituem recursos aprovados.
5. **Proibir duplicatas genéricas**: cada VFX precisa de silhueta e coreografia próprias. A direção e a semântica importam mais do que a cor.
6. **Usar ativos originais ou legalmente reutilizáveis**, com licenças verificadas. Não extrair pixels de vídeos externos, imagens protegidas ou marcas d'água.
7. **Integração opcional**: não alterar movimentos nativos do Poké Arena 2D, controles, status, HP, golpes aprovados, campanha ou saves automaticamente.
8. **Teste focal + navegador + screenshot** antes de sugerir publicação no jogo. Revisar mobile, frame rate e gasto de GPU ao integrar.

## Six Slash V2 — critérios de aceitação

- Vista lateral: comprimento horizontal > 2× a altura do efeito preenchido no quadro de impacto; não meia-lua desenhada para cima.
- Ponta apontada lateralmente; avanço progressivo da esquerda para direita; rastros horizontais e dissipação direcional.
- Seis silhuetas: rubro/garra, ouro/duplo, gelo/cristal, marfim/vento, verde/folha, violeta/espectral.
- 12 quadros por efeito em spritesheet PNG com transparência, sem interpolação de pixels e sem travas.
- `index.html` compara original arquivado e refação; os PNGs V1 são preservados em `effects/slash/archive/v1/`.

## Próximos grupos de efeitos

`effects/impact/`, `effects/fire/`, `effects/ice/`, `effects/electric/`, `effects/ghost/`, `effects/aura/`, `effects/charge/`.

São **categorias planejadas**; não criar pastas vazias nem declarar efeitos inexistentes como prontos.

## Configuração e execução local

```bash
npm install
npm test
npm run check
# para ver o laboratório, usar qualquer servidor HTTP estático no diretório do repositório
python3 -m http.server 8000
# abrir http://localhost:8000
```

Para integradores Phaser, importar o módulo `src/slash-vfx.js`. O padrão de cena é `preloadSlashes(scene,['v2'])` em preload e `playSlash(scene,id,x,y)` após contato legítimo do golpe. **Esta biblioteca não decide dano nem colisão.**

## Governança

- V1 = protótipo anterior, preservado.
- V2 = corte lateral, em revisão, **approved=false**.
- Não é publicação no Pokémon Torre 2.
- A alteração da branch de efeito só entra na main da biblioteca depois de testes e revisão; o jogo mantém ciclo de aprovação independente.
