import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Card from "./Card";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const ac = new AbortController();

    async function getProducts() {
      try {
        setLoading(true);

        const res = await fetch("https://fakestoreapi.com/products/", { signal: ac.signal });
        const baseProducts = await res.json();
        // duplicate some variants for this task and see pagination
        const productsWithThreeVariants = baseProducts.map((p) => {
          const imgs = Array.isArray(p.images) && p.images.length > 0
              ? p.images.filter(Boolean)
              : [p.image].filter(Boolean);

          const variants = Array.from({ length: 3 }, (_, i) => ({
            id: `${p.id}-dup-${i + 1}`,
            name: `${i + 1}`,
            images: imgs.length ? [imgs[i % imgs.length]] : [],
          }));

          return { ...p, variants };
        });

        setData(productsWithThreeVariants);
        setFilter(productsWithThreeVariants);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load products", err);
        }
      } finally {
        setLoading(false);
      }
    }

    getProducts();
    return () => ac.abort();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => (
          <Card key={product.id} product={product} addProduct={addProduct} />
        ))}

      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
