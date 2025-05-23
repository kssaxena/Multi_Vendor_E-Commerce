import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  ProductName,
  CurrentPrice,
  Mrp,
  Rating,
  Offer,
  Description,
  Image,
  productId,
  className,
  Discount,
  Stock,
}) => {
  return (
    <Link to={`/current-product/${productId}`} className={`w-fit ${className}`}>
      <div className="whiteSoftBG shadow-md hover:shadow-lg h-auto w-72 overflow-hidden rounded-lg hover:scale-105 duration-300 ease-in-out">
        <div className="text-2xl p-2 m-2 w-64 h-52 overflow-hidden object-center flex justify-center items-center">
          <img src={Image} alt="No Image found" />
        </div>
        <div className="h-1/3 px-4 py-3 gap-2 flex flex-col">
          <h1 className="text-lg font-semibold truncate">{ProductName}</h1>
          <div className="flex w-full justify-start items-center gap-4 sm:gap-10">
            <h1 className="text-sm sm:text-xl">₹{CurrentPrice}</h1>
            <h1 className="text-sm sm:text-sm line-through text-gray-500">
              ₹{Mrp}
            </h1>
            <h1 className="text-xs sm:text-xs bg-green-500 p-1 rounded">
              {Discount}% off
            </h1>
          </div>
          <div className="flex justify-start items-center w-full gap-4 sm:gap-10 mt-2">
            {/* <p className="text-sm sm:text-base flex flex-row">Products available {Stock}</p> */}
            <p className="text-sm sm:text-base w-full truncate">
              {Description}
            </p>
            <h1 className="text-sm sm:text-base">{Rating}</h1>
            <h1 className="text-sm sm:text-base text-green-600">{Offer}</h1>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
