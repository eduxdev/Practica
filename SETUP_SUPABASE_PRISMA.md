# Configuración de Supabase con Prisma

## Instalación completada ✅

Se han instalado y configurado las siguientes dependencias:
- `@supabase/supabase-js` - Cliente de Supabase
- `@supabase/auth-helpers-nextjs` - Helpers para Next.js (deprecado, considera migrar a `@supabase/ssr`)
- `prisma` - ORM para base de datos
- `@prisma/client` - Cliente generado de Prisma

## Archivos creados:

1. **`prisma/schema.prisma`** - Esquema de Prisma básico (sin modelos)
2. **`lib/supabase.ts`** - Cliente de Supabase configurado
3. **`lib/prisma.ts`** - Cliente de Prisma configurado

## Variables de entorno necesarias:

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tcqyuixrnenlsolbcprh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXl1aXhybmVubHNvbGJjcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxODA3MDUsImV4cCI6MjA3NDc1NjcwNX0.SCrHXZXhSywAQCye-KHzgY6BU1zYA1wxY7NhdS-SwF8

# Database Configuration for Prisma
DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@db.tcqyuixrnenlsolbcprh.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:[TU_PASSWORD]@db.tcqyuixrnenlsolbcprh.supabase.co:5432/postgres

# Service Role Key (obtén desde el dashboard de Supabase)
SUPABASE_SERVICE_ROLE_KEY=[TU_SERVICE_ROLE_KEY]

# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=[TU_GEMINI_API_KEY]

# Weather API Key
WEATHER_API_KEY=[TU_WEATHER_API_KEY]
```

## Siguientes pasos:

1. **Configura las variables de entorno**: Reemplaza `[TU_PASSWORD]` con tu contraseña de base de datos de Supabase
2. **Obtén la Service Role Key**: Ve al dashboard de Supabase > Settings > API para obtener tu clave de servicio
3. **Configura autenticación**: Implementa el sistema de autenticación usando Supabase Auth
4. **Ejecuta migraciones**: Si necesitas hacer cambios al esquema, usa `npx prisma db push`
5. **Regenera el cliente**: Después de cambios en el esquema, ejecuta `npx prisma generate`

## Uso básico:

### Con Prisma:
```typescript
import { prisma } from '@/lib/prisma'

// Una vez que definas tus modelos en schema.prisma, podrás usar:
// const result = await prisma.yourModel.create({ data: {...} })
// const results = await prisma.yourModel.findMany()
```

### Con Supabase:
```typescript
import { supabase } from '@/lib/supabase'

// Autenticación
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password'
})
```

## Notas importantes:

- El proyecto está listo para crear tus primeras tablas y modelos
- Prisma puede trabajar junto con Supabase Auth para la gestión de usuarios
- Para producción en Vercel, configura las mismas variables de entorno en el dashboard de Vercel
- Recuerda ejecutar `npx prisma generate` después de agregar modelos al schema
