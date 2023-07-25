import type { User, Photo } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Photo } from "@prisma/client";

export type GetPhotosRes = Awaited<ReturnType<typeof getPhotos>>;
export type SinglePhotoRes = GetPhotosRes[0];

export function getPhoto({
  id,
  userId,
}: Pick<Photo, "id"> & {
  userId: User["id"];
}) {
  return prisma.photo.findFirstOrThrow({
    select: { id: true, data: true, name: true },
    where: { id, userId },
  });
}

export function getPhotos(userId: User["id"]) {
  return prisma.photo.findMany({
    where: { userId },
    select: { id: true, data: true, name: true },
    orderBy: { createdAt: "desc" },
  });
}

export function createPhoto({
  data,
  name,
  userId,
}: Pick<Photo, "data" | "name"> & {
  userId: User["id"];
}) {
  return prisma.photo.create({
    data: {
      name,
      data,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePhoto({
  id,
  userId,
}: Pick<Photo, "id"> & { userId: User["id"] }) {
  return prisma.photo.deleteMany({
    where: { id, userId },
  });
}
