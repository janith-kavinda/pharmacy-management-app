import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (medicine) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.medicine === medicine._id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.medicine === medicine._id
            ? {
                ...item,
                quantity:
                  item.quantity < item.availableQuantity
                    ? item.quantity + 1
                    : item.quantity,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          medicine: medicine._id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
          availableQuantity: medicine.quantity,
        },
      ];
    });
  };

  const increaseQuantity = (medicineId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.medicine === medicineId
          ? {
              ...item,
              quantity:
                item.quantity < item.availableQuantity
                  ? item.quantity + 1
                  : item.quantity,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (medicineId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.medicine === medicineId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.medicine !== medicineId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};