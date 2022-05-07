import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { useUser } from "./userContext";

const Home = () => {
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    editors: [],
  });
  const { userState } = useUser();
  const [notes, setNotes] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState(null);

  const notesCollectionRef = collection(db, "boards");
  const usersCollectionRef = collection(db, "users");

  const createNote = async () => {
    const boardObj = {
      ...newNote,
      editors: [
        ...newNote.editors,
        { id: userState.id, userName: userState.userName },
      ],
    };
    try {
      await addDoc(notesCollectionRef, boardObj);
    } catch (error) {
      console.error(error);
    }
  };

  const updateNoteTitle = async () => {
    try {
      const boardDoc = doc(db, "boards", note.id);
      await updateDoc(boardDoc, { title: newNote.title });
    } catch (error) {
      console.error(error);
    }
  };

  const getBoards = async () => {
    const response = await getDocs(notesCollectionRef);
    // const demoNotes = response.docs.map((doc) => ({
    //   ...doc.data(),
    //   id: doc.id,
    // }));
    // setNotes(demoNotes);
    onSnapshot(notesCollectionRef, (response) => {
      setNotes(response.docs.map((item) => ({ ...item.data(), id: item.id })));
    });
  };

  const giveUserPermission = async (userId, userName) => {
    try {
      const boardDoc = doc(db, "boards", note.id);
      await updateDoc(boardDoc, {
        editors: [...note.editors, { id: userId, userName: userName }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const editNote = () => {
    const findEditor = notes.filter((note) =>
      note.editors.find((editor) => editor.id === userState.id)
    );
    if (findEditor) {
      setNewNote(note);
    } else {
      console.log("You are not allowed to edit it");
    }
  };

  useEffect(() => {
    getBoards();
  }, []);

  const getUsers = async () => {
    const response = await getDocs(usersCollectionRef);
    // const demoUsers = response.docs.map((doc) => ({
    //   ...doc.data(),
    // }));
    // setUsers(demoUsers);
    onSnapshot(usersCollectionRef, (response) => {
      setUsers(response.docs.map((item) => ({ ...item.data() })));
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Title"
        value={newNote.title}
        onChange={(e) =>
          setNewNote((prev) => ({ ...prev, title: e.target.value }))
        }
      ></input>
      <input
        type="text"
        placeholder="Enter Content"
        value={newNote.content}
        onChange={(e) =>
          setNewNote((prev) => ({ ...prev, content: e.target.value }))
        }
      ></input>
      <button onClick={createNote}>Create Note</button>
      <button onClick={updateNoteTitle}>Update Note</button>
      <div>
        {notes.map((note) => (
          <div key={note.id}>
            <h2>{note.title}</h2>
            <button
              onClick={() => {
                setShowUsers(true);
                setNote(note);
              }}
            >
              Permission
            </button>
            <button onClick={() => editNote()}>Edit</button>
          </div>
        ))}
      </div>
      {showUsers &&
      note.editors.find((editor) => editor.id === userState.id) ? (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h2>{user.userName}</h2>
              <button
                onClick={() => giveUserPermission(user.id, user.userName)}
              >
                Allow
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { Home };
