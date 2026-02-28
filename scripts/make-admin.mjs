import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()

  if (!email) {
    console.error('Usage: node scripts/make-admin.mjs <email>')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.error(`Utilisateur introuvable: ${email}`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { role: Role.ADMIN },
  })

  console.log(`Role ADMIN attribué à ${email}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
