export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div
        className="
          max-w-7xl mx-auto px-6
          py-10
          flex flex-col gap-6
          md:flex-row md:items-center md:justify-between
          text-sm text-neutral-400
        "
      >
        {/* ESQUERDA */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Catálogo Premium. Todos os direitos reservados.
        </p>

        {/* DIREITA */}
        <div className="flex justify-center md:justify-end gap-6">
          <a href="#" className="hover:text-white transition">
            Termos
          </a>
          <a href="#" className="hover:text-white transition">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
