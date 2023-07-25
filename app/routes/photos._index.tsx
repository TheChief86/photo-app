import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { GetPhotosRes, SinglePhotoRes } from "~/models/photo.server";
import { getPhotos } from "~/models/photo.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const photos = await getPhotos(userId);
  return json({ photos });
};

const PhotoThumbnail = (photo: SinglePhotoRes) => (
  <img width={64} height={64} src={photo.data} alt="" />
);

export default function PhotoGallery() {
  const data = useLoaderData<typeof loader>()
  const photos: GetPhotosRes = JSON.parse(JSON.stringify(data.photos));
  return (
    <main className="flex h-full bg-white">
      {
        !!photos.length &&
        photos.map((photo) => (
          <PhotoThumbnail key={photo.id} {...photo} />
        ))
      }
      {
        !photos.length &&
        <div className="flex-1 p-4">
          You have no photos. Feel free to add some!
        </div>
      }
    </main>
  );
}
