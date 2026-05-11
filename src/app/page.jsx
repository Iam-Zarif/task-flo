"use client"
import { useAuth } from "@/context/AuthContext";


export default function Home() {
  const { currentUser, loading } = useAuth();
  console.log("Current Uuser" , currentUser)
  
  return (
    <>
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <p>{currentUser?.displayName}</p>
          <p>{currentUser?.email}</p>
        </>
      )}
    </>
  );
}
