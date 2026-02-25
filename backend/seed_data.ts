import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Find user (Argument or default)
    const usernameArg = process.argv[2];

    let user;
    if (usernameArg) {
        user = await prisma.user.findUnique({ where: { username: usernameArg } });
    } else {
        user = await prisma.user.findFirst();
        console.log("No username provided. Using first user found:", user?.username);
    }

    if (!user) {
        console.error("User not found!");
        process.exit(1);
    }

    console.log(`Seeding data for user: ${user.username} (ID: ${user.id})`);

    // 2. Add HurtForms
    const hurtForm = await prisma.hurtForm.create({
        data: {
            user: { connect: { id: user.id } },
            fill_time: new Date(),
            neck: 3,
            right_shoulder: 5,
            head: 2,
            // description: "Feeling stiff neck..." // Removed as it is not in the schema
        }
    });
    console.log("Created HurtForm:", hurtForm.id);

    // 3. Add MentalForms
    const mentalForm = await prisma.mentalForm.create({
        data: {
            user: { connect: { id: user.id } },
            fill_time: new Date(),
            problem1: 4,
            problem2: 3,
            problem3: 5,
            problem4: 2,
            problem5: 3,
            problem6: 1,
        }
    });
    console.log("Created MentalForm:", mentalForm.id);

    console.log("Seeding complete. Refresh the analysis page.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
