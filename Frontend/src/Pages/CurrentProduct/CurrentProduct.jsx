import React, { useLayoutEffect } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Button from "../../Components/Button";
import ProductCard from "../../Components/ProductCard";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import LoadingUI from "../../Components/Loading";
import PopUp from "../../Components/PopUpWrapper";
import { addCart } from "../../Utility/Slice/CartSlice";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";
import Policies from "./policies";

const CurrentProduct = ({ startLoading, stopLoading }) => {
  const [isReadMoreDescription, setIsReadMoreDescription] = useState(false);
  const [isReadMoreSpecification, setIsReadMoreSpecification] = useState(false);
  const maxLength = 100;
  const toggleReadMore = () => {
    setIsReadMoreDescription(!isReadMoreDescription);
  };
  const toggleReadMoreSpecification = () => {
    setIsReadMoreSpecification(!isReadMoreSpecification);
  };
  const user = useSelector((store) => store.UserInfo.user);
  const isProductAvailableForUser = useSelector(
    (store) => store.UserInfo.isProductAvailableForUser
  );
  console.log(isProductAvailableForUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { productId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [imgPopup, setImgPopup] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [products, setProducts] = useState(null);
  const [AllProducts, setAllProducts] = useState();
  const [specifications, setSpecifications] = useState("");
  const [productPolicy, setProductPolicy] = useState([]);

  const productRef = useRef(null);
  // console.log(user[0]?._id);

  // Utility functions
  const HandleBuyNow = async () => {
    if (user.length > 0) {
      try {
        startLoading();

        // Ensure all required fields are included
        const response = await FetchData(`orders/create-order`, "post", {
          userId: user[0]._id,
          products: [
            { product: productId, quantity: 1, price: products?.price },
          ],
          // shippingAddress: addresses[selectedAddress],
          totalAmount: products?.price.sellingPrice,
        });
        // console.log(response);

        if (response.data.success) {
          // alert("Order placed successfully!");
          navigate(`/checkout/${productId}/${response.data.data._id}`);
        }
      } catch (err) {
        // console.log(err);
        alert(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    } else {
      alert("Please Login first!");
    }
  };

  // Fetching the current product
  useEffect(() => {
    async function getCurrentProduct(productId) {
      startLoading();
      const Product = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      // console.log(Product);
      setProducts(Product?.data?.data);
      setSpecifications(Product?.data?.data?.specifications);
      stopLoading();
      return Product;
    }

    setTimeout(() => {
      productRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    getCurrentProduct(productId);
  }, [productId]);

  // Fetching policies for this product.
  useEffect(() => {
    if (!products) return;

    async function fetchProductPolicy() {
      try {
        startLoading();
        const response = await FetchData(`policies/policy-by-category`, "get", {
          categoryId: products.category._id,
          subcategoryId: products.subcategory._id,
          brandId: products.brand._id,
          productId,
        });
        console.log(response.data.data);
        setProductPolicy(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    }

    fetchProductPolicy();
  }, [products]);

  // Fetching all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-products", "get");
        // console.log(response);
        setAllProducts(response.data.data.products);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchProducts();
  }, []);

  const addProductToCart = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${user?.[0]?._id}/${products?._id}/cart/add`,
        "post"
      );
      // console.log(response);

      alert(response.data.message);
      // console.log(products);
      dispatch(addCart(products));
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Please Login first!, Failed to add product to cart."
      );
    } finally {
      stopLoading();
    }
  };

  const addProductToWishlist = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${user?.[0]?._id}/${products?._id}/wishlist/add`,
        "post"
      );
      // console.log(response);
      alert(response.data.message);
    } catch (err) {
      // console.log(err);
      // alert(
      //   err.response?.data?.message ||
      //     "Please Login first! , Failed to add product to Wishlist."
      // );
      if (user.length > 0) {
        alert(err.response?.data?.message || "Internal Server Error");
      }
      if (user.length === 0) {
        alert(
          err.response?.data?.message ||
            "Please Login first! , Failed to add product to Wishlist."
        );
      }
    } finally {
      stopLoading();
    }
  };

  const sliderRef = useRef(null);

  // Function to scroll the products left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll the products right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col lg:flex-row justify-between items-start p-4">
        <section
          ref={productRef}
          className="ImageSection w-full lg:w-[40vw] lg:h-[70vh]"
        >
          <div className="flex flex-col-reverse lg:flex-row h-5/6 lg:mb-10 ">
            {/* Image Array */}
            <div className="lg:w-20 lg:h-full  ">
              <div className="overflow-x-auto flex flex-col justify-center items-center mt-2  gap-2">
                {products?.images.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => setCurrentImg(index)}
                    src={image.url}
                    alt={products?.name}
                    className="h-20 w-20 cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Current Image */}
            <div className="relative h-full w-[40vw] p-3 m-2 ">
              <img
                src={products?.images[currentImg]?.url}
                alt={products?.name}
                className="h-full"
                onClick={() => setImgPopup(true)}
              />
              <div className="absolute top-0 right-0">
                <Button
                  label={<Heart className=" overflow-hidden" />}
                  className={`hover:bg-white hover:text-red-500 rounded-full`}
                  onClick={addProductToWishlist}
                />
              </div>
            </div>
          </div>
          {isProductAvailableForUser === true ? (
            <div className="flex gap-10 lg:gap-52 justify-center items-center lg:ml-20 ">
              <Button
                label={"Buy Now"}
                className={
                  "bg-[#ff741b]  hover:bg-[#ff924e] text-white w-36 h-12"
                }
                onClick={HandleBuyNow}
              />
              <Button
                label={"Add to Cart"}
                className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-white w-36 h-12`}
                onClick={addProductToCart}
              />
            </div>
          ) : (
            <div className="flex gap-10 lg:gap-52 justify-center items-center lg:ml-20 bg-[#DF3F33] text-white p-4 rounded-lg">
              This product is not available for your location
            </div>
          )}

          {imgPopup && (
            <PopUp onClose={() => setImgPopup(false)}>
              <div>
                <img
                  src={products?.images[currentImg]?.url}
                  alt=""
                  className="h-[80vh]"
                />
              </div>
            </PopUp>
          )}

          {/* Buttons */}
          {/* <div className="flex  justify-evenly items-center h-1/6  ">
            <Button
              label={"Buy Now"}
              className={
                "bg-[#ff741b]  hover:bg-[#ff924e] text-white w-36 h-12"
              }
              onClick={HandleBuyNow}
            />
            <Button
              label={"Add to Cart"}
              className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-white w-36 h-12`}
              onClick={addProductToCart}
            />
          </div> */}
        </section>
        <div className="flex-1 px-4 py-10">
          <h3 className="text-2xl font-semibold mb-2">{products?.name}</h3>
          {/* <p className="text-gray-600 mb-4">{products?.description}</p> */}

          <div className="flex items-center mt-4 mb-4">
            <span className="text-lg font-semibold mr-2">4.3</span>
            <span className="text-gray-500">4,486 Ratings & 494 Reviews</span>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold mr-4">
              ₹ {products?.price.sellingPrice}
            </span>
            <span className="text-gray-500 line-through mr-4">
              ₹{products?.price.MRP}
            </span>
            {products?.price.discount > 0 && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-sm">
                {products?.price.discount}% off
              </span>
            )}
          </div>
          <h4 className="text-lg font-semibold mb-2">Available offers</h4>
          <ul className="list-disc list-inside">
            <li>
              Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
              T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,000 on HDFC Bank Pixel Credit Card EMI
              on 3 months tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,500 on HDFC Bank Pixel Credit Card EMI
              on 6m and 9m tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Special Price Get extra 20% off (price inclusive of
              cashback/coupon) T&C
            </li>
          </ul>

          <div className="mt-5">
            <div>
              <h1 className="font-semibold">Product Description</h1>
              <span>
                <p className="text-gray-600">
                  {isReadMoreDescription
                    ? products?.description
                    : `${products?.description.substring(0, maxLength)}...`}
                </p>
                {products?.description.length > maxLength && (
                  <button className="text-blue-500" onClick={toggleReadMore}>
                    {isReadMoreDescription ? "Read Less.." : "Read More..."}
                  </button>
                )}
              </span>
            </div>

            <div>
              <h1 className="font-semibold">Product Specifications</h1>
              <span>
                <p className="text-gray-600">
                  {isReadMoreSpecification
                    ? specifications?.details
                    : `${specifications?.details?.substring(0, maxLength)}...`}
                </p>
                {specifications?.details?.length > maxLength && (
                  <button
                    className="text-blue-500"
                    onClick={toggleReadMoreSpecification}
                  >
                    {isReadMoreSpecification ? "Read Less.." : "Read More..."}
                  </button>
                )}
              </span>
            </div>
            <div>
              {/* <h1 className='font-semibold'>Product Policies</h1> */}
              <ul>
                <Policies
                  categorizedPolicies={productPolicy.categorizedPolicies}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h1 className="text-2xl font-semibold mb-2 ml-10">
          People Also visited
        </h1>
      </section>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          ←
        </button>

        <div
          className="flex overflow-x-scroll no-scrollbar justify-start items-center gap-6 py-10 px-10"
          ref={sliderRef}
        >
          {AllProducts?.map((product, index) => (
            <ProductCard
              Image={product?.images[0]?.url}
              key={product._id}
              ProductName={product.name}
              CurrentPrice={product.price.sellingPrice}
              Mrp={product.price.MRP}
              Rating={product.Rating}
              Offer={product.off}
              Description={product.description}
              productId={product._id}
              Discount={product.price.discount}
              Stock={product.stockQuantity}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentProduct);
