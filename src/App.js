import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: name,
      age: Number(age),
      email: email,
      address: address,
    });
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newfield = { age: age + 1 };
    await updateDoc(userDoc, newfield);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, [usersCollectionRef]);

  return (
    <div className="App">
      <h1>Firebase CRUD App</h1>
      <input
        placeholder="Name..."
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <input
        placeholder="Age..."
        onChange={(event) => {
          setAge(event.target.value);
        }}
      />
      <input
        placeholder="Email..."
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <input
        placeholder="Address..."
        onChange={(event) => {
          setAddress(event.target.value);
        }}
      />
      <button onClick={createUser}>Create User</button>
      {users.map((user) => {
        return (
          <>
            {" "}
            <h1>Name: {user.name}</h1>
            <h1>Age: {user.age}</h1>
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              increment age
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              {" "}
              Delete User
            </button>
            <h1>Email: {user.email}</h1>
            <h1>address: {user.address}</h1>
          </>
        );
      })}
    </div>
  );
}

export default App;
