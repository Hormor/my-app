import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./api";
import { Talk } from "./types";
import PlusIcon from "./component/PlusIcon";
import DeleteIcon from "./component/DeleteIcon";
import Modal from "./component/Modal";

function App() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Array<Talk>>();
  const [activeTalkId, setActiveTalkId] = useState<string | null>();
  const [addAttendee, setAddAttendee] = useState(false);

  const getTalks = useCallback(async () => {
    try {
      const res = await api.get("/talk");
      setData(res.data);
    } catch (error: any) {
      toast.error(error);
    }
  }, []);

  const handleDone = () => {
    getTalks();
    setShow(false);
  };

  const deleteTalk = async (id: string) => {
    try {
      await api.delete(`/talk/${id}`);
      toast.success("Deleted Successfully");
      getTalks();
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleTalkClick = (id: string) => {
    setAddAttendee(false);
    setActiveTalkId(id);
    setShow(true);
  };

  const handleAddAttendee = () => {
    setAddAttendee(true);
    setShow(true);
  };

  useEffect(() => {
    getTalks();
  }, [getTalks]);

  return (
    <div className='p-5 max-w-5xl mx-auto'>
      <h1 className='font-semibold text-xl'>Talks</h1>
      <div className='mt-5 flex justify-end'>
        <button
          onClick={() => {
            setAddAttendee(false);
            setActiveTalkId(null);
            setShow(true);
          }}
          className='mr-5 px-4 py-2 border rounded bg-indigo-600 text-white'
        >
          Add a talk
        </button>
        <button
          onClick={handleAddAttendee}
          className='px-4 py-2 border rounded bg-indigo-600 text-white'
        >
          Add an attendee
        </button>
      </div>
      <div className='border border-[#d1d7db] w-full rounded mt-5'>
        <table className='w-full'>
          <thead>
            <tr className=''>
              <th className='px-4 py-2 text-left'>#</th>
              <th className='px-4 py-2 text-left'>Title</th>
              <th className='px-4 py-2 text-left'>No of Attendees</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr key={item.id} className='border bg-white'>
                  <td className='px-4 py-2'>{index + 1}</td>
                  <td className='px-4 py-2'>{item.title}</td>
                  <td className='px-4 py-2 '>{item.attendees.length}</td>
                  <td className='px-4 py-2 text-right'>
                    <button
                      onClick={() => handleTalkClick(item.id)}
                      className='bg-indigo-600 text-white mr-5 border rounded px-4 py-2 hover:bg-indigo-400'
                    >
                      <PlusIcon />
                    </button>
                    <button
                      onClick={() => deleteTalk(item.id)}
                      className='bg-red-600 text-white border rounded px-4 py-2 hover:bg-red-400'
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Modal
        show={show}
        handleClose={() => setShow(false)}
        onDone={handleDone}
        talkId={activeTalkId}
        addAttendee={addAttendee}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
