import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const app = await NestFactory.createApplicationContext(AppModule);
    console.log('Seeding...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.student.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.menuItem.deleteMany();

    const parent1 = await prisma.parent.create({
        data: { name: "Waqar Ahmed", walletBalance: 100 },
    });

    const parent2 = await prisma.parent.create({
        data: { name: "Sara Khan", walletBalance: 30 },
    });

    const parent3 = await prisma.parent.create({
        data: { name: "Ammar Ahmed", walletBalance: 5 },
    });

    await prisma.student.createMany({
        data: [
            {
                name: "Ali",
                allergens: ["nuts"],
                parentId: parent1.id,
            },
            {
                name: "Ayesha",
                allergens: ["gluten"],
                parentId: parent1.id,
            },
            {
                name: "Ahmed",
                allergens: [],
                parentId: parent2.id,
            },
            {
                name: "Zara",
                allergens: ["dairy", "nuts"],
                parentId: parent2.id,
            },
            {
                name: "Zohaar",
                allergens: [],
                parentId: parent3.id,
            },
        ],
    });

    await prisma.menuItem.createMany({
        data: [
            {
                name: "Peanut Cake",
                price: 20,
                allergens: ["nuts"],
                available: true,
            },
            {
                name: "Chicken Burger",
                price: 15,
                allergens: [],
                available: true,
            },
            {
                name: "Cheese Sandwich",
                price: 10,
                allergens: ["dairy"],
                available: true,
            },
            {
                name: "Gluten Free Salad",
                price: 12,
                allergens: [],
                available: true,
            },
            {
                name: "Expired Pizza",
                price: 25,
                allergens: [],
                available: false,
            },
            {
                name: "Nutty Brownie",
                price: 18,
                allergens: ["nuts"],
                available: true,
            },
        ],
    });


    console.log('Seeding done!');

    await app.close();
}

main().catch((e) => console.error(e));
