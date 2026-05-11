
````md
# AuthContext Quick README

## 0. useStates

```js
const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [task, setTask] = useState(null);
const [success, setSuccess] = useState(null);
````

**Use:**

* `currentUser` = logged-in user
* `loading` = loading state
* `error` = error message
* `task` = current user's tasks
* `success` = success message

---

## 1. Get Current User through Firebase

```js
useEffect(() => {
  try {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setCurrentUser(currentuser);
    });

    return () => unsubscribe();
  } catch (error) {
    throw error;
  }
}, []);
```

**Note:**

i. Import from Firebase Auth:

```js
import { onAuthStateChanged } from "firebase/auth";
```

ii. Import auth config:

```js
import { auth } from "@/app/firebase/firebase.config";
```

**Use:**

* Gets current logged-in user
* Keeps user after page refresh
* Sets `currentUser`
* Returns `null` after logout

---

## 2. Get Current Tasks

```js
useEffect(() => {
  try {
    onValue(ref(db, "task"), (snapshot) => {
      const data = snapshot.val();

      const tasks = data
        ? Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }))
        : [];

      const myTasks = tasks.filter(
        (item) => item?.uid === currentUser?.uid
      );

      setTask(myTasks);
    });
  } catch (error) {
    throw error;
  }
}, [currentUser]);
```

**Note:**

i. Import from Firebase Database:

```js
import { onValue, ref } from "firebase/database";
```

ii. Import db config:

```js
import { db } from "@/app/firebase/firebase.config";
```

**Use:**

* Reads all tasks from Realtime Database
* Converts object to array
* Filters only current user's tasks
* Saves filtered tasks in `task`

---

## 3. Email Password Register

```js
const emailPassRegister = async (displayName, email, pass) => {
  setLoading(true);

  try {
    const registerResponse = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );

    const finalResponse = registerResponse?.user;

    await updateProfile(finalResponse, {
      displayName: displayName,
    });

    await set(ref(db, `user/${finalResponse.uid}`), {
      uid: finalResponse.uid,
      displayName: displayName || "",
      email: finalResponse.email,
    });

    setCurrentUser({ ...finalResponse, displayName });
    setLoading(false);
    setError(null);
  } catch (error) {
    setError(error?.message);
    setLoading(false);
  }
};
```

**Note:**

i. Import from Firebase Auth:

```js
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
```

ii. Import from Firebase Database:

```js
import { set, ref } from "firebase/database";
```

**Use:**

* Creates user with email and password
* Adds `displayName` to Firebase Auth user
* Saves user info in Realtime Database
* Sets `currentUser`

**Call:**

```js
await emailPassRegister(displayName, email, pass);
```

---

## 4. Email Password Login

```js
const emailPassLogin = async (email, pass) => {
  setLoading(true);

  try {
    const registerResponse = await signInWithEmailAndPassword(
      auth,
      email,
      pass
    );

    const finalResponse = registerResponse?.user;

    setCurrentUser(finalResponse);
    setLoading(false);
  } catch (error) {
    setError(error?.message);
    setLoading(false);
  }
};
```

**Note:**

i. Import from Firebase Auth:

```js
import { signInWithEmailAndPassword } from "firebase/auth";
```

**Use:**

* Logs in user with email and password
* Sets logged-in user in `currentUser`

**Call:**

```js
await emailPassLogin(email, pass);
```

---

## 5. Google Login

```js
const googleAuthProvider = new GoogleAuthProvider();

const googleLogin = async () => {
  setLoading(true);

  try {
    const googleLoginResponse = await signInWithPopup(
      auth,
      googleAuthProvider
    );

    const finalResponse = googleLoginResponse.user;

    await set(ref(db, `user/${finalResponse.uid}`), {
      uid: finalResponse.uid,
      displayName: finalResponse.displayName || "",
      email: finalResponse.email,
      photoURL: finalResponse.photoURL || "",
    });

    setCurrentUser(finalResponse);
    setError(null);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

**Note:**

i. Import from Firebase Auth:

```js
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
```

ii. Import from Firebase Database:

```js
import { set, ref } from "firebase/database";
```

**Use:**

* Opens Google popup
* Login/register with Google
* Saves Google user in Realtime Database
* Sets `currentUser`

**Call:**

```js
await googleLogin();
```

---

## 6. Logout

```js
const logOut = async () => {
  setLoading(true);

  try {
    await signOut(auth);
    setCurrentUser(null);
    setLoading(false);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};
```

**Note:**

i. Import from Firebase Auth:

```js
import { signOut } from "firebase/auth";
```

**Use:**

* Logs out current user
* Clears `currentUser`

**Call:**

```js
await logOut();
```

---

## 7. Add Task

```js
const addTask = async (task, uid) => {
  setLoading(true);

  const finalResponse = {
    task,
    uid,
  };

  try {
    await push(ref(db, "task"), finalResponse);

    setLoading(false);
    setSuccess("Task created Successfully");
    setError(null);
    setTask(finalResponse);
  } catch (error) {
    setSuccess(null);
    setLoading(false);
    setError(error?.message);
  }
};
```

**Note:**

i. Import from Firebase Database:

```js
import { push, ref } from "firebase/database";
```

**Use:**

* Adds new task
* Saves task with current user's `uid`
* Uses `push()` for random task id

**Call:**

```js
await addTask(
  {
    title,
    description,
    teamSize,
    createdAt: Date.now(),
  },
  currentUser.uid
);
```

---

## 8. Update Task

```js
const updateTask = async (task) => {
  setLoading(true);

  try {
    const { id, ...rest } = task;

    await update(ref(db, `task/${id}`), rest);

    setLoading(false);
    setSuccess("updated successfully");
    setError(null);
  } catch (error) {
    setError(error?.message);
    setLoading(false);
    setSuccess(null);
  }
};
```

**Note:**

i. Import from Firebase Database:

```js
import { update, ref } from "firebase/database";
```

**Use:**

* Updates task by task `id`
* `id` is used for database path
* `rest` is updated data

**Call:**

```js
await updateTask(task);
```

---

## 9. Delete Task

```js
const deleteTask = async (task) => {
  setLoading(true);

  try {
    const { id } = task;

    await remove(ref(db, `task/${id}`));

    setLoading(false);
    setSuccess("deleted successfully");
    setError(null);
  } catch (error) {
    setError(error?.message);
    setLoading(false);
    setSuccess(null);
  }
};
```

**Note:**

i. Import from Firebase Database:

```js
import { remove, ref } from "firebase/database";
```

**Use:**

* Deletes task by task `id`

**Call:**

```js
await deleteTask(task);
```

---

## 10. Context Values

```js
const values = {
  emailPassRegister,
  emailPassLogin,
  googleLogin,
  logOut,
  addTask,
  updateTask,
  deleteTask,
  currentUser,
  loading,
  error,
  task,
  success,
};
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;

```

**Use:**

* Sends all functions and states to components

---

## 11. useAuth Hook

```js
export const useAuth = () => {
  return useContext(AuthContext);
};
```

**Note:**

i. Import from React:

```js
import { useContext } from "react";
```

**Use in component:**

```js
const {
  currentUser,
  loading,
  error,
  task,
  emailPassRegister,
  emailPassLogin,
  googleLogin,
  logOut,
  addTask,
  updateTask,
  deleteTask,
} = useAuth();
```


