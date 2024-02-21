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
    if (!name.trim() || !age || !email.trim() || !address.trim()) {
      enqueueSnackbar('Please fill in all fields before creating a user.', { variant: 'warning' });
      return;
    }

    // Check for duplicate email
    const querySnapshot = await getDocs(query(usersCollectionRef, where("email", "==", email.trim())));
    if (!querySnapshot.empty) {
      enqueueSnackbar('A user with this email already exists.', { variant: 'error' });
      return;
    }

    try {
      await addDoc(usersCollectionRef, {
        name: name.trim(),
        age: Number(age),
        email: email.trim(),
        address: address.trim(),
      });
      enqueueSnackbar('User created successfully.', { variant: 'success' });
      // Clear the form fields after successful creation
      setName('');
      setAge('');
      setEmail('');
      setAddress('');
    } catch (error) {
      console.error("Error adding document: ", error);
      enqueueSnackbar('Failed to create user.', { variant: 'error' });
    }
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
