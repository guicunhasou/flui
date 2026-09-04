<p align="center">
  <img src="src/assets/images/icon2.png" width="160"/>
</p>

<h1 align="center">Flui Charge Map Cup</h1>

<h3 align="center">
  <i>Encontre, compare e escolha onde carregar com mais clareza.</i>
</h3>

<p align="center">
  Aplicativo mobile para motoristas de veículos elétricos localizarem, avaliarem e escolherem pontos de recarga.
</p>

<p align="center">
  Enterprise Challenge · FIAP · Flui · Google · 2TWDOA · 2026
</p>

---

O **Flui Charge Map Cup** foi criado para tornar a experiência de recarga de veículos elétricos mais clara, confiável e confortável.

A proposta do app é ajudar o motorista a decidir onde parar antes mesmo de chegar ao ponto de recarga, reunindo mapa, filtros, ficha detalhada, avaliações, comodidades, favoritos e histórico em uma experiência mobile funcional.

Projeto desenvolvido para o **Enterprise Challenge — Charge Map Cup**, parceria entre **FIAP, Flui e Google**.

---

## ⚡ O desafio

A mobilidade elétrica está crescendo no Brasil, mas encontrar um bom ponto de recarga ainda pode ser uma tarefa incerta.

Nem sempre o motorista sabe:

- se o carregador está disponível;
- qual potência o ponto oferece;
- quais conectores são compatíveis;
- se o local possui banheiro, café, cobertura ou estacionamento;
- quais horários costumam ser mais tranquilos;
- se outros usuários tiveram uma boa experiência ali.

O Flui Charge Map Cup nasce para responder essas dúvidas de forma simples, visual e organizada.

Mais do que mostrar pontos no mapa, o app funciona como um guia de escolha para recargas.

---

## ✨ Funcionalidades da versão atual

A versão funcional do Flui apresenta os principais recursos da experiência proposta para a Etapa 2.

### 🗺️ Mapa interativo

Apresenta pontos de recarga simulados em São Paulo, com marcadores personalizados, status visual, controles de zoom, centralização, filtros rápidos e painel inferior com melhores escolhas, considerando também a autonomia estimada do veículo até cada ponto.

### 🔎 Busca e filtros

Permite buscar pontos por texto e ajustar critérios como conector, potência mínima, raio de busca, comodidades, avaliação mínima e funcionamento no momento.

### 📍 Ficha detalhada do ponto

Reúne as informações mais importantes para a decisão do motorista: imagem da estação, endereço, status, potência, conectores, horários, períodos menos cheios, comodidades, tempo estimado de carga, estimativa de autonomia até o ponto, comentários e avaliações.

### ⭐ Avaliações

Permite avaliar um ponto com nota geral, critérios específicos, comentário, recomendação e intenção de retorno. A avaliação é salva localmente e pode ser editada.

Quando o usuário escreve um comentário, ele também aparece na ficha detalhada do respectivo ponto.

### 💜 Favoritos e histórico

Os pontos favoritos, o histórico de navegação e as avaliações enviadas ficam concentrados no Perfil, mantendo a navegação mais simples e sem tabbar fixa.

### 👤 Perfil do motorista

Apresenta dados simulados do usuário, veículo cadastrado, favoritos, histórico, avaliações enviadas e atalhos úteis.

### ⚙️ Configurações

Permite ajustar tema, tamanho da fonte, rota preferida e rever a introdução do app.

### 🌱 Onboarding

Introduz a proposta do app em quatro passos: encontrar pontos próximos, comparar antes de parar, escolher com confiança e salvar favoritos.

---

## 📱 Telas do projeto

A versão atual conta com as seguintes telas e áreas principais:

### ⚡ Splash Screen

Apresentação inicial da identidade Flui.

### 🌱 Onboarding

Introdução visual aos principais recursos do app.

### 🗺️ Mapa

Tela principal da experiência, com pontos simulados, filtros rápidos, controles do mapa e painel de recomendações.

### 🔎 Busca e filtros

Área para pesquisar estações e ajustar critérios de escolha.

### 📍 Ficha do ponto

Tela detalhada com dados técnicos, contexto de uso, comodidades e avaliações.

### ⭐ Avaliação

Fluxo para registrar ou editar a experiência do usuário em um ponto de recarga.

### 👤 Perfil

Centraliza favoritos, histórico, avaliações enviadas, dados do motorista e veículo.

### ⚙️ Configurações

Área de preferências visuais e comportamentais do app.

---

## 🎯 Objetivo

Ajudar motoristas de veículos elétricos a escolher pontos de recarga com mais confiança.

