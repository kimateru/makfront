import CarCanvas from "./Car";

const Hero = ({ scrollContainer }) => {
  return (
    <div className="w-full h-screen  z-10">
        <CarCanvas scrollContainer={scrollContainer} />
    </div>
  );
};

export default Hero;