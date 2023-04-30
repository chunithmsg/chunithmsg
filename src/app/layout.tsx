import CApp from "../components/CApp";

export const metadata = {
  title: "Chunithm Singapore Tournament 2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ marginLeft: "calc(100vw - 100%)", marginRight: "0" }}
    >
      <body style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <CApp>{children}</CApp>
      </body>
    </html>
  );
}