O app busca reduzir incertezas comuns da jornada de recarga, oferecendo informações úteis antes da parada e valorizando a experiência do motorista durante a escolha do ponto.

---

## 🧭 Jornada principal

```txt
⚡ Abertura do app
       ↓
🌱 Introdução da experiência
       ↓
🗺️ Mapa de pontos de recarga
       ↓
🔎 Busca e filtros
       ↓
📍 Ficha detalhada do ponto
       ↓
⭐ Avaliação da experiência
       ↓
👤 Histórico e favoritos no Perfil
```

### Fluxo de primeiro uso

```txt
Splash → Onboarding → Mapa
```

### Fluxo de uso recorrente

```txt
Splash → Mapa
```

### Fluxo pelas configurações

```txt
Configurações → Ver introdução → Onboarding → Configurações
```

---

## ⚒️ Tecnologias utilizadas

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat-rounded&logo=react&logoColor=61DAFB)  
![React Native Maps](https://img.shields.io/badge/React%20Native%20Maps-34A853?style=flat-rounded&logo=googlemaps&logoColor=white)  
![React Native SVG](https://img.shields.io/badge/React%20Native%20SVG-61DAFB?style=flat-rounded&logo=react&logoColor=20232A)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-rounded&logo=typescript&logoColor=white)  
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-rounded&logo=expo&logoColor=white)  
![Expo Router](https://img.shields.io/badge/Expo%20Router-000020?style=flat-rounded&logo=expo&logoColor=white)  
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-FFCA28?style=flat-rounded&logo=react&logoColor=black)  
![Lucide](https://img.shields.io/badge/Lucide%20Icons-111827?style=flat-rounded&logo=lucide&logoColor=white)

A escolha por React Native com Expo permitiu desenvolver um protótipo mobile funcional, com navegação real, persistência local, componentes reutilizáveis e estrutura preparada para evoluções futuras.

---

## ⚙️ Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npm run start
```

### 3. Rodar no Android

```bash
npm run android
```

### 4. Rodar no iOS

```bash
npm run ios
```

### 5. Rodar no navegador

```bash
npm run web
```

---

## 📄 Scripts disponíveis

```bash
npm run start
```

Inicia o servidor de desenvolvimento do Expo.

```bash
npm run android
```

Abre o app no emulador Android.

```bash
npm run ios
```

Abre o app no iOS Simulator.

```bash
npm run web
```

Abre o app no navegador.

```bash
npm run typecheck
```

Executa a verificação de tipos do TypeScript.

```bash
npm run lint
```

Executa a verificação de lint do projeto.

---

## 📃 Estrutura principal

```txt
app/
  _layout.tsx
  index.tsx
  map.tsx
  search.tsx
  filters.tsx
  point-details.tsx
  review.tsx
  profile.tsx
  settings.tsx
  onboarding.tsx

src/
  assets/
    images/
    onboarding/
    stations/
    user/

  components/
  context/
  data/
  hooks/
  screens/
  storage/
  theme/
  types/
  utils/
```

---

## 🎨 Design e identidade visual

> **"Encontre, compare e escolha onde carregar com mais clareza."**

O Flui Charge Map Cup foi pensado para unir tecnologia, sustentabilidade e confiança.

A interface busca transmitir uma sensação de clareza e controle para o motorista, usando informações objetivas, cards organizados, microinterações discretas — como transições animadas entre telas, uma tela de carregamento com ilustração animada e feedback tátil (haptics) ao tocar em botões e cards — e uma identidade visual conectada à mobilidade elétrica.

### ✨ Princípios de design

- Reduzir a incerteza antes da recarga;
- Organizar informações técnicas de forma simples;
- Valorizar a experiência real do motorista;
- Criar uma interface clara, moderna e confiável;
- Usar feedbacks visuais discretos;
- Manter consistência entre mapa, busca, ficha, avaliação e perfil;
- Priorizar legibilidade, contraste e acessibilidade.

### 🌿 Paleta visual

A identidade visual combina tons associados a tecnologia limpa, energia e confiança.

- **Verdes suaves** — sustentabilidade, mobilidade limpa e status positivo;
- **Roxo Flui** — identidade, destaque e personalidade visual;
- **Azul elétrico** — tecnologia, recarga e inovação;
- **Tons claros e escuros** — suporte a tema claro, escuro e automático;
- **Cores de status** — ajudam a diferenciar disponibilidade, ocupação, manutenção e indisponibilidade.

### 🔤 Experiência de leitura

O app foi construído com hierarquia visual clara, cards bem definidos, textos objetivos e suporte a ajuste de tamanho de fonte nas configurações.

A intenção é que o motorista consiga entender rapidamente se um ponto atende às suas necessidades antes de iniciar a rota.

---

## ♿ Acessibilidade

O projeto inclui cuidados de acessibilidade, como:

- labels acessíveis em botões importantes;
- hints em ações principais;
- estados acessíveis em filtros, favoritos e botões desabilitados;
- status indicados por texto, não apenas por cor;
- contraste visual adequado;
- áreas de toque confortáveis;
- textos claros e hierarquia consistente;
- suporte a variação de tamanho de fonte;
- elementos decorativos ocultos de leitores de tela quando necessário;
- feedbacks visuais e táteis (haptics) em interações importantes.

---

## 🧠 Decisões de projeto

### Desenvolvimento em código

O grupo optou por desenvolver um app funcional em React Native, em vez de entregar apenas um protótipo visual. Essa decisão permite demonstrar navegação real, persistência local, filtros, avaliações e uma experiência mais próxima de um produto mobile.

### Dados simulados

Os pontos de recarga são fictícios, mas estruturados com informações plausíveis: nome, endereço, região, potência, conectores, status, comodidades, avaliações, imagens e coordenadas.

Essa escolha mantém o protótipo estável e testável, sem depender de APIs externas durante a avaliação.

### Localização demo

A localização do usuário foi mantida como uma posição simulada em São Paulo, próxima ao contexto do desafio. Isso evita variações por permissão, GPS ou localização real do avaliador e garante uma demonstração consistente.

### Ficha detalhada como centro da decisão

A ficha do ponto foi tratada como uma das telas mais importantes do app. Ela reúne dados técnicos, contexto de uso, comodidades, comentários e uma estimativa de autonomia até o ponto, para transformar a escolha do ponto em uma decisão mais segura e menos ansiosa quanto ao alcance da bateria.

### Avaliações locais

O sistema de avaliação usa armazenamento local. Assim, o usuário consegue enviar, editar e visualizar avaliações sem backend. Essa abordagem atende ao escopo da etapa e demonstra o fluxo principal de forma funcional.

### Navegação simplificada

O app não utiliza tabbar fixa. A navegação foi simplificada para manter foco no mapa, na busca, na ficha e no perfil. Favoritos, histórico e avaliações ficam organizados dentro do Perfil.

---

## 🚘 Próximas rotas

O Flui Charge Map Cup foi desenvolvido como uma base funcional para evoluções futuras.

### 🗺️ Mapa e localização

- Integração completa com APIs reais de eletropostos;
- Localização real do usuário;
- Rotas reais com Google Maps;
- Dados em tempo real sobre disponibilidade dos carregadores.

### ⭐ Comunidade e avaliações

- Backend para avaliações;
- Sincronização em nuvem;
- Perfis reais de usuários;
- Moderação de comentários;
- Histórico completo de recargas.

### ⚡ Experiência de recarga

- Estimativa personalizada de tempo de carga;
- Sugestões com base no veículo do usuário;
- Planejamento de rota com múltiplas paradas;
- Alertas sobre ocupação, manutenção e indisponibilidade.

### ♿ Acessibilidade e inclusão

- Modo de alto contraste;
- Redução avançada de animações;
- Preferências refinadas de leitura;
- Testes com leitores de tela em mais dispositivos.

---

## 👥 Equipe

Equipe responsável pelo desenvolvimento do Flui Charge Map Cup para o Enterprise Challenge — Charge Map Cup.

<table align="center">
  <tr>
    <td align="center">
      <img src="docs/readme/guilherme.webp" width="140px"><br>
      <strong>Guilherme Cunha</strong><br>
      RM 565727
    </td>
    <td align="center">
      <img src="docs/readme/isamara.webp" width="140px"><br>
      <strong>Isamara Alves</strong><br>
      RM 565161
    </td>
    <td align="center">
      <img src="docs/readme/kauane.webp" width="140px"><br>
      <strong>Kauane Cristiny</strong><br>
      RM 563886
    </td>
    <td align="center">
      <img src="docs/readme/mirna.webp" width="140px"><br>
      <strong>Mirna Carneiro</strong><br>
      RM 564052
    </td>
  </tr>
</table>

---

## ✅ Status

Projeto funcional para a entrega da Etapa 2 do **Enterprise Challenge — Charge Map Cup**.

O app possui mapa interativo, busca com filtros, ficha detalhada com estimativa de autonomia, sistema de avaliação local, favoritos, histórico, perfil, configurações, onboarding, tema claro/escuro, persistência local e refinamentos de acessibilidade, motion design e microinterações com feedback tátil.
