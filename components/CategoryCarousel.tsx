"use client";

type Props = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export default function CategoryCarousel({
  categories,
  active,
  onChange,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
      {categories.map((category) => {
        const isActive = active === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`
              whitespace-nowrap
              px-5 py-2 rounded-full
              text-sm font-semibold
              transition
              ${
                isActive
                  ? "bg-green-600 text-black"
                  : "bg-neutral-800 text-white hover:bg-neutral-700"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
