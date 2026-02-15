import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.riskItem.createMany({
    data: [
      { id: 1, question: "Death of a family member" },
      { id: 2, question: "Loss of employment" },
      { id: 3, question: "House damaged by disaster" },
      { id: 4, question: "Serious illness in the family" },
      { id: 5, question: "Child stopped schooling" },
    ],
    skipDuplicates: true,
  })

  console.log("Seeded risk items successfully 🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
