import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";
import { SRLWrapper } from "simple-react-lightbox";
import "./App.css";

const accessKey = "VMUOeKDkdlgK8gK_i2mHCJ5bf0cijIgD08Nt1UhtY8M";

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const getPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const imagesFromApi = data.results ?? data;

        if (page === 1) setImages(imagesFromApi);

        setImages((images) => [...images, ...imagesFromApi]);
      });
  }, [page, query]);

  useEffect(() => {
    getPhotos();
  }, [page, getPhotos]);

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
  }

  
  return (
    <div className="app">
      <h1>Infinite Photo Feed</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Photos.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length}
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<Loader />}
      >
        <SRLWrapper>
          <div className="image-grid">
            {images.map((image, index) => (
              <a className="image" key={index} href={image.urls.thumb}>
                <img src={image.urls.regular} alt="" />
              </a>
            ))}
          </div>
        </SRLWrapper>
      </InfiniteScroll>
    </div>
  );
}
