import path from 'node:path'
import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    async driver() {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const pg = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      })
      return pg
    },
  },
} satisfies PrismaConfig
