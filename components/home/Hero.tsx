import Image from "next/image";

const Hero = () => {
  return (
    <section className="hero-card-border mt-6">
      <div className="hero-card">
        <div className="flex flex-col gap-6 max-w-xl">
          <h2 className="font-bold text-xl lg:text-2xl">
            Your Ultimate E-Library: Smarter Reading, Faster Learning
          </h2>
          <p className="text-lg">Read the best books, articles, and papers.</p>

          <p></p>
        </div>

        <Image
          src="/images/hero.png"
          alt="hero"
          width={400}
          height={400}
          className=""
        />
      </div>
    </section>
  );
};

export default Hero;
