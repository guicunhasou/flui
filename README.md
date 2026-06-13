# Flui Charge Map Cup — Etapa 1

## Integrantes

| Nome completo | RM |
|---|---|
| GUILHERME VICTOR CUNHA DE SOUZA | 565727 |
| ISAMARA ALVES DE BRITO | 565161 |
| KAUANE CRISTINY BOMFIM SILVA CAVALCANTE | 563886 |
| MIRNA L MARINHO CARNEIRO ANDRADE | 564052 |

## Contextualização do projeto

O Flui Charge Map Cup é um aplicativo mobile voltado para motoristas de veículos elétricos. A proposta é ajudar o usuário a localizar, comparar e escolher pontos de recarga de forma simples, clara e confiável.

O desafio parte de um problema real da mobilidade elétrica: encontrar um ponto de recarga não depende apenas de saber onde ele está. O motorista também precisa entender se o carregador está disponível, qual é a potência, quais conectores são aceitos, se há comodidades por perto, qual o horário de funcionamento e se o local oferece uma boa experiência durante a espera.

Por isso, o app foi pensado como um guia de pontos de recarga. A experiência não se limita ao mapa: ela organiza informações úteis para apoiar a tomada de decisão do motorista.

## Objetivo da Etapa 1

O objetivo da Etapa 1 foi estruturar um protótipo mobile navegável em código, com as principais telas exigidas para a experiência inicial:

- mapa de pontos de recarga;
- tela de busca;
- ficha detalhada do ponto;
- navegação funcional entre as telas;
- identidade visual aplicada;
- dados simulados para representar pontos de recarga.

## Tecnologias utilizadas

O projeto foi desenvolvido com:

- React Native;
- Expo;
- TypeScript;
- Expo Router;
- AsyncStorage;
- React Native SVG;
- Lucide React Native.

A escolha por React Native com Expo permitiu criar um protótipo mobile funcional de forma ágil, com navegação real entre telas e estrutura preparada para evoluções futuras.

## Fluxo principal do protótipo

```txt
Splash → Mapa
Mapa → Busca
Busca → Mapa
Busca → Ficha do ponto
Mapa → Ficha do ponto
Ficha do ponto → Mapa
```

## Telas principais

### Mapa

A tela de mapa é a entrada principal da experiência. Ela apresenta pontos de recarga simulados, marcadores visuais e cards de recomendação. A partir dela, o usuário pode abrir a busca ou acessar a ficha detalhada de um ponto.

### Busca

A tela de busca possui campo textual, sugestões rápidas e resultados simulados. Ela permite que o usuário procure por bairro, estação, potência ou tipo de conector. Os filtros visuais apoiam a experiência, mas não foram tratados como funcionalidade completa nesta etapa.

### Ficha detalhada do ponto

A ficha detalhada reúne as informações mais importantes para a escolha do ponto de recarga: nome da estação, endereço, disponibilidade simulada, potência, conectores, horário de funcionamento, períodos de menor movimento, comodidades, avaliações simuladas e informações úteis ao motorista.

Também foi adicionada uma área de guia do ponto, com recomendação, espera estimada, tempo aproximado de carga e perfil do local.

## Justificativa das tomadas de decisão

### Desenvolvimento em código

O grupo optou por desenvolver a Etapa 1 em código, em vez de construir apenas um protótipo no Figma. Essa decisão permite demonstrar navegação real, organização de componentes, dados simulados e uma base técnica mais próxima de um aplicativo mobile funcional.

### Mapa visual com pontos simulados

Nesta etapa, o mapa foi construído como uma experiência visual simulada. A integração real com Google Maps não foi priorizada, pois o foco da Etapa 1 é validar a navegação, a estrutura das telas principais e a clareza da experiência.

Essa abordagem reduz complexidade técnica inicial e mantém o projeto preparado para uma futura integração com mapa real.

### Ficha detalhada rica

A ficha do ponto foi tratada como uma das telas centrais do projeto. Ela apresenta informações como nome da estação, endereço, disponibilidade simulada, potência, conectores, horário de funcionamento, períodos de menor movimento, comodidades e informações úteis ao motorista.

Também foi adicionada uma área de guia do ponto, que resume a recomendação, a espera estimada, o tempo aproximado de carga e o perfil do local. Essa decisão reforça a proposta de não apenas mostrar onde carregar, mas ajudar o motorista a escolher melhor.

### Tela de busca com resultados simulados

A tela de busca inclui campo textual, sugestões rápidas e resultados simulados. Os filtros visuais aparecem como apoio à experiência, mas não foram tratados como funcionalidade completa obrigatória nesta etapa.

Essa decisão mantém o protótipo convincente para avaliação sem desviar o foco para regras complexas de filtragem.

### Identidade visual

A identidade visual foi construída com cores associadas a tecnologia, energia limpa e confiança. A paleta combina tons claros esverdeados, roxo institucional, azul elétrico e verde de status positivo.

A interface usa cards, botões arredondados, hierarquia tipográfica clara e elementos visuais que remetem à mobilidade elétrica.

### Dados simulados

Os pontos de recarga são fictícios, mas foram estruturados com informações plausíveis: nome, endereço, região, potência, conectores, status, comodidades, avaliações simuladas e coordenadas.

Essa organização permite que o app pareça completo na Etapa 1 e facilita futuras implementações, como mapa real, filtros funcionais e localização do usuário.

## Recursos de acessibilidade presentes

O app possui recursos básicos de acessibilidade implementados no código:

- contraste adequado entre texto, fundo e elementos interativos;
- textos legíveis e hierarquia visual clara;
- botões principais com boa área de toque;
- navegação simples entre mapa, busca e ficha;
- feedbacks visuais em ações importantes;
- status dos pontos indicados por texto, não apenas por cor;
- labels acessíveis em botões importantes;
- hints acessíveis em ações principais;
- estados acessíveis em filtros selecionados, favoritos e botões desabilitados;
- campo de busca com nome acessível;
- elementos decorativos ocultos do leitor de tela quando necessário.

Esses recursos ajudam a tornar o protótipo mais compreensível, previsível e utilizável.

## Link do repositório público

[https://github.com/guicunhasou/flui-charge-map]

## Considerações finais

A Etapa 1 do Flui Charge Map Cup entrega uma base navegável e coerente para a experiência principal do aplicativo. O protótipo já permite transitar entre mapa, busca e ficha detalhada do ponto, apresentando dados simulados suficientes para demonstrar a proposta.

As próximas evoluções podem incluir mapa real, localização do usuário, filtros funcionais, sistema completo de avaliação, imagens dos pontos e melhorias no perfil e nas configurações.
