import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const getAllPhotographers = () => prisma.photographer.findMany();

export const getPhotographer = (id) =>
  prisma.photographer.findUnique({
    where: { id: parseInt(id) },
  });

export const getAllMediasForPhotographer = (photographerId) =>
  prisma.media.findMany({
    where: { photographerId: parseInt(photographerId) },
  });

export const updateNumberOfLikes = (mediaId, newNumberOfLikes) =>
  prisma.media.update({
    where: { id: parseInt(mediaId) },
    data: { likes: newNumberOfLikes },
  });