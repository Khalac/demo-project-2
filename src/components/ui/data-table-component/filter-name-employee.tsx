import { Input } from "@/components/ui";
import { Search } from "lucide-react";

const FilterNameEmployee = ({
  setSearchName,
  searchName,
}: {
  setSearchName: (name: string) => void;
  searchName: string;
}) => {
  return (
    <div className="relative w-full md:w-[180px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </span>
      <Input
        placeholder="Employee name"
        value={searchName}
        onChange={(event) => setSearchName(event.target.value)}
        className="pl-10 bg-white text-sm"
      />
    </div>
  );
};

export default FilterNameEmployee;
