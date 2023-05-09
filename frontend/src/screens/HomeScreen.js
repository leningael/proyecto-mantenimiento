//Paul Hernandez
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { listProducts } from "../actions/productActions";
import { useLocation } from "react-router-dom";

function HomeScreen() {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const [sortBy, setSortBy] = useState("");
  let { error, loading, products, page, pages } = productList;
  const location = useLocation();
  let keyword = location.search;

  useEffect(() => {
    dispatch(listProducts(keyword, sortBy));
  }, [dispatch, keyword, sortBy]);

  return (
    //Pagina principal de el e-commerce donde se muestran todos los productos existentes, se llama a la lista de productos desde el archivo productsAction.js
    <div>
      <div className="d-flex justify-content-between">
        <h1>Productos en existencia</h1>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          defaultValue={0}
          className="h-25 align-self-center"
        >
          <option disabled value="0">
            Ordenar por...
          </option>
          <option value="createdAt">Recientes</option>
          <option value="price_asc">Precio: de menor a mayor</option>
          <option value="price_desc">Precio: de mayor a menor</option>
          <option value="name">Nombre</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
