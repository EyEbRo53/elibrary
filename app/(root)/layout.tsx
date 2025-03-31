import Header from "@/components/navigation/Header";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="root-layout">
      <div className="px-2 sticky z-30">
        <Header />
      </div>
      {children}
    </div>
  );
};

export default RootLayout;
