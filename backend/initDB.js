const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const existingUser = await prisma.user.findUnique({
        where: {
            username: 'admin'
        }
    });

    if (existingUser) {
        console.log('User with username "admin" already exists.');
    } else {
        await prisma.user.create({
            data: {
                username: 'admin',
                password: '$2b$10$PmRQ.FCpi50lnr5OJ9Tib.kaL9WwhI2eCTFvJFn0QJk1xk0eVvfdq',
                name: 'admin',
                role: 'ADMIN',
                userDetail: {
                    create: {
                        gender: null,
                        birthday: '',
                        age: 0,
                        medical_History: '',
                        address: '',
                        email: '',
                        phone: '',
                        headshot: '0'
                    }
                }
            }
        });
        console.log('User created successfully.');
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
