import MessageList from "./MessageList";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MessageList />
    </main>
  );
}
