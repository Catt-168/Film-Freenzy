import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import AdminActors from "./components/Admin/Actor/AdminActors";
import AdminMovieCard from "./components/Admin/AdminMovieCard";
import AdminMovieDetails from "./components/Admin/AdminMovieDetails";
import AdminMovies from "./components/Admin/AdminMovies";
import AdminGenersCreate from "./components/Admin/Genre/AdminGenreCreateForm";
import AdminGeners from "./components/Admin/Genre/AdminGenres";
import AdminLanguage from "./components/Admin/Language/AdminLanguage";
import AdminLanguageCreateForm from "./components/Admin/Language/AdminLanguageCreateForm";
import AdminRentals from "./components/Admin/Rental/AdminRentals";
import AdminUserEdit from "./components/Admin/User/AdminUserEdit";
import AdminUsers from "./components/Admin/User/AdminUsers";
import Authenticate from "./components/Login";
import MovieCreateForm from "./components/Movies/MovieCreateForm";
import MovieDetail from "./components/Movies/MovieDetail";
import MoviesList from "./components/Movies/MoviesList";
import Rentals from "./components/Rentals/Rentals";
import AdminRoute from "./components/Routes/AdminRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import UserEditForm from "./components/UserEditForm";
import Home from "./components/Home/Home";
import Dashboard from "./components/Admin/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/home" exact />
          <Route path="/movies">
            <Route element={<MovieDetail />} path="/movies/:id" />
            <Route element={<MoviesList />} path="/movies" />
          </Route>
          <Route element={<Rentals />} path="/rentals" />
          <Route element={<UserEditForm />} path="/edit" />
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<MovieCreateForm />} path="admin/movies/create" />
          <Route
            element={<AdminMovieDetails />}
            path="/admin/movies/:id/update"
          />
          <Route element={<AdminMovieCard />} path="/admin/movies/:id" />
          <Route element={<AdminGenersCreate />} path="admin/genres/create" />
          <Route element={<AdminGenersCreate />} path="admin/genres/:id" />
          <Route
            element={<AdminLanguageCreateForm />}
            path="admin/languages/create"
          />
          <Route
            element={<AdminLanguageCreateForm />}
            path="admin/languages/:id"
          />
          <Route element={<AdminUserEdit />} path="admin/users/:id" />
          <Route element={<AdminRentals />} path="/admin/rentals" />
          <Route element={<AdminGeners />} path="/admin/genres" />
          <Route element={<AdminUsers />} path="/admin/users" />
          <Route element={<AdminMovies />} path="/admin/movies" />
          <Route element={<AdminLanguage />} path="/admin/languages" />
          <Route element={<AdminActors />} path="/admin/actors" />

          <Route element={<Dashboard />} path="/admin/home" />
          <Route element={<Home />} path="/admin" />
        </Route>
        <Route element={<Authenticate />} path="/login" />
        {/* <Route element={<UnAuthenticate />} path="/un-authenticate" /> */}
      </Routes>
    </Router>
  );
}

export default App;
