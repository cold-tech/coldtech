# ColdTech - Sistema de Gerenciamento de Agendamentos

## Sobre o Projeto

Sistema de gerenciamento de agendamentos para serviços de manutenção, instalação e outros serviços relacionados a refrigeração.

## Tecnologias Utilizadas

- React
- Vite
- Supabase (Banco de dados)
- Vercel (Deploy)

## Configuração do Projeto

### Pré-requisitos

- Node.js
- npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   REACT_APP_SUPABASE_URL=sua_url_do_supabase
   REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

### Configuração do Banco de Dados

1. Crie um projeto no Supabase
2. Execute o script SQL localizado em `supabase/schema.sql` no editor SQL do Supabase

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```
npm run dev
```

### Build

Para criar uma versão de produção:

```
npm run build
```

## Deploy na Vercel

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente no dashboard da Vercel:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
3. Deploy!

## Estrutura do Projeto

- `/src/components` - Componentes reutilizáveis
- `/src/pages` - Páginas da aplicação
- `/src/services` - Serviços para comunicação com APIs e banco de dados
- `/src/data` - Dados estáticos e modelos
- `/supabase` - Scripts SQL e configurações do Supabase