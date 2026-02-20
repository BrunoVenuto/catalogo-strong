# Catálogo Premium (Next.js + Supabase)

## Rodando local

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Variáveis de ambiente

Crie `.env.local` na raiz:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Banco (Supabase)

1. No Supabase, abra **SQL Editor** e execute o arquivo: `supabase/schema.sql`
2. Crie um usuário (Auth) com email/senha (ou convide)
3. Promova o usuário a admin inserindo na tabela `admin_users`:

```sql
insert into public.admin_users (user_id)
values ('<UUID do usuário em auth.users>');
```

## Admin

- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin
- Produtos: http://localhost:3000/admin/produtos

> O middleware valida sessão + permissão via tabela `admin_users`.

## Observações

- Produtos agora vêm do Supabase (tabela `products`).
- Pedidos agora são salvos no Supabase (tabelas `orders` e `order_items`).
