# Challenge Angular IBM - Rick and Morty CRUD

Este projeto é uma aplicação Angular 18 desenvolvida como parte do teste prático para Desenvolvedor Frontend da IBM. A aplicação consome a API pública do Rick and Morty para demonstrar operações CRUD completas com arquitetura moderna e boas práticas.

## 🚀 Sobre o Projeto

A aplicação permite aos usuários:

- **📋 Listar** personagens com paginação inteligente
- **🔍 Buscar** personagens por nome com debounce
- **👁️ Visualizar** detalhes completos de cada personagem
- **➕ Criar** novos personagens (armazenamento local)
- **✏️ Editar** informações dos personagens existentes
- **🗑️ Excluir** personagens com diálogo de confirmação
- **💾 Persistir** dados localmente via LocalStorage

## 🛠️ Tecnologias e Ferramentas

### Core Framework

- **Angular 18** - Framework principal com standalone components
- **TypeScript 5.5** - Linguagem de programação tipada
- **RxJS 7.8** - Programação reativa

### Gerenciamento de Estado

- **Angular Signals** - Sistema reativo nativo do Angular 18
- **Custom Store** - Store personalizada com Signals

### UI/UX

- **Angular Material 18** - Biblioteca de componentes Material Design 3
- **Tailwind CSS 3.4** - Framework CSS utilitário
- **SCSS** - Pré-processador CSS com temas customizados

### Qualidade de Código

- **Jest 29** - Framework de testes unitários
- **ESLint 9** - Linter para TypeScript/Angular
- **Prettier 3.6** - Formatação de código
- **Angular ESLint** - Regras específicas do Angular

### Build & Deploy

- **esbuild** - Bundler ultra-rápido
- **Angular CLI 18** - Ferramenta de desenvolvimento

## 🏗️ Arquitetura e Recursos Implementados

### 🌟 Recursos Avançados do Angular 18

- **🔄 Angular Signals** - Sistema reativo nativo para gerenciamento de estado
- **🧩 Standalone Components** - Componentes independentes sem NgModules
- **⚡ Lazy Loading** - Carregamento sob demanda das rotas
- **🎯 Componentização Avançada** - Arquitetura modular e reutilizável
- **📝 Formulários Reativos** - Validação robusta com FormBuilder
- **🔧 Pipes Personalizados** - Transformação de dados (status, gênero, espécie)
- **🎨 Material Design 3** - Interface moderna e acessível
- **📱 Responsive Design** - Layout adaptativo para todos dispositivos

### 📁 Organização do Projeto

```text
ibm-workspace/
├── projects/angular-challenge/src/
│   ├── app/
│   │   ├── core/                   # Configurações centrais
│   │   │   ├── core.ts             # Providers e configurações
│   │   │   └── index.ts            # Barrel exports
│   │   ├── features/               # Módulos de funcionalidade
│   │   │   └── characters/         # Feature de personagens
│   │   │       ├── components/     # Componentes específicos
│   │   │       │   ├── character-list/
│   │   │       │   ├── character-detail/
│   │   │       │   ├── character-create/
│   │   │       │   ├── character-edit/
│   │   │       │   └── character-form/
│   │   │       ├── character.model.ts         # Modelos e interfaces
│   │   │       ├── character.service.ts       # Serviço da API
│   │   │       ├── character.store.ts         # Store com Signals
│   │   │       ├── character-local-storage.service.ts
│   │   │       └── characters.routes.ts       # Rotas lazy
│   │   ├── layout/                 # Componentes de layout
│   │   │   └── main-layout/
│   │   ├── ui/                     # Componentes reutilizáveis
│   │   │   ├── components/         # Componentes UI
│   │   │   │   ├── character-card/
│   │   │   │   └── delete-confirmation-dialog/
│   │   │   └── pipes/              # Pipes customizados
│   │   │       ├── character-status.pipe.ts
│   │   │       ├── character-gender.pipe.ts
│   │   │       └── character-species.pipe.ts
│   │   ├── app.component.ts       # Componente raiz
│   │   ├── app.config.ts          # Configuração da aplicação
│   │   └── app.routes.ts          # Roteamento principal
│   ├── styles.scss                # Estilos globais + Material + Tailwind
│   └── main.ts                    # Bootstrap da aplicação
├── tailwind.config.js             # Configuração Tailwind CSS
├── jest.config.js                 # Configuração de testes
├── eslint.config.js               # Configuração ESLint
├── .prettierrc                    # Configuração Prettier
└── package.json                   # Dependências e scripts
```

## ✨ Funcionalidades Implementadas

### 🏠 Página Principal (Lista de Personagens)

- **📋 Listagem paginada** - Carrega personagens da API com paginação
- **🔍 Busca inteligente** - Filtro por nome com debounce (300ms)
- **🎯 Cards interativos** - Design responsivo com informações essenciais
- **➕ Criação rápida** - Botão flutuante para adicionar personagens
- **🔄 Estado reativo** - Atualização em tempo real com Signals

