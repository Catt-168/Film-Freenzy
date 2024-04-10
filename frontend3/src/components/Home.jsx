import React from "react";
import AdminNavigation from "./Navigation/AdminNavigation";
import UserNavigation from "./Navigation/UserNavigation";

export default function Home() {
  const jwtToken = localStorage.getItem("jwtToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user.isAdmin)
    return (
      <>
        <UserNavigation />
        <div>Home</div>
      </>
    );
  return <div>Admin</div>;
}
