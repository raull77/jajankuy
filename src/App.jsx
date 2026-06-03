import { useEffect } from "react";

import { supabase }
    from "./lib/supabase";
import { useState } from "react";
import seblakImg from "./assets/seblak.jpg";
import martabakImg from "./assets/martabak.jpg";
import popiceImg from "./assets/popice.jpg";
import telurgulungImg from "./assets/telurgulung.jpg";
import maklorImg from "./assets/maklor.jpg";
import tempuraImg from "./assets/tempura.jpg";
import telatelaImg from "./assets/telatela.jpg";
import kebabImg from "./assets/kebab.jpg";
import telurminiImg from "./assets/telurmini.jpg";


function App() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] =
  useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const [search, setSearch] = useState("");

  const [selectedOptions, setSelectedOptions] =
    useState({});
  const [dbProducts, setDbProducts] =
    useState([]);
    useEffect(() => {

    getProducts();

}, []);

async function getProducts() {

  const { data, error } =
    await supabase
      .from("products")
      .select("*");

  if (error) {

    console.error(
      "Supabase Error:",
      error
    );

    return;

  }

  console.log(
    "Data Products:",
    data
  );

  setDbProducts(data);

}

  const products = [
    {
      id: 1,
      name: "Seblak",
      price: 15000,
      image: seblakImg,
      status: "ready",
      category: "Makanan",
      options: [
        "Tidak Pedas",
        "Sedang",
        "Pedas",
      ],
    },

    {
      id: 2,
      name: "Martabak",
      price: 7000,
      image: martabakImg,
      status: "sold",
      category: "Makanan",
      options: [
        "Coklat",
        "Keju",
        "Coklat Keju",
      ],
    },

    {
      id: 3,
      name: "Pop Ice",
      price: 3000,
      image: popiceImg,
      status: "ready",
      category: "Minuman",
      options: [
        "Coklat",
        "Taro",
        "Strawberry",
        "Vanilla Blue",
      ],
    },

    {
      id: 4,
      name: "Telur Gulung",
      price: 1000,
      image: telurgulungImg,
      status: "ready",
      category: "Makanan",
      options: [
        "Original",
        "Pedas",
      ],
    },

    {
      id: 5,
      name: "Maklor",
      price: 5000,
      image: maklorImg,
      status: "ready",
      category: "Makanan",
      options: [
        "Sedang",
        "Pedas",
      ],
    },

    {
      id: 6,
      name: "Tempura",
      price: 5000,
      image: tempuraImg,
      status: "sold",
      category: "Makanan",
      options: [
        "Original",
        "Pedas",
      ],
    },

    {
      id: 7,
      name: "Tela Tela",
      price: 5000,
      image: telatelaImg,
      status: "ready",
      category: "Makanan",
      options: [
        "BBQ",
        "Balado",
        "Jagung Manis",
        "Keju",
      ],
    },

    {
      id: 8,
      name: "Kebab",
      price: 6000,
      image: kebabImg,
      status: "sold",
      category: "Makanan",
      options: [
        "Original",
        "Pedas",
        "Extra Saus",
      ],
    },

    {
      id: 9,
      name: "Telur Mini",
      price: 5000,
      image: telurminiImg,
      status: "ready",
      category: "Makanan",
      options: [
        "Original",
        "Pedas",
      ],
    },
  ];
  const imageMap = {

    Seblak: seblakImg,

    Martabak: martabakImg,

    "Pop Ice": popiceImg,

    "Telur Gulung": telurgulungImg,

    Maklor: maklorImg,

    Tempura: tempuraImg,

    "Tela Tela": telatelaImg,

    Kebab: kebabImg,

    "Telur Mini": telurminiImg,

  };
 const activeProducts =
  dbProducts.length > 0
    ? dbProducts.map((item) => {

        const localProduct =
          products.find(
            (p) => p.name === item.name
          );

        return {

          ...item,

          image:
            imageMap[item.name],

          options:
            localProduct?.options || [],

        };

      })
    : products;

