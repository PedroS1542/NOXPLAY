# NOXPLAY

**Uma experiência cinematográfica para descobrir, organizar e assistir ao seu catálogo de vídeos.**

NOXPLAY é uma aplicação web responsiva com navegação por filmes, séries e animes, catálogo pesquisável, páginas de detalhes e recursos de biblioteca pessoal. A interface utiliza um visual escuro com detalhes vermelhos e foi projetada para publicação estática no GitHub Pages.

## Funcionalidades

- Catálogo de filmes, séries e animes com pesquisa e categorias.
- Destaques com banners, sinopses, elenco, trailers e informações adicionais.
- Temporadas e episódios para séries e animes.
- Reprodução por links cadastrados, com opções dubladas e legendadas quando disponíveis.
- Minha Biblioteca, marcação de assistidos, menu expansível e progresso de reprodução.
- Painel de cadastro e edição de títulos e opções de legendas.
- Integração opcional com Supabase para catálogo compartilhado e autenticação administrativa.

## Estrutura

```text
NOXPLAY/
├── index.html       # Interface e funcionalidades
├── cloud.js         # Integração com Supabase
├── config.js        # URL e chave pública do Supabase
├── schema.sql       # Estrutura e permissões do banco
├── assets/
│   ├── noxplay-logo.png
│   └── favicon.png
├── .nojekyll
└── README.md
```

## Publicação no GitHub Pages

1. Envie `index.html`, `cloud.js`, `config.js`, `assets/` e `.nojekyll` para a raiz do repositório.
2. Em **Settings → Pages**, configure a publicação a partir da branch principal e da pasta `/ (root)`.
3. Aguarde a publicação e abra o endereço fornecido pelo GitHub Pages.

O `README.md` é documentação; não interfere na aparência do site. O `schema.sql` é usado no Supabase e não precisa ser publicado no GitHub Pages.

## Conectar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Execute o conteúdo de `schema.sql` no SQL Editor do projeto.
3. Crie uma conta administrativa em **Authentication → Users**.
4. Insira o UUID dessa conta na tabela `public.admins`, seguindo a instrução comentada em `schema.sql`.
5. Em `config.js`, preencha a **Project URL** e a **publishable key** do seu projeto.
6. Teste a autenticação e as permissões antes de disponibilizar o site publicamente.

**Segurança:** nunca publique `service_role`, chaves secretas, tokens privados ou senhas no repositório. O login local demonstrativo não é proteção real; somente autenticação do Supabase com políticas RLS corretamente configuradas protege alterações no catálogo.

## Limitações importantes

- Sem Supabase configurado, os cadastros não são compartilhados entre visitantes.
- Biblioteca e progresso são armazenados no navegador, não sincronizados entre dispositivos.
- A seleção de múltiplas faixas de áudio depende do formato do vídeo e da compatibilidade do navegador.
- Vídeos incorporados do YouTube usam as legendas e os controles de áudio oferecidos pelo próprio YouTube.
- A busca de elenco pelo TMDB exige credencial de API e conferência dos resultados.
- Hospede e compartilhe somente conteúdo para o qual você tenha os direitos ou autorização necessária.

## Identidade

**NOXPLAY** — Catálogo cinematográfico, biblioteca pessoal e uma experiência de reprodução integrada.


## Supabase conectado (V15)

O projeto já está configurado em `config.js` para o Supabase **NOXPLAY**, na região de São Paulo. Não é necessário alterar a URL nem a chave pública para usar esse projeto.

- O catálogo público vem da tabela `public.titles`.
- O login ADM usa **e-mail e senha do Supabase Auth**, não mais o usuário e senha de demonstração.
- Somente usuários registrados em `public.admins` podem adicionar, editar e remover conteúdos; essa regra é validada pelo banco com RLS.
- Visitantes não precisam de conta para navegar no catálogo.
- As legendas `.srt` ou `.vtt` podem ser enviadas pelo painel, com conversão para `.vtt`.
- O botão ADM aparece ao abrir `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/?admin=1`; neste navegador, o atalho continua visível depois disso.
- Publique **todos os arquivos** na raiz do repositório GitHub Pages, incluindo `config.js` e `cloud.js`.
- O site usa links de vídeo, e não hospeda automaticamente vídeos MKV no Supabase. Use apenas conteúdos para os quais você tem direitos de distribuição.

**Segurança:** nunca envie sua senha a terceiros, nem coloque uma chave `service_role`/`secret` no GitHub. A chave `sb_publishable_...` do `config.js` é própria para uso no navegador.

**Observação:** o banco começa vazio. Cadastre os títulos pelo ADM para que apareçam a todos os visitantes. A biblioteca pessoal e o histórico de reprodução ainda ficam armazenados no navegador do visitante.


## V17 — Player cinematográfico próprio

Para URLs de vídeo diretas (MP4 H.264/AAC, por exemplo), o NOXPLAY oferece controles próprios de reprodução, pausa, avanço/retrocesso de 10 segundos, progresso, volume, tela cheia, velocidade, brilho do vídeo, legendas Português/Português Forçado/Inglês e retomada local.

**Qualidade:** no campo de URL de vídeo, pode-se cadastrar uma única URL direta ou várias versões com a sintaxe `1080p=https://servidor/video1080.mp4;720p=https://servidor/video720.mp4;480p=https://servidor/video480.mp4`. Cada qualidade precisa ser um arquivo real, com duração equivalente. Não há transcodificação automática ou qualidade adaptativa nesta versão.

**YouTube:** permanece incorporado pelo player oficial do YouTube, sem os controles personalizados da V17. **Google Drive:** links comuns de compartilhamento não são fontes diretas confiáveis para o player próprio.

**Idioma:** para versões com áudio diferente, cadastre os vídeos separados Dublado e Legendado; a seleção de faixas internas de um mesmo MP4 não é garantida entre navegadores. **Brilho:** filtro visual do vídeo, não altera o brilho físico do monitor. **Progresso:** salvo neste navegador, não sincronizado entre aparelhos.

Mantenha `cloud.js`, `config.js`, `assets` e demais arquivos. Para atualizar a partir da V16, substitua apenas `index.html`.


## V18 — Upload de vídeos do computador

No painel ADM, selecione MP4 ou WebM no campo **Enviar vídeo do computador**, depois clique em salvar. O arquivo é enviado para o bucket público `videos` do Supabase Storage e a URL resultante é cadastrada no título. O botão também mantém a alternativa de URL externa.

**Limitação real:** o plano gratuito do Supabase permite no máximo 50 MB por arquivo; vídeos grandes (como 9 GB) não são suportados nessa configuração. Não é um serviço de transcodificação nem gera várias qualidades. Uploads feitos com o método padrão não têm barra de progresso percentual; a barra indica atividade durante o envio. Os arquivos enviados ficam públicos para quem tiver a URL. A exclusão de um título do catálogo não remove automaticamente o arquivo do Storage.

O bucket `videos` e as políticas foram criados no projeto Supabase associado. A permissão de envio é restrita a usuários cadastrados na tabela `admins`. Apenas envie vídeos que você tenha autorização para disponibilizar.


## V19 — YouTube Cinema
Vídeos do YouTube agora aparecem dentro de uma moldura cinematográfica NOXPLAY, com título e design responsivo. Os controles de reprodução, legendas, qualidade e tela cheia permanecem sendo os oficiais do YouTube. O projeto continua aceitando URLs diretas e uploads pequenos como na V18. Para instalar, substitua apenas `index.html` se já usa a V18. Não é possível ocultar completamente elementos de marca do YouTube ou substituir seu player.
