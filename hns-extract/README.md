# HnS-extract — organização LOCAL de animações e capturas

**Status: pacote-base funcional; zero animações extraídas do jogo distribuídas aqui.**

Este diretório prepara uma coleta e análise **no próprio computador** a partir de capturas de vídeo, GIFs ou sequências de PNG fornecidas pelo titular. A ferramenta **não lê/descompacta ROMs**, não abre patches BPS, não descobre automaticamente tabelas de gráficos do GBA, **não remove fundos nem extrai sprites internos**. Capturar vídeo é diferente de extrair recursos originais em camadas.

**Referência:** [HnS Legends — HUY MAI](https://github.com/HuyMai0509/HnS-Legends) · [Release M9](https://github.com/HuyMai0509/HnS-Legends/releases/tag/M9). A release distribui patch BPS para ROM legalmente obtida; ela **não oferece um pacote independente de animações exportadas**. Nosso trabalho aqui é catalogação e prévia local. Nenhum patch ou arquivo do jogo foi incluído.

## Estrutura pública

```text
hns-extract/
  projectiles/.gitkeep     # projéteis
  impacts/.gitkeep         # impactos
  contact/.gitkeep         # golpes de contato
  area/.gitkeep            # ataques de área
  ui/.gitkeep              # HUD / indicadores
  bosses/.gitkeep          # arenas e lutas contra chefes
  manifest.json            # catálogo MODELO, sem ativos de terceiros
  gallery.html             # GIFs animados locais em navegador
  tools/import.mjs         # importa vídeo, GIF ou quadros PNG
  tests/import.test.mjs    # testes de funcionamento e segurança
  review-checklist.md      # revisão de qualidade / origem / direitos
  RIGHTS.md                # política de materiais e redistribuição
  workspace/               # GERADO LOCALMENTE; ignorado no Git
     catalog.json
     impacts/meu-efeito/
       frames/frame-0000.png ...
       preview.gif
       poster.png
       contact-sheet.png
```

## 1. Requisitos

- **Node.js 20+** (testado na CI com Node 22).
- **FFmpeg** instalado e disponível no PATH, comando `ffmpeg -version`.
  - Instalação/documentação: https://ffmpeg.org/download.html
  - Windows (se disponível no seu ambiente): `winget install --id Gyan.FFmpeg -e`.
- Uma **gravação própria** de gameplay (MP4/MKV/MOV/WEBM/GIF) ou pasta com 2 a 180 quadros PNG já exportados e cujo uso local você possa realizar.
- Não enviar ROM, save, patch nem sprites protegidos para o repositório público.

## 2. Importar uma captura de vídeo (Windows / PowerShell)

Execute a partir da pasta raiz do repositório:

```powershell
node hns-extract/tools/import.mjs --input "C:\Videos\hns-gravacao.mp4" --category impacts --slug teste-choque --name "Impacto observado" --start 12.2 --duration 1.2 --fps 12 --source "Gravacao local para revisao"
```

O **momento 12.2 s** é apenas exemplo; use o instante da animação na sua gravação. O importador nunca infere o momento automaticamente.

Para recortar um retângulo do vídeo, acrescente `--crop 96:96:100:40` (largura:altura:x:y). **O recorte preserva o fundo do vídeo**; não produz transparência real automaticamente.

## 3. Importar uma sequência já extraída de PNGs

```powershell
node hns-extract/tools/import.mjs --input "C:\Animacoes\golpe01" --category projectiles --slug proj-agua-01 --fps 12 --source "Quadros locais exportados pelo titular"
```

A pasta deve ter no mínimo 2 PNGs. A ordem é natural: `frame1.png, frame2.png ... frame10.png`. Não misture quadros com dimensões diferentes. A pasta de entrada nunca é alterada.

## 4. Ver em movimento no navegador, sem baixar GIFs um por um

Na raiz do repositório, execute:

```powershell
python -m http.server 8000
```

Abra **http://localhost:8000/hns-extract/gallery.html**.

A galeria lê `hns-extract/workspace/catalog.json` e mostra os `preview.gif` realmente gerados. A opção de pausa troca o GIF pela imagem fixa `poster.png`. O arquivo `contact-sheet.png` é uma matriz para revisão (somente os 16 primeiros quadros; os arquivos `frames/` guardam todos).

Se o servidor não achar o catálogo, execute uma importação antes. Não publique a pasta `workspace/` em GitHub Pages ou servidor público.

## 5. Conferir os resultados

```powershell
node --test hns-extract/tests/import.test.mjs
```

A CI valida importação com mídia sintética própria, opções de CLI, manifesto, GIF, imagens e isolamento do workspace. Não comprova a qualidade de efeitos de terceiros.

## 6. Segurança, direitos e integração

- Os arquivos de vídeo, capturas, GIFs e demais materiais de revisão ficam **apenas em `workspace/`**, ignorado pelo Git, nunca enviados automaticamente ao GitHub.
- Manifeste origem, autorização e status antes de qualquer distribuição. Leia [RIGHTS.md](RIGHTS.md) e [review-checklist.md](review-checklist.md).
- **Não são as animações do HnS Legends**: o repositório original não disponibilizou spritesheets isolados nem código-fonte completo na fonte consultada em 16/11/2026.
- **Não incluir assets protegidos em PRs**. Apenas recursos originais/autorizados podem ser candidatos a publicação após conferência dos direitos.
- A biblioteca existente de Slash e efeitos aprovados e **Pokémon Torre 2 não são alterados** por este pipeline.

## Limitações técnicas explícitas

Não há autoextração direta do patch BPS, varredura de tiles OAM/VRAM, reconstrução de paletas GBA, sincronização do efeito com hitboxes nem garantia de fundo transparente. Esses seriam projetos separados de pesquisa e teste com material acessível de forma legítima.