const filteredProducts =
  activeProducts.filter((item) => {

    const categoryMatch =
      selectedCategory === "Semua" ||
      item.category === selectedCategory;

    const searchMatch =
      item.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    return (
      categoryMatch &&
      searchMatch
    );

  });

  const addToCart = (product) => {
    const cartId =
      product.id +
      "-" +
      product.selectedOption;

    const existingItem = cart.find(
      (item) =>
        item.cartId === cartId
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
          cartId,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.cartId === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.cartId === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.qty > 0
        )
    );
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      item.price * item.qty,
    0
  );

  const estimatedTime =
    cart.length === 0
      ? 0
      : 15 +
        (cart.length - 1) * 5;

  const checkoutWhatsApp = async () => {

  if (
    customerName.trim() === ""
  ) {

    alert(
      "Masukkan Nama Pemesan"
    );

    return;

  }

    if (cart.length === 0) {

        alert("Keranjang kosong");

        return;

    }

    const message = cart
        .map(
            (item) =>
                `- ${item.name}
Varian : ${item.selectedOption}
Qty : ${item.qty}`
        )
        .join("\n\n");

    const text =
      `Halo Kak 👋

      Atas Nama:
      ${customerName}

      Pesanan:

      ${message}

      ⏱️ Estimasi:
      ${estimatedTime} menit

      💰 Total:
      Rp${totalPrice.toLocaleString()}

      📍 Saya akan ambil langsung ke warung.

      Terima kasih 🙏`;

    const {
        data: orderData,
        error: orderError,
    } = await supabase
        .from("orders")
        .insert([
            {
                customer_name:
                  customerName,
                  total_price: totalPrice,
                  total_items: cart.length,
            },
        ])
        .select();

    if (orderError) {

        console.error(orderError);

        alert(
            "Gagal menyimpan pesanan"
        );

        return;

    }

    const orderId =
        orderData[0].id;

    const orderItems =
        cart.map((item) => ({

            order_id:
                orderId,

            product_name:
                item.name,

            quantity:
                item.qty,

            price:
                item.price,

            option_selected:
                item.selectedOption,

        }));

    const {
        error: itemError,
    } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemError) {

        console.error(itemError);

        alert(
            "Gagal menyimpan detail pesanan"
        );

        return;

    }

    const groupedProducts = {};

cart.forEach((item) => {

    if (!groupedProducts[item.name]) {

        groupedProducts[item.name] = 0;

    }

    groupedProducts[item.name] += item.qty;

});

