import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Home";
import Authenticate from "./components/Login";
import MoviesList from "./components/Movies/MoviesList";
import UserNavigation from "./components/Navigation/UserNavigation";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import MovieDetail from "./components/Movies/MovieDetail";
import AdminUsers from "./components/Admin/User/AdminUsers";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminMovies from "./components/Admin/AdminMovies";
import MovieCreateForm from "./components/Movies/MovieCreateForm";
import AdminMovieDetails from "./components/Admin/AdminMovieDetails";
import AdminGeners from "./components/Admin/Genre/AdminGenres";
import AdminGenersCreate from "./components/Admin/Genre/AdminGenreCreateForm";
import AdminUserEdit from "./components/Admin/User/AdminUserEdit";
import Rentals from "./components/Rentals/Rentals";
import AdminRentals from "./components/Admin/Rental/AdminRentals";
import UserEditForm from "./components/UserEditForm";
import AdminLanguage from "./components/Admin/Language/AdminLanguage";
import AdminLanguageCreateForm from "./components/Admin/Language/AdminLanguageCreateForm";
import AdminMovieCard from "./components/Admin/AdminMovieCard";
import AdminActors from "./components/Admin/Actor/AdminActors";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/" exact />
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

          <Route element={<Home />} path="/admin" />
        </Route>
        <Route element={<Authenticate />} path="/login" />
        {/* <Route element={<UnAuthenticate />} path="/un-authenticate" /> */}
      </Routes>
    </Router>
  );
}

export default App;
