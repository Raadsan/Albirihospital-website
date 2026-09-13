import { AboutBanner } from "@/components/About/AboutBanner";
import Blog from "@/components/Home/Blog";

export default function NewsPage() {
  return (
    <>
      <AboutBanner title="News & Blogs" breadcrumbPage="News" />
      <Blog />
    </>
  );
}
