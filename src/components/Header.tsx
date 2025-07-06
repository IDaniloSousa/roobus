// src/components/Header.tsx

// Definimos as propriedades que o nosso Header pode receber.
// Isso o torna flexível para o futuro.
type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md sticky top-0 z-10">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
}