for (const productName in groupedProducts) {

    const product =
        dbProducts.find(
            (p) =>
                p.name === productName
        );

    if (!product) continue;

    const totalQty =
        groupedProducts[productName];

    const newStock =
        product.stock - totalQty;

    await supabase
        .from("products")
        .update({

            stock:
                newStock,

            status:
                newStock <= 0
                    ? "sold"
                    : "ready",

        })
        .eq(
            "id",
            product.id
        );

}

    await getProducts();

    window.open(
        `https://wa.me/62895383006093?text=${encodeURIComponent(
            text
        )}`,
        "_blank"
    );

};

  return (
    <div className="bg-orange-50 min-h-screen">

      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        <h1 className="text-3xl font-bold text-orange-500">
          JajanKuy <i class="bi bi-emoji-laughing"></i>
        </h1>

        <div className="relative">
        {/* KERANJANG */}
          <span className="text-3xl">
            
          </span>

          {cart.length > 0 && (

            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">

              {cart.length}

            </span>

          )}

        </div>

      </nav>

      <section className="text-center py-10 px-6">

        <h2 className="text-4xl md:text-6xl font-bold">

          Jajanan Favorit
          <br />
          Anak Sekolah & Mahasiswa

        </h2>

        <p className="mt-5 text-gray-600">
          Pesan lebih mudah tanpa
          takut salah pesan
        </p>

      </section>

      <section
        id="menu"
        className="px-6 pb-10"
      >

       <h3
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: "700",
            marginTop: "20px",
            marginBottom: "20px",
          }} >
          <i className="bi bi-stars"></i> 
          Menu Favorit
        </h3>

        <div className="flex justify-center gap-4 mb-8">

          <button
            onClick={() =>
              setSelectedCategory(
                "Semua"
              )
            }
            className="bg-orange-500 text-white px-4 py-2 rounded-full"
          >
            Semua
          </button>

          <button
            onClick={() =>
              setSelectedCategory(
                "Makanan"
              )
            }
            className="bg-white px-4 py-2 rounded-full"
          >
            Makanan
          </button>

          <button
            onClick={() =>
              setSelectedCategory(
                "Minuman"
              )
            }
            className="bg-white px-4 py-2 rounded-full"
          >
            Minuman
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {filteredProducts.map(
            (product) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between">

                    <h4 className="font-bold">
                      {product.name}
                    </h4>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.status === "ready"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {product.status}
                    </span>

                  </div>

                  <p className="text-orange-500 text-2xl font-bold mt-4">
                    Rp{product.price.toLocaleString()}
                  </p>

                  <select
                    className="w-full border rounded-lg p-2 mt-4"
                    onChange={(e) =>
                      setSelectedOptions({

                        ...selectedOptions,

                        [product.id]:
                          e.target.value

                      })
                    }
                  >
                    <option>
                      Pilih Varian
                    </option>

                    {product.options.map(
                      (option,index)=>(
                        <option
                          key={index}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    disabled={
                      product.status !== "ready"
                    }
                    onClick={() =>
                      addToCart({
                        ...product,
                        selectedOption:
                          selectedOptions[
                            product.id
                          ] ||
                          product.options[0]
                      })
                    }
                    className="w-full bg-orange-500 text-white py-3 rounded-xl mt-4"
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    Pesan
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-3xl p-6 shadow-lg mb-20">

        <h2 className="text-3xl font-bold mb-8">
          Keranjang <i className="bi bi-cart3"></i>
        </h2>

        {cart.length === 0 ? (

          <div className="text-center py-10">

          <div className="text-6xl">
            <i class="bi bi-cart-plus"></i>
          </div>

          <h3 className="font-bold text-xl mt-4">

            Keranjang Masih Kosong

          </h3>

          <p className="text-gray-500">

            Silakan pilih menu favoritmu

          </p>

        </div>

        ) : (

          <>
            <div className="space-y-5">

              {cart.map(
                (item) => (

                  <div
                    key={item.cartId}
                    className="flex justify-between border-b pb-5"
                  >

                    <div>

                      <h4 className="font-semibold text-lg">

                        {item.name}

                      </h4>

                      <p className="text-sm text-gray-500">

                        {item.selectedOption}

                      </p>

                      <div className="flex gap-2 mt-3">

                        <button
                          onClick={() =>
                            decreaseQty(item.cartId)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 transition"
                        >
                          -
                        </button>

                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.cartId)
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <h4 className="text-orange-500 font-bold text-xl">

                      Rp{(
                        item.price *
                        item.qty
                      ).toLocaleString()}

                    </h4>

                  </div>

                )
              )}

            </div>
            <div className="mt-6">

              <label className="font-semibold">
                Nama Pemesan
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Masukkan nama"
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>
            <div className="flex justify-between mt-8">

              <div>

                <p className="text-gray-500">
                  Estimasi
                </p>

                <h4 className="font-bold text-xl">

                  {estimatedTime} Menit

                </h4>

              </div>

              <div className="text-right">

                <p className="text-gray-500">
                  Total
                </p>

                <h3 className="text-4xl text-orange-500 font-bold">

                  Rp{totalPrice.toLocaleString()}

                </h3>

              </div>

            </div>

           <button
              onClick={checkoutWhatsApp}
              className="w-full mt-8 bg-green-500 text-white py-4 rounded-2xl font-bold"
              style={{
                cursor: "pointer",
              }}>
              Checkout WhatsApp
          </button>

          </>
        )}

      </section>

      <footer className="bg-white mt-10 p-8 text-center shadow-inner">

      <h2 className="text-2xl font-bold text-orange-500">

        <i className="bi bi-shop"></i> JajanKuy

      </h2>

      <p className="mt-3 text-gray-600">

        UMKM jajanan favorit anak sekolah & mahasiswa

      </p>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
        <p>
          <i
           class="bi bi-geo-fill"
            style={{
              marginRight: "10px",
              color: "#ff6b00",
            }}
          ></i>
          Gombel Lama, Semarang
        </p>

        <p>
          <i
            className="bi bi-telephone-fill"
            style={{
              marginRight: "10px",
              color: "#ff6b00",
            }}
          ></i>
          0895383006093
        </p>

        <p>
          <i
            className="bi bi-clock-fill"
            style={{
              marginRight: "10px",
              color: "#ff6b00",
            }}
          ></i>
          08.00 - 18.00
        </p>
      </div>

    </footer>

    </div>
    
  );
}

export default App;