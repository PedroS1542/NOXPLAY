# NOXPLAY — Drive Cinema (base V16)

Esta versão parte do **NOXPLAY V16** e substitui a reprodução por links do YouTube/MP4 por **Google Drive**.

- No ADM, use apenas o link do arquivo no Google Drive para o vídeo principal e os episódios.
- Retirados da interface os uploads de vídeo pelo PC, as legendas e os campos de áudio/versões.
- Mantidos catálogo, capas, banners, filmes/séries/animes, episódios, elenco, trailers, biblioteca e integração com Supabase.
- O Google Drive utiliza seu **próprio player**: o NOXPLAY não controla as opções de legenda ou áudio. Essas opções **não são garantidas** e dependem do arquivo e dos recursos do Drive.
- Compartilhe o arquivo como **Qualquer pessoa com o link → Leitor**. O link pode ser visto por terceiros.
- O Drive pode limitar a reprodução por tráfego ou processamento; não é hospedagem de streaming dedicada.
- Use apenas vídeos próprios ou com autorização de distribuição.

## Publicação
Substitua `index.html` e `cloud.js` no repositório; confira `config.js` e mantenha a pasta `assets` e demais arquivos existentes. Não é necessário alterar o banco Supabase.

## Teste
Cadastre um vídeo curto autorizado, com link `https://drive.google.com/file/d/ID/view`, e verifique a reprodução em janela anônima.
