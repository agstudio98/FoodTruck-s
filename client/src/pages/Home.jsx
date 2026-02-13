import Hero from '../components/Home/Hero.jsx';
import ExperienceBanner from '../components/Home/Banner.jsx';
import Categories from '../components/Home/Categories.jsx';
import Showcase from '../components/Home/Showcase.jsx';

export default function Home() {
  return (
    <div>
      <Hero />
      <ExperienceBanner />
      <Categories />
      <Showcase />
    </div>
  );
}