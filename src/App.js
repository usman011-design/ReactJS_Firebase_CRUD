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
      <div className="form-inputs">
        <input
          className="form-input"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          className="form-input"
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          className="form-input"
          placeholder="Email..."
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          className="form-input"
          placeholder="Address..."
          onChange={(event) => {
            setAddress(event.target.value);
          }}
        />
        <button className="button" onClick={createUser}>Create User</button>
      </div>
      <div className="user-list">
        {users.map((user) => {
          return (
            <div className="user-card" key={user.id}>
              <h2>Name: {user.name}</h2>
              <p>Age: {user.age}</p>
              <p>Email: {user.email}</p>
              <p>Address: {user.address}</p>
              <div className="user-actions">
                <button className="button" onClick={() => updateUser(user.id, user.age)}>Increment Age</button>
                <button className="button" onClick={() => deleteUser(user.id)}>Delete User</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App
