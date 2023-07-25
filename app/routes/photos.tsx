import { Form, Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { createPhoto } from "~/models/photo.server";

import { useUser } from "~/utils";

export default function PhotosPage() {
  const [newPhoto, setNewPhoto] = useState('');
  const [newPhotoFilename, setNewPhotoFilename] = useState('');
  const user = useUser();

  const storePhotoLocal = async (
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
      if (typeof reader.result === 'string') {
        setNewPhoto(reader.result.toString());
        setNewPhotoFilename(file.name);
      }
    }
  };

  const uploadPhoto = async () => {
    if (!newPhoto) {
      return;
    }
    const photo = await createPhoto({
      data: newPhoto,
      name: newPhotoFilename,
      userId: user.id,
    });
    setNewPhoto('');
    setNewPhotoFilename('');
    return photo;
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
          <input type="file" id="fileUploader"
            className="p-4 text-xl text-blue-500"
            onChange={(e) => storePhotoLocal(e)} />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            onClick={uploadPhoto}
          >
            Upload
          </button>

          <hr />

          <Outlet />
        </div>
      </main>
    </div>
  );
};
