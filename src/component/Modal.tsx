import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlusIcon from "./PlusIcon";
import api from "../api";
import { Attendee } from "../types";

type ModalProps = {
  show: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  onDone: Function;
  talkId?: string | null;
  addAttendee: boolean;
};

export default function Modal({
  show,
  handleClose,
  onDone,
  talkId,
  addAttendee,
}: ModalProps) {
  const [title, setTitle] = useState("");
  const [attendee, setAttendee] = useState("");
  const [data, setData] = useState<Array<Attendee>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addTalk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!title || !attendee) && (!email || !name)) {
      return;
    }
    try {
      if (addAttendee) {
        await api.post("/attendee", { email, name });
      } else {
        talkId
          ? await api.put(`/talk/${talkId}/attendee`, { title, attendee })
          : await api.post("/talk", { title, attendee });
        setTitle("");
        setAttendee("");
        setEmail("");
        setName("");
        onDone();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const getAttendees = useCallback(async () => {
    const res = await api.get("/attendee");
    console.log(res);
    setData(res.data);
  }, []);

  useEffect(() => {
    getAttendees();
  }, [getAttendees]);

  return show ? (
    <div className='bg-black/70 fixed inset-0 py-28'>
      <div className='relative bg-white shadow-md rounded mx-auto max-w-xl'>
        <button onClick={handleClose} className='absolute right-0'>
          <PlusIcon className='rotate-45' />
        </button>
        <form onSubmit={addTalk} className='p-10 grid grid-cols-1'>
          {addAttendee ? (
            <>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border border-gray-300 focus:border-indigo-600 focus:outline-none rounded mt-2 px-4 py-2'
              />
              <label htmlFor='name' className='mt-6'>
                Name
              </label>
              <input
                type='name'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-gray-300 focus:border-indigo-600 focus:outline-none rounded mt-2 px-4 py-2'
              />
            </>
          ) : (
            <>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='border border-gray-300 focus:border-indigo-600 focus:outline-none rounded mt-2 px-4 py-2'
              />
              <label htmlFor='attendee' className='mt-6'>
                Attendee
              </label>
              <select
                onChange={(e) => setAttendee(e.target.value)}
                id='attendee'
                className='border border-gray-300 focus:border-indigo-600 focus:outline-none rounded mt-2 px-4 py-2'
              >
                <option value=''></option>
                {data?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            disabled={(!title || !attendee) && (!email || !name)}
            type='submit'
            className='mt-8 bg-indigo-600 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-indigo-600/50'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
