import { Post, PrismaClient } from '@prisma/client';
import { ObjectId } from 'bson'

const prisma = new PrismaClient();

// TODO: seed data 변경
const postToCreate = [
  {
    id: new ObjectId().toHexString(),
    title: 'Post 1',
    content: 'Content of Post 1',
  },
  {
    id: new ObjectId().toHexString(),
    title: 'Post 2',
    content: 'Content of Post 2',
  },
  {
    id: new ObjectId().toHexString(),
    title: 'Post 3',
    content: 'Content of Post 3',
  },
  {
    id: new ObjectId().toHexString(),
    title: 'Post 4',
    content: 'Content of Post 4',
  },
];

const seed = async (posts: Omit<Post, 'createdAt' | 'updatedAt' | 'deletedAt'>[]) => {
  console.log('Start seeding...');

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        content: post.content,
      },
      create: post,
    });
  }
};

seed(postToCreate)
  .then(() => {
    console.log('Seeding completed.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding done.');
  });