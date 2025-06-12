# ColdTech - Sistema de Gerenciamento de Manutenção de Ar Condicionado

## Visão Geral

ColdTech é um sistema web para gerenciamento de serviços de manutenção de ar condicionado. A plataforma permite o agendamento de serviços, gerenciamento de clientes e acompanhamento de manutenções.

## Funcionalidades

- **Site Institucional**: Apresentação da empresa e serviços
- **Agendamento de Serviços**: Interface para clientes agendarem manutenções
- **Painel Administrativo**: Gerenciamento completo do sistema
  - Dashboard com indicadores de desempenho
  - Gerenciamento de agendamentos
  - Cadastro e acompanhamento de clientes
  - Configurações do sistema

## Tecnologias Utilizadas

- React.js
- React Router
- Tailwind CSS
- Armazenamento local (localStorage)

## Estrutura do Projeto

```
coldtech/
├── src/
│   ├── assets/           # Recursos estáticos (imagens, etc)
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Contextos React (AuthContext)
│   ├── data/             # Dados mockados (agendamentos.json)
│   ├── pages/            # Páginas da aplicação
│   │   ├── Admin/        # Componentes do painel administrativo
│   │   └── Agenda.jsx    # Página de agendamento
│   ├── routes/           # Configuração de rotas
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Ponto de entrada
└── public/               # Arquivos públicos
```

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o projeto:
   ```
   npm run dev
   ```

## Acesso ao Sistema

- **URL do site**: http://localhost:5174/
- **URL do agendamento**: http://localhost:5174/agenda
- **URL do painel admin**: http://localhost:5174/admin
- **URL de login**: http://localhost:5174/login

## Credenciais de Acesso

Para acessar o painel administrativo:
- **Email**: admin@coldtech.com
- **Senha**: admin123

## Principais Componentes

### Site Institucional
- **HomePage**: Página inicial com apresentação da empresa
- **Navbar**: Barra de navegação principal
- **HeroSection**: Seção de destaque com chamada para ação
- **ServicesSection**: Apresentação dos serviços oferecidos
- **CTASection**: Chamada para ação (Call to Action)
- **Footer**: Rodapé com informações de contato

### Sistema de Agendamento
- **Agenda**: Página para visualização e criação de agendamentos
- **Table**: Componente de tabela para exibição dos agendamentos

### Painel Administrativo
- **Dashboard**: Layout principal do painel administrativo
- **DashboardHome**: Página inicial com indicadores e estatísticas
- **AgendamentosAdmin**: Gerenciamento de agendamentos
- **ClientesAdmin**: Gerenciamento de clientes
- **Navbar/Sidebar**: Navegação do painel administrativo

## Autenticação

O sistema utiliza um contexto de autenticação (AuthContext) para gerenciar o estado de login do usuário. Os dados são armazenados no localStorage para persistência entre sessões.

## Rotas Protegidas

O componente PrivateRoute garante que apenas usuários autenticados possam acessar o painel administrativo.

---

Desenvolvido como projeto demonstrativo para a ColdTech Manutenção de Ar Condicionado.


```mermaid
flowchart TD
    style FE fill:#3d85c6,color:white
    style BE fill:#6aa84f,color:white
    style DB fill:#999999,color:white
    style E fill:#e06666,color:white

    FE[Frontend (React.js)] --> Main[main.jsx]
    Main --> App[App.jsx]
    App -->|Importa| Routes[routes/index.jsx]
    App -->|Importa| Context[contexts/AuthContext.jsx]
    App -->|Importa| Components[components/*]
    App -->|Importa| Pages[pages/*]

    subgraph "Rotas"
        Routes --> Private[PrivateRoute.jsx]
    end

    subgraph "Páginas"
        Pages --> Agenda[Agenda.jsx]
        Pages --> AdminPages[Admin/*]
        AdminPages --> Dashboard[Dashboard.jsx]
        AdminPages --> Login[Login.jsx]
        AdminPages --> AdminComponents[components/*]
        AdminComponents --> DashHome[DashboardHome.jsx]
        AdminComponents --> Agend[AgendamentosAdmin.jsx]
        AdminComponents --> Clientes[ClientesAdmin.jsx]
        AdminComponents --> Sidebar[Sidebar.jsx]
    end

    subgraph "Componentes Reutilizáveis"
        Components --> HomePage[HomePage.jsx]
        Components --> Hero[HeroSection.jsx]
        Components --> Services[ServicesSection.jsx]
        Components --> CTA[CTASection.jsx]
        Components --> Footer[Footer.jsx]
        Components --> Navbar[Navbar.jsx]
        Components --> Contact[ContactModal.jsx]
        Components --> Table[Table.jsx]
    end

    Agenda -->|Usa dados| Mock[data/agendamentos.json]
    Agenda -->|Faz requisição| API[HttpClient - fetch/Axios]

    API -->|Request| BE[Backend Controller API (mockado)]
    BE --> Service[Lógica de Negócio]
    Service --> Repo[Repositório/Mock]
    Repo --> DB[(LocalStorage/JSON)]

    Service -->|Validação| Validator[Validator]
    Validator -->|Erro| E[Erro/Violação]
    Validator -->|Sucesso| Repo

    BE -->|Response| API
    API --> Agenda
```
