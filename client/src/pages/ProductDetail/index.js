import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { toast } from "react-toastify";

import DetailedBookInfo from "../../components/Shop/DetailedBookInfo";
import Loading from "../../components/Loading";

import { useNavigate, useParams } from "react-router-dom";
import bookApi from "../../api/bookApi";
import userApi from "../../api/userApi";
import { addToCart } from "../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import format from "../../helper/format";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const cartData = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.auth);

  const [bookData, setBookData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addToCart = async () => {
      try {
        const { list } = cartData;
        const newList = list.map((item) => {
          return { product: item.product._id, quantity: item.quantity };
        });
        await userApi.updateCart(currentUser.userId, { cart: newList });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser && currentUser.userId) {
      addToCart();
    }
  }, [cartData, currentUser]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await bookApi.getBySlug(slug);
        setLoading(false);
        setBookData(res.data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchBook();
  }, [slug]);

  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);

  const decQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incQuantity = () => {
    setQuantity(parseInt(quantity + 1));
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    // /^[0-9]+$/.test(newQuantity)
    //sai khi them chu
    const newQuantity = parseInt(e.target.value);
    if (newQuantity) {
      setQuantity(newQuantity);
    } else {
      setQuantity("");
    }
  };

  const handleFav = () => {
    setFav(!fav);
  };

  const handleAddToCart = () => {
    if (currentUser && currentUser.userId) {
      const {
        _id: productId,
        name,
        imageUrl,
        slug,
        price,
        discount,
      } = bookData;
      let newPrice = price;
      if (discount > 0) {
        newPrice = price - (price * discount) / 100;
      }
      const action = addToCart({
        quantity,
        productId,
        name,
        imageUrl,
        slug,
        price: newPrice,
        totalPriceItem: newPrice * quantity,
      });
      dispatch(action);
      toast.success("Product added to cart successfully!", { autoClose: 2000 });
    } else {
      toast.info("Please login to do this!", { autoClose: 2000 });
    }
  };

  const handleBuyNow = () => {
    if (currentUser && currentUser.userId) {
      const {
        _id: productId,
        name,
        imageUrl,
        slug,
        price,
        discount,
      } = bookData;
      let newPrice = price;
      if (discount > 0) {
        newPrice = price - (price * discount) / 100;
      }
      const action = addToCart({
        quantity,
        productId,
        name,
        imageUrl,
        slug,
        price: newPrice,
        totalPriceItem: newPrice * quantity,
      });
      dispatch(action);
      navigate({ pathname: "/gio-hang" });
    } else {
      toast.info("Please login to do this!", { autoClose: 2000 });
    }
  };

  return (
    <div className="pt-20 px-20 h-screen">
      <Container>
        {!loading ? (
          <Row className={styles.productBriefing}>
            <Col xl={4} xs={12}>
              <div className={styles.imgBriefing}>
                <img src={bookData && bookData.imageUrl} alt="" />
              </div>
            </Col>

            <Col xl={8}>
              <div className={styles.infoBriefing}>
                <div>
                  <h2>{bookData && bookData.name}</h2>
                  <div className={styles.price}>
                    {bookData.discount > 0 ? (
                      <p>
                        <span>
                          {format.formatPrice(
                            bookData.price -
                              (bookData.price * bookData.discount) / 100
                          )}
                        </span>
                        <span className={styles.oldPrice}>
                          {format.formatPrice(bookData.price)}
                        </span>
                      </p>
                    ) : (
                      format.formatPrice(bookData.price)
                    )}
                  </div>
                  <div className={`d-flex ${styles.itemBriefing}`}>
                    <div>Author: &nbsp;</div>
                    <div className={styles.author}>
                      {bookData && format.arrayToString(bookData?.author || [])}
                    </div>
                  </div>

                  {/* <div className={`d-flex ${styles.itemBriefing}`}>
                    <div>Publishing company: &nbsp;</div>
                    <div className={styles.author}>
                      {bookData && bookData.publisher?.name} - {bookData && bookData.year} 
                    </div>
                  </div> */}

                  <div
                    className={`d-flex ${styles.itemBriefing} ${styles.description}`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: bookData?.description,
                      }}
                    />
                  </div>

                  <div className={`d-flex ${styles.itemBriefing}`}>
                    <div className={styles.textBold}>Number: </div>
                    <div className="d-flex">
                      <button
                        className={styles.descreaseBtn}
                        onClick={decQuantity}
                      >
                        <AiOutlineMinus />
                      </button>
                      <input
                        type="text"
                        className={styles.quantityInput}
                        value={quantity}
                        onChange={handleChange}
                      />
                      <button
                        className={styles.increaseBtn}
                        onClick={incQuantity}
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.fav_btn} onClick={handleFav}>
                      {fav ? (
                        <AiFillHeart className={styles.fav_icon} />
                      ) : (
                        <AiOutlineHeart className={styles.fav_icon} />
                      )}
                      Like
                    </button>

                    <div className={styles.actions_bottom}>
                      <button
                        className={styles.addToCartBtn}
                        onClick={handleAddToCart}
                      >
                        <AiOutlineShoppingCart
                          className={styles.addToCartIcon}
                        />
                        Add to cart
                      </button>
                      <button className={styles.buyBtn} onClick={handleBuyNow}>
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <DetailedBookInfo data={bookData} />
          </Row>
        ) : (
          <Loading />
        )}
      </Container>
    </div>
  );
}
