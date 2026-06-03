import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

function Admin() {

    const navigate =
        useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [newProduct, setNewProduct] =
        useState({
            name: "",
            price: "",
            stock: "",
            category: "Makanan",
        });

    const [editPrice, setEditPrice] =
        useState({});

    const [editStock, setEditStock] =
        useState({});

    useEffect(() => {

        checkAuth();

    }, []);

    async function checkAuth() {

        const {
            data: { session },
        } =
            await supabase.auth.getSession();

        if (!session) {

            navigate("/login");

            return;

        }

        loadData();

    }

    async function addProduct() {

        const { error } =
            await supabase
                .from("products")
                .insert([
                    {
                        name:
                            newProduct.name,

                        price:
                            Number(
                                newProduct.price
                            ),

                        stock:
                            Number(
                                newProduct.stock
                            ),

                        category:
                            newProduct.category,

                        status:
                            Number(
                                newProduct.stock
                            ) > 0
                                ? "ready"
                                : "sold",
                    },
                ]);

        if (error) {

            alert(
                "Gagal tambah produk"
            );

            return;

        }

        alert(
            "Produk berhasil ditambah"
        );

        setNewProduct({
            name: "",
            price: "",
            stock: "",
            category: "Makanan",
        });

        loadData();

    }

    async function updateProduct(
        id,
        price,
        stock
    ) {

        const status =
            stock <= 0
                ? "sold"
                : "ready";

        const { error } =
            await supabase
                .from("products")
                .update({
                    price,
                    stock,
                    status,
                })
                .eq("id", id);

        if (error) {

            console.error(error);

            alert(
                "Gagal update produk"
            );

            return;

        }

        alert(
            "Produk berhasil diupdate"
        );

        loadData();

    }

    async function deleteProduct(
        id
    ) {

        const confirmDelete =
            window.confirm(
                "Yakin ingin menghapus produk?"
            );

        if (!confirmDelete)
            return;

        const { error } =
            await supabase
                .from("products")
                .delete()
                .eq("id", id);

        if (error) {

            console.error(error);

            alert(
                "Gagal menghapus produk"
            );

            return;

        }

        alert(
            "Produk berhasil dihapus"
        );

        loadData();

    }

    async function loadData() {
        const { data: ordersData, error: ordersError } =
            await supabase
                .from("orders")
                .select(`
                    *,
                    order_items (
                        product_name,
                        quantity,
                        option_selected
                    )
                `)
                .order("created_at", {
                    ascending: false,
                });

        const { data: productsData, error: productsError } =
            await supabase
                .from("products")
                .select("*");

        if (ordersError) {
            console.error(ordersError);
        }

        if (productsError) {
            console.error(productsError);
        }

        setOrders(ordersData || []);
        setProducts(productsData || []);
    }

    const totalRevenue = orders.reduce(
        (total, order) =>
            total + order.total_price,
        0
    );

    const soldOutProducts = products.filter(
        (product) =>
            product.stock <= 0
    ).length;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f1e8",
                padding: "30px",
            }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <i
                        class="bi bi-person-gear"
                        style={{
                            fontSize: "28px",

                        }}
                    ></i>

                    <h1
                        style={{
                            margin: 0,
                        }}
                    >
                        JajanKuy Admin
                    </h1>
                </div>

                <button
                    onClick={async () => {

                        await supabase.auth.signOut();

                        navigate("/login");

                    }}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#ff6b00",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    {" "}
                    Logout
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                <div className="card-admin">
                    <h3><i className="bi bi-box-seam"></i>{" "}
                        Total Pesanan
                    </h3>
                    <h2>{orders.length}</h2>
                </div>

                <div className="card-admin">
                    <h3><i class="bi bi-cash-coin"></i>{" "}
                        Pendapatan
                    </h3>
                    <h2>
                        Rp
                        {totalRevenue.toLocaleString()}
                    </h2>
                </div>

                <div className="card-admin">
                    <h3><i class="bi bi-clipboard2-data"></i>{" "}
                        Total Produk
                    </h3>
                    <h2>{products.length}</h2>
                </div>

                <div className="card-admin">
                    <h3><i class="bi bi-clipboard2-x"></i>{" "}
                        Produk Habis
                    </h3>
                    <h2>{soldOutProducts}</h2>
                </div>
            </div>

            {/* RIWAYAT PESANAN */}

            <div
                style={{
                    marginTop: "50px",
                }}
            >
                <h2
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    <i class="bi bi-journals"></i>
                    Riwayat Pesanan
                </h2>

                {orders.length === 0 ? (

                    <div className="card-admin">
                        Belum ada pesanan
                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(320px,1fr))",
                            gap: "20px",
                        }}
                    >
                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="card-admin"
                                style={{
                                    padding: "20px",
                                }}>
                                <h3
                                    style={{
                                        marginBottom: "15px",
                                    }}>
                                    <i class="bi bi-journal-arrow-down"></i>
                                    Order #{order.id}
                                </h3>

                                <p
                                    style={{
                                        marginBottom: "10px",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}>
                                    <i class="bi bi-person-down"></i>
                                </p>

                                <div
                                    style={{
                                        marginTop: "15px",
                                        lineHeight: "1.8",
                                    }}>

                                    {order.order_items?.map(
                                        (item, index) => (

                                            <p key={index}>
                                                <i class="bi bi-fork-knife"></i>
                                                {" ("}
                                                {item.option_selected}
                                                {") "}
                                                x{item.quantity}
                                            </p>

                                        )
                                    )}

                                    <p
                                        style={{
                                            marginTop: "10px",
                                            fontWeight: "bold",
                                        }}>
                                        <i class="bi bi-currency-dollar"></i>
                                        {order.total_price.toLocaleString()}
                                    </p>

                                    <p>
                                        <i class="bi bi-clock-history"></i>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>

                                </div>
                            </div>

                        ))}
                    </div>

                )}
            </div>

            {/* DATA PRODUK */}

            <div
                style={{
                    marginTop: "40px",
                }}>

                <div
                    className="card-admin"
                    style={{
                        marginBottom: "20px",
                    }}
                >

                    <h3 style={{ marginBottom: "20px" }}>
                        <i class="bi bi-clipboard2-plus"></i>
                        Tambah Produk
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(200px,1fr))",
                            gap: "15px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Nama Produk"
                            value={newProduct.name}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    name: e.target.value,
                                })
                            }
                            className="form-control border border-2 border-dark"
                        />

                        <input
                            type="number"
                            placeholder="Harga"
                            value={newProduct.price}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    price: e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Stok"
                            value={newProduct.stock}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    stock: e.target.value,
                                })
                            }
                        />

                        <select
                            value={newProduct.category}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option>Makanan</option>
                            <option>Minuman</option>
                        </select>
                    </div>

                    <button
                        onClick={addProduct}
                        style={{
                            marginTop: "20px",
                            padding: "12px 20px",
                            background: "#ff6b00",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        <i class="bi bi-send-check-fill"></i>
                        Tambah Produk
                    </button>

                </div>
                <h2>
                    <i class="bi bi-clipboard2-data"></i>
                    Data Produk
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(350px,1fr))",
                        gap: "20px",
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="card-admin"
                        >
                            <h3>
                                <i class="bi bi-fork-knife"></i>
                                {product.name}
                            </h3>

                            <div
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                <label>
                                    Harga
                                </label>

                                <input
                                    type="number"
                                    value={
                                        editPrice[
                                        product.id
                                        ] ??
                                        product.price
                                    }
                                    onChange={(e) =>
                                        setEditPrice({
                                            ...editPrice,
                                            [product.id]:
                                                Number(
                                                    e.target.value
                                                ),
                                        })
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "5px",
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                <label>
                                    Stok
                                </label>

                                <input
                                    type="number"
                                    value={
                                        editStock[
                                        product.id
                                        ] ??
                                        product.stock
                                    }
                                    onChange={(e) =>
                                        setEditStock({
                                            ...editStock,
                                            [product.id]:
                                                Number(
                                                    e.target.value
                                                ),
                                        })
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "5px",
                                    }}
                                />
                            </div>

                            <p
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                Status:
                                <b>
                                    {" "}
                                    {product.status}
                                </b>
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        updateProduct(
                                            product.id,
                                            editPrice[
                                            product.id
                                            ] ??
                                            product.price,
                                            editStock[
                                            product.id
                                            ] ??
                                            product.stock
                                        )
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background:
                                            "#22c55e",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i class="bi bi-box-arrow-right"></i>
                                    Simpan
                                </button>

                                <button
                                    onClick={() =>
                                        deleteProduct(
                                            product.id
                                        )
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background:
                                            "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i class="bi bi-trash"></i>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Admin;