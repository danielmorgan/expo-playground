import ShopCategoryTabLayout from "@/components/ShopCategoryTabLayout";
import { countAtom } from "@/store/jotai/cartStore";
import { useAtom } from "jotai";

export default function Layout() {
  const [count] = useAtom(countAtom);

  return <ShopCategoryTabLayout cartCount={count} />;
}
