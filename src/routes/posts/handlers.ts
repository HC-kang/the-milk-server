import db from '@src/database';
import { NotFoundError } from 'elysia';

export async function getPosts() {
  try {
    return await db.post.findMany({ orderBy: { createdAt: 'asc' } });
  } catch (err) {
    console.error(err);
  }
}

export async function getPost(id: string) {
  try {
    const post = await db.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  } catch (err) {
    console.error(err);
  }
}

export async function createPost(data: { title: string; content: string }) {
  try {
    return await db.post.create({ data });
  } catch (err) {
    console.error(err);
  }
}

export async function updatePost(
  id: string,
  data: { title?: string; content?: string }
) {
  try {
    return await db.post.update({
      where: { id },
      data,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function deletePost(id: string) {
  try {
    return await db.post.delete({ where: { id } });
  } catch (err) {
    console.error(err);
  }
}
