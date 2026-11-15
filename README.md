# NOXPLAY — Google Drive Cinema | Idiomas e qualidade

Atualização baseada no último pacote **NOXPLAY_DRIVE_CINEMA_AVISO_LEGENDAS_ADM**.

No painel ADM, selecione áudio em Português (BR) e/ou Inglês, legendas em Português (BR) e/ou Inglês e qualidade HD 720p, Full HD 1080p, 4K 2160p ou **Outra**, digitada manualmente. Os campos são opcionais e são salvos no cadastro e exibidos nos detalhes do título. O aviso de legendas personalizado anterior foi preservado.

**Importante:** essas informações são declarações do administrador, não verificações automáticas. O player Google Drive não é controlado pelo NOXPLAY, e selecionar idioma ou qualidade no ADM não cria essas faixas nem garante que o Drive as ofereça.

## Instalação
Substitua `index.html` no GitHub Pages. O ZIP contém os demais arquivos do site para quem preferir publicar o pacote completo. Não execute `schema.sql` novamente se o Supabase já está configurado.

Verificação realizada: sintaxe dos scripts JavaScript. Ainda é necessário testar cadastro e edição no navegador publicado.

## Cartões e detalhes corrigidos
- Prévia animada ao passar o mouse sobre as capas no catálogo e em Continuar assistindo.
- Ações: Assistir, Ver detalhes, Biblioteca, Marcar como assistido e menu de três pontos.
- A página de detalhes mantém banner, elenco, trailer, país, duração e informações do ADM.
- O banner da página inicial mostra títulos marcados como **Destaque** no ADM e com URL de banner válida.
- O Google Drive não expõe o minuto exato: Continuar assistindo mostra os títulos abertos, sem inventar tempo restante.
- Os dados do catálogo permanecem no Supabase; biblioteca e histórico de reprodução iniciada são locais ao navegador.
