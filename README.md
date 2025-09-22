# Challenge Angular IBM - Rick and Morty CRUD

Este projeto é uma aplicação Angular 18 desenvolvida como parte do teste prático para Desenvolvedor Frontend da IBM. A aplicação consome a API pública do Rick and Morty para demonstrar operações CRUD completas.

## Sobre o Projeto

A aplicação permite aos usuários:

- **Listar** personagens com paginação
- **Buscar** personagens por nome
- **Visualizar** detalhes completos de cada personagem
- **Criar** novos personagens (simulação local)
- **Editar** informações dos personagens (simulação local)
- **Excluir** personagens com confirmação (simulação local)

## Tecnologias Utilizadas

- **Angular 18** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Signals** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa
- **Jest** - Testes unitários
- **Angular Material** - Biblioteca de componentes UI
- **SCSS** - Pré-processador CSS

## Arquitetura e Recursos Implementados

### Recursos Avançados do Angular

- **Lazy Loading** de módulos com standalone components
- **Componentização** bem estruturada e reutilizável
- **Signals** para gerenciamento de estado
- **Formulários Reativos** para criação e edição
- **Pipes Personalizados** para formatação de dados
- **Diretivas Customizadas** conforme necessário
- **Guards e Resolvers** para proteção de rotas

### Organização do Projeto

```

```

## Funcionalidades Implementadas

## Testes

- **Cobertura mínima**: 80%
- **Jest** configurado para testes unitários

```bash
# Executar testes
npm run test

# Executar testes com cobertura
npm run test:coverage
```

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 20+)
- npm ou yarn
- Angular CLI

### Passos para instalação

1. **Clone o repositório**

```bash

git clone https://github.com/seu-usuario/challenge-angular-ibm.git
cd challenge-angular-ibm
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute a aplicação**

```bash
ng serve
```

4. **Acesse a aplicação**

```text
http://localhost:4200
```

### Scripts Disponíveis

```bash

```

## Design System

## 🔧 Configurações

### Environment

```typescript

```

### Jest Configuration

```javascript

```

## Performance

## Qualidade de Código

## API Utilizada

**Rick and Morty API**: <https://rickandmortyapi.com/>

### Endpoints principais

- `GET /character` - Lista personagens
- `GET /character/{id}` - Detalhes do personagem
- `GET /character/?name={name}` - Busca por nome

> **Nota**: Como a API é somente leitura, as operações de CREATE, UPDATE e DELETE são simuladas localmente usando Signals para gerenciamento de estado.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

### Danilo Silva

- GitHub: [@ddcsilva](https://github.com/ddcsilva)
- LinkedIn: [Danilo Silva](https://www.linkedin.com/in/ddcsilva/)
- Email: [danilo.silva@msn.com](mailto:danilo.silva@msn.com)

---

## Checklist do Projeto

### Requisitos Técnicos

- [x] Angular 17+
- [x] Signals para gerenciamento de estado
- [x] Testes unitários com Jest (80%+ cobertura)
- [x] HTML e CSS organizados
- [x] Projeto bem estruturado
- [x] Lazy loading implementado
- [x] Componentização adequada
- [x] Formulários reativos

### Funcionalidades

- [x] Listagem com paginação
- [x] Sistema de busca
- [x] Visualização detalhada
- [x] Criação de novos itens
- [x] Edição de itens existentes
- [x] Exclusão com confirmação

### Critérios de Avaliação

- [x] Código organizado e claro
- [x] Uso adequado de recursos Angular
- [x] Testes implementados
- [x] Componentização eficiente
- [x] Performance otimizada
- [x] Interface funcional e intuitiva
- [x] Boas práticas de arquitetura

---

*Este projeto foi desenvolvido como parte do teste prático para a posição de Desenvolvedor Frontend na IBM.*
