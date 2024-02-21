import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import { useSnackbar } from 'notistack';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "@firebase/firestore";


function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    if (!name || !age || !email || !address) {
      alert("Please fill in all fields");
      return;
    }
    // Check for duplicate entries based on a unique attribute, e.g., email
    const isDuplicate = users.some(user => user.email === email);
    if (isDuplicate) {
      alert("User with this email already exists");
      return;
    }
    await addDoc(usersCollectionRef, { name, age: Number(age), email, address });
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
      <div className="form-group">
        <input
          placeholder="Name..."
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="number"
          placeholder="Age..."
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />
        <input
          placeholder="Email..."
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          placeholder="Address..."
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <button onClick={createUser}>Create User</button>
      <div className="user-list">
      {users.map((user, index) => {
  return (
    <div key={user.id} className="user-card" style={{animationDelay: `${index * 0.1}s`}}>
      <h1>Name: {user.name}</h1>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <p>Address: {user.address}</p>
      <div>
        <button className="increment-age" onClick={() => updateUser(user.id, user.age)}>Increment Age</button>
        <button className="delete-user" onClick={() => deleteUser(user.id)}>Delete User</button>
      </div>
    </div>
  );
})}     
      </div>
    </div>
  );
}

export default App
