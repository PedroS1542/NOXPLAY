# NOXPLAY — Banner, Elenco e Menu V3

Base: NOXPLAY Tela Cinematográfica V2.

- Tela de detalhes com banner grande e degradê cinematográfico.
- Botão de três pontinhos que expande as ações lateralmente com animação.
- Elenco e personagens em cartões com fotos quando URLs válidas foram cadastradas.
- Botão "Elenco e detalhes" que leva diretamente à seção do elenco.
- Caso o elenco esteja vazio, a página explica como preencher no ADM.
- O menu fecha ao clicar fora ou pressionar Esc.
- Mantidos Google Drive, painel ADM, Supabase, áudio, legendas, qualidade, biblioteca e catálogo.

## Cadastro do elenco
No painel ADM, edite o filme e preencha uma pessoa por linha:

Dakota Fanning | Coraline Jones | https://exemplo.com/dakota.jpg
Teri Hatcher | Outra Mãe | https://exemplo.com/teri.jpg

Sem URL de foto, o nome e personagem aparecem com imagem substituta.

## Instalação
Substitua os arquivos do site no GitHub Pages. Para mudar só a interface, substitua index.html.

## Limites de teste
Sintaxe JS e integridade ZIP verificadas; não houve teste integrado com o Supabase ou navegador do usuário.
