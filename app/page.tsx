export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hello`);
  const data = await res.json();
  const message = data.message;
  if (!message) return <p>Loading...</p>;

  return <div className="text-2xl font-bold">{message}</div>;
}
