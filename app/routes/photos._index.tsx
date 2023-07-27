import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import type { GetPhotosRes, SinglePhotoRes } from "~/models/photo.server";
import { deletePhoto, getPhotos } from "~/models/photo.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const photos = await getPhotos(userId);
  return json({ photos });
};

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const photoIdToDelete = formData.get('photoIdToDelete') as string;
  return await deletePhoto({
    userId,
    id: photoIdToDelete,
  });
};

const PhotoThumbnail = (photo: SinglePhotoRes) => {
  const fetcher = useFetcher();

  return (
    <div className="group relative max-h-80 pr-2">
      <fetcher.Form method="post">
        <button
          className="absolute invisible top-2 right-4 rounded-full bg-slate-400 w-6 h-6 group-hover:visible"
          type="submit"
          name="photoIdToDelete"
          value={photo.id}
        >
          <strong>X</strong>
        </button>
      </fetcher.Form>
      <img className="max-h-full" src={photo.data} alt="" />
    </div>
  );
};

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
