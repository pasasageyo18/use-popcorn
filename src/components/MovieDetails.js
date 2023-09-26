import { useState, useEffect } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const KEY = "a44c7e1c";

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} ImDb Rating
              </p>
            </div>
          </header>
          <Rating
            isWatched={isWatched}
            userRating={userRating}
            setUserRating={setUserRating}
            watchedUserRating={watchedUserRating}
            handleAdd={handleAdd}
            plot={plot}
            actors={actors}
            director={director}
          />
        </>
      )}
    </div>
  );
}

function Rating({
  isWatched,
  userRating,
  setUserRating,
  watchedUserRating,
  handleAdd,
  plot,
  actors,
  director,
}) {
  return (
    <section>
      <div className="rating">
        {!isWatched ? (
          <>
            <StarRating maxRating={10} size={24} onSetRating={setUserRating} />

            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </>
        ) : (
          <p>You rated with movie {watchedUserRating} ⭐️</p>
        )}
      </div>
      <em>{plot}</em>
      <p> Starring {actors}</p>
      <p>Directed by {director}</p>
    </section>
  );
}

export default MovieDetails;
