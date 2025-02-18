import ShopCategoryTabLayout from "@/components/ShopCategoryTabLayout";
import useCartStore from "@/store/zustand/cartStore";

export default function Layout() {
  const { items } = useCartStore();

  return <ShopCategoryTabLayout cartCount={items()} />;
}
