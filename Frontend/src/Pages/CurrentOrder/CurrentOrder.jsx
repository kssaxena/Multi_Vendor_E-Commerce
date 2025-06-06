import React, { useEffect, useState } from "react";
import LoadingUI from "../../Components/Loading";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";

const CurrentOrder = ({ startLoading, stopLoading }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  const [orderProducts, setOrderProducts] = useState();
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  const Navigate = useNavigate();

  // console.log(orderProducts);
  console.log(order);
  // console.log(shippingAddress);

  const tableHeaders = [
    "Product Name",
    "Shipping Details",
    "Phone Number",
    "Price Details",
    "Order Date",
    "Delivery Date",
    "Rating",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/admin/current-order/${orderId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setOrder(response.data.data.order);
            setOrderProducts(response.data.data.order.products);
            setShippingAddress(response.data.data.order.shippingAddress);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchOrder();
  }, [user]);

  const ProductsCard = ({
    productId,
    productName,
    sellerName,
    orderAmount,
    paymentMethod,
    images,
  }) => {
    return (
      <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-4 mb-5 mx-5">
        <div className="flex justify-between items-center w-full">
          <div className="px-5 py-2 flex flex-col justify-center items-start w-96 gap-5">
            <h1 className="text-2xl">{productName}</h1>
            <h2 className="">Seller: {sellerName}</h2>
            <h3 className="font-medium gap-10 text-xl">
              <span>₹ {orderAmount}</span>{" "}
              <span className="text-sm p-2 rounded-xl">{paymentMethod}</span>
            </h3>
          </div>
          <div className="w-48 h-48 shadow overflow-hidden flex justify-center items-center rounded-lg object-center">
            <img src={images} className="" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 py-5">
          <div className="">
            <Button label={"Raise an issue for this order"} />
          </div>
          <div className="">
            <Button label={"Download Invoice"} />
          </div>
          <div className="">
            <Button
              label={"Reorder"}
              onClick={() => {
                Navigate(`/current-product/${productId}`);
              }}
            />
          </div>
          <div className="">★★★★★</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className=" px-10 py-10 flex justify-center items-start">
        <div>
          <div className="bg-neutral-300 rounded-xl shadow-xl py-5 px-10 flex justify-start items-start flex-col mb-4 text-lg">
            <h1 className="text-lg font-semibold">Order Details</h1>
            <h1 className="font-semibold">
              Id: <span className="font-normal">{order?._id}</span>
            </h1>
            <h1 className="font-semibold">
              Payment Status:{" "}
              <span className="font-normal">{order?.paymentStatus}</span>
            </h1>
            <h1 className="font-semibold">
              Payment method:{" "}
              <span className="font-normal">{order?.paymentMethod}</span>
            </h1>
            <h1 className="font-semibold">
              Order status:{" "}
              <span className="font-normal">{order?.orderStatus}</span>
            </h1>
            <h1 className="font-semibold">
              Order date:{" "}
              <span className="font-normal">{order?.bookingDate}</span>
            </h1>
            <h1 className="font-semibold">
              Amount: <span className="font-normal">₹{order?.totalAmount}</span>
            </h1>
          </div>
          <div className="grid grid-cols-4 grid-rows-0 gap-4">
            {/* user: shipping details */}
            <div className=" shadow rounded-xl py-5 px-10 flex justify-start items-start flex-col col-span-4 font-semibold bg-neutral-300 text-lg">
              Shipping Details
              <h1 className="flex flex-col">
                <span>
                  Street :{" "}
                  <span className="font-normal">{shippingAddress.street}</span>
                </span>
                <span>
                  City:{" "}
                  <span className="font-normal">{shippingAddress.city}</span>
                </span>
                <span>
                  State:{" "}
                  <span className="font-normal">{shippingAddress.state}</span>
                </span>
                <span>
                  Postal Code:{" "}
                  <span className="font-normal">
                    {shippingAddress.postalCode}
                  </span>
                </span>
              </h1>
            </div>
            {/* user: name  */}
            <div className=" shadow rounded-xl text-xl py-5 px-10 flex justify-start items-center col-span-4  col-start-1 row-start-2 font-semibold bg-neutral-300">
              Name: <span className="font-normal ml-2">{user[0]?.name}</span>
            </div>
            {/* user: contact number */}
            <div className="shadow rounded-xl text-lg py-5 px-10 flex justify-start items-center col-span-4 row-start-4 font-semibold bg-neutral-300">
              Phone number:{" "}
              <span className="font-normal ml-2">{user[0]?.phoneNumber}</span>
            </div>

            {/* product: name */}
          </div>
        </div>
        <div className="">
          {orderProducts?.map((product, index) => (
            <ProductsCard
              key={index}
              productId={product?.product?._id}
              productName={product?.product?.name}
              sellerName={product?.seller?.name}
              orderAmount={product?.price?.MRP}
              paymentMethod={order?.paymentMethod}
              images={product?.product?.images[0]?.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentOrder);
