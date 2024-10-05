import MessageList from "./MessageList";
import WelcomeScreen from "./welcome-screen";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WelcomeScreen />
    </main>
  );
}
