import Image from "next/image";

const Hero = () => {
  return (
    <section className="hero-card-border mt-6">
      <div className="hero-card">
        <div className="flex flex-col gap-6 max-w-xl">
          <h2 className="font-bold text-4xl">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

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
