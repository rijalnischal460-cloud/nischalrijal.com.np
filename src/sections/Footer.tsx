export function Footer() {
  return (
    <footer className="py-12 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Nischal Rijal. Built with passion in Kathmandu.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
