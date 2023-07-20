"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { categoryFilters } from "@/constants";

const Categories = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const category = searchParams.get('category');

    const handleTags = (filter: string) => {
        router.push(`${pathName}?category=${filter}`);
    };

  return (
    <div className="flexBetween w-full gap-5 flex-wrap">
        <ul className="flex gap-2 overflow-auto hover:overflow-scroll">
            {categoryFilters.map((filter) => (
                <button
                    key={filter}
                    type="button"
                    onClick={() => handleTags(filter)}
                    className={`${category === filter ? 'bg-violet-700 font-medium text-white' : 'font-normal bg-light-white-300'} px-4 py-3 rounded-lg capitalize whitespace-nowrap`}
                >
                    {filter}
                </button>
            ))}
        </ul>
    </div>
  )
}

export default Categories