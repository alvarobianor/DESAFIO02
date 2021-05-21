import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const [stock, setStock] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadStock() {
      const { data } = await api.get("/stock");

      setStock(data);
    }

    async function loadProducts() {
      const { data } = await api.get("/products");

      setProducts(data);
    }

    loadStock();
    loadProducts();
  }, []);

  const findProduct = (productId: number): Product => {
    return products.filter((product: Product) => product.id === productId)[0];
  };

  const findStock = (productId: number): Stock => {
    return stock.filter((stock: Stock) => stock.id === productId)[0];
  };

  const addProduct = async (productId: number) => {
    try {
      const idExistentProduct = cart.findIndex(
        (product: Product) => product.id === productId
      );

      if (idExistentProduct > -1) {
        const cartAux = cart;

        if (cart[idExistentProduct].amount < findStock(productId)?.amount) {
          cart[idExistentProduct].amount += 1;
          setCart([...cartAux]);
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
        } else {
          toast.error("Quantidade solicitada fora de estoque");
        }
      } else {
        const newProduct = findProduct(productId);
        newProduct.amount = 1;
        setCart([...cart, newProduct]);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
