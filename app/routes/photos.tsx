import type { ActionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useFetcher } from "@remix-run/react";
import { createPhoto } from "~/models/photo.server";
import type { CreatePhotoInput } from "~/models/photo.server";

import { useUser } from "~/utils";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const newPhotoInputData = Object.fromEntries(formData) as CreatePhotoInput;
  return await createPhoto(newPhotoInputData);
};

export default function PhotosPage() {
  const user = useUser();
  const fetcher = useFetcher();

  const uploadPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = e.target ?? {};
    if (!files || (files && !files.length)) {
      return;
    }
    const [file] = files;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const photoBase64Data = reader.result?.toString();
      const fileName = file.name;
      if (photoBase64Data) {
        fetcher.submit({
          userId: user.id,
          data: photoBase64Data,
          name: fileName,
        }, { method: 'post' });
      }
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Photos</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="flex-1 p-6">
          <fetcher.Form>
            <label htmlFor="filePicker" className="p-4 text-xl text-blue-500">
              + Add Photo
            </label>
            <input type="file" id="filePicker" hidden
              onChange={uploadPhoto} />
          </fetcher.Form>

          <hr className="mt-4" />

          <Outlet />
        </div>
      </main>
    </div>
  );
};