### 👁️ Visualização de Detalhes

- **📊 Informações completas** - Todos os dados do personagem
- **🖼️ Imagem otimizada** - Placeholders gerados automaticamente para personagens locais
- **🏷️ Status visual** - Cores e ícones diferenciados por status
- **⚡ Ações rápidas** - Editar ou excluir diretamente da visualização

### ➕ Criação de Personagens

- **📝 Formulário validado** - Validações robustas em tempo real
- **💾 Armazenamento local** - Dados persistem no LocalStorage
- **🎨 Imagens automáticas** - Avatares gerados via UI Avatars API
- **🔢 IDs únicos** - Sistema de numeração para evitar conflitos

### ✏️ Edição de Personagens

- **🔄 Dados pré-carregados** - Formulário populado automaticamente
- **⚡ Validação instantânea** - Feedback visual em tempo real
- **💾 Salvamento local** - Alterações persistem no LocalStorage
- **🚫 Proteção API** - Apenas personagens locais podem ser editados

### 🗑️ Exclusão Segura

- **⚠️ Confirmação obrigatória** - Dialog modal para confirmar exclusão
- **🛡️ Proteção contra acidentes** - Dupla confirmação necessária
- **📊 Feedback visual** - Estados de loading e sucesso/erro

### 🔧 Recursos Técnicos Avançados

- **⚡ Performance otimizada** - OnPush strategy e trackBy functions
- **🎨 Tema customizado** - Paleta de cores IBM + Rick & Morty
- **♿ Acessibilidade** - Componentes Material Design com WAI-ARIA

## 🧪 Testes e Qualidade

### Configuração de Testes

- **Jest 29** - Framework de testes principal
- **jest-preset-angular** - Preset específico para Angular
- **Cobertura configurada** - Coleta automática de métricas

### Scripts de Teste

```bash
# Executar testes uma vez
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Estrutura de Testes

- **Unit Tests** - Componentes, serviços e pipes (85 testes)
- **Mock Strategy** - APIs mockadas para testes isolados
- **Coverage Areas**:
  - ✅ Componentes (CharacterList, CharacterDetail, CharacterCreate, CharacterEdit, CharacterForm)
  - ✅ Serviços (CharacterService, CharacterLocalStorageService)
  - ✅ Store (CharacterStore com Signals)
  - ✅ Layout Components (MainLayout)
  - ✅ Testes de integração e casos extremos

## 🚀 Instalação e Execução

### 📋 Pré-requisitos

- **Node.js** (versão 20+)
- **npm** ou **yarn**
- **Angular CLI 18** (opcional, já incluído como dependência)

### 📥 Passos para instalação

1. **Clone o repositório**

```bash
git clone https://github.com/ddcsilva/challenge-angular-ibm.git
cd challenge-angular-ibm/ibm-workspace
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute a aplicação**

```bash
npm start
# ou
ng serve
```

4. **Acesse a aplicação**

```text
http://localhost:4200
```

### 📜 Scripts Disponíveis

```bash
# 🚀 Desenvolvimento
npm start                   # Inicia servidor de desenvolvimento
npm run watch               # Build em modo watch

# 🏗️ Build
npm run build               # Build para produção

# 🧪 Testes
npm run test                # Executa testes unitários
npm run test:watch          # Testes em modo watch
npm run test:coverage       # Testes com cobertura

# 🎨 Qualidade de Código
npm run format:test         # Verifica formatação
npm run format:write        # Aplica formatação Prettier
npm run lint                # Executa ESLint

# 📊 Análise e Performance
npm run analyze             # Analisa bundle com treemap
npm run analyze:sme         # Source map explorer
npm run analyze:deps        # Análise de dependências
```

## 🎨 Design System

### 🌈 Paleta de Cores

O projeto utiliza uma paleta de cores customizada inspirada na IBM e no universo Rick & Morty:

```scss
// Paleta Principal (IBM Blue)
portal-blue: #3b82f6 (Primary)
portal-blue-variants: #eff6ff → #1e3a8a

// Paleta Secundária (Science Green)
science-green: #10b981 (Secondary)
science-green-variants: #ecfdf5 → #064e3b

// Paleta de Alertas
alert-red: #ef4444 (Error/Warning)
```

### 🎯 Componentes Base

- **Material Design 3** - Sistema de design Google
- **Cards Responsivos** - Layout flexível e adaptativo
- **Formulários Validados** - Feedback visual em tempo real
- **Dialogs Modais** - Confirmações e ações críticas
- **Snackbars Customizados** - Notificações success/error/info

### 🔤 Tipografia

- **Fonte Principal**: Roboto (Material Design)
- **Hierarquia Clara**: H1-H6 definidos
- **Responsividade**: Tamanhos adaptativos

## ⚡ Performance e Otimizações

### 🚀 Estratégias Implementadas

- **OnPush Change Detection** - Reduz ciclos de detecção
- **TrackBy Functions** - Otimiza renderização de listas
- **Lazy Loading** - Carregamento sob demanda de rotas
- **Tree Shaking** - Remove código não utilizado
- **Bundle Analysis** - Ferramentas para análise de tamanho

### 📊 Métricas de Build

- **Initial Bundle**: < 750kB (configurado)
- **Component Styles**: < 2kB por componente
- **Lazy Chunks**: Carregamento otimizado

## 🛡️ Qualidade de Código

### 📐 Linting e Formatação

- **ESLint 9** com regras Angular específicas
- **Prettier** para formatação consistente
- **TypeScript Strict Mode** habilitado
- **Angular ESLint** para boas práticas

### 🏷️ Convenções

- **Prefixo de componentes**: `ibm-*`
- **Naming Convention**: camelCase/kebab-case
- **Barrel Exports** para organização
- **Interfaces tipadas** para todos os dados

## 🔗 API e Integração

### 🌐 Rick and Morty API

**Base URL**: `https://rickandmortyapi.com/api`

### 📡 Endpoints Utilizados

```typescript
// Listar personagens com filtros
GET /character?page={page}&name={name}&status={status}

// Detalhes de um personagem específico
GET /character/{id}

// Busca por nome (com debounce implementado)
GET /character?name={searchTerm}
```

### 💾 Sistema Híbrido (API + LocalStorage)

- **📡 API Characters**: Personagens originais (apenas leitura)
- **💾 Local Characters**: Personagens criados localmente (CRUD completo)
- **🔄 Merge Inteligente**: Combinação automática das duas fontes
- **🎯 IDs Únicos**: Sistema de numeração que evita conflitos (locais começam em 10000+)

> **💡 Estratégia Implementada**: Como a Rick & Morty API é somente leitura, implementamos um sistema híbrido onde os personagens da API são exibidos junto com personagens criados localmente. As operações CRUD (Create, Update, Delete) funcionam apenas nos personagens locais, armazenados no LocalStorage com Signals para reatividade.

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Danilo Silva** - Engenheiro de Software

[![GitHub](https://img.shields.io/badge/GitHub-ddcsilva-181717?style=for-the-badge&logo=github)](https://github.com/ddcsilva)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Danilo%20Silva-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ddcsilva/)
[![Email](https://img.shields.io/badge/Email-danilo.silva@msn.com-D14836?style=for-the-badge&logo=gmail)](mailto:danilo.silva@msn.com)

---

## ✅ Status do Projeto - Completamente Implementado

### ✨ Recursos Implementados

| Categoria | Recurso | Status | Detalhes |
|-----------|---------|--------|----------|
| **🏗️ Arquitetura** | Angular 18 | ✅ | Standalone components, Signals |
| **🧩 Componentização** | Estrutura modular | ✅ | Features, UI, Core organizados |
| **⚡ Performance** | Lazy Loading | ✅ | Rotas carregadas sob demanda |
| **🎯 Estado** | Angular Signals | ✅ | Store reativa customizada |
| **📝 Formulários** | Reactive Forms | ✅ | Validação completa e robusta |
| **🎨 UI/UX** | Material Design 3 | ✅ | Tema customizado + Tailwind |
| **🔍 Busca** | Debounce Search | ✅ | 300ms de debounce implementado |
| **📱 Responsivo** | Mobile-First | ✅ | Design adaptativo completo |

### 🧪 Funcionalidades CRUD

| Operação | Status | Implementação |
|----------|--------|---------------|
| **📋 Create** | ✅ | Personagens locais com LocalStorage |
| **👁️ Read** | ✅ | API + LocalStorage híbrido |
| **✏️ Update** | ✅ | Edição de personagens locais |
| **🗑️ Delete** | ✅ | Exclusão com confirmação modal |

### 🛡️ Qualidade e Testes

| Aspecto | Status | Ferramenta |
|---------|--------|------------|
| **🧪 Testes** | ✅ | Jest com 85 testes passando |
| **📐 Linting** | ✅ | ESLint + Angular ESLint |
| **🎨 Formatação** | ✅ | Prettier configurado |
| **📊 Análise** | ✅ | Bundle analyzer disponível |

---

## 🎯 Destaques Técnicos

### 💡 Inovações Implementadas

1. **Sistema Híbrido API + LocalStorage** - Combina dados da API com criações locais
2. **Store Personalizada com Signals** - Estado reativo sem bibliotecas externas
3. **Design System Personalizado** - Paleta IBM + Rick & Morty
4. **Path Mapping Avançado** - Imports organizados e limpos
5. **Bundle Analysis Tools** - Scripts para análise de performance

### 🏆 Boas Práticas Aplicadas

- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **SOLID Principles** - Código maintível e extensível
- ✅ **DRY Pattern** - Reutilização inteligente de componentes
- ✅ **Accessibility First** - WAI-ARIA e semântica HTML
- ✅ **Mobile First** - Design responsivo nativo

---

<div align="center">

### 🚀 Projeto desenvolvido com foco em excelência técnica e experiência do usuário

 Challenge Angular IBM - Teste prático para Desenvolvedor Frontend

</div>
