import { IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";

export default function Organizations() {

    return (
        <>
            <div className="flex mx-56 h-auto">
                <section className="flex flex-col mt-10 gap-y-10">
                    <h1 className="text-3xl font-medium">
                        Your Organizations
                    </h1>
                    <div className="flex items-center justify-center gap-x-4 ">
                        <Button>
                            New Organization
                        </Button>
                        <div className="flex items-center relative">
                            <div className="absolute pl-4 text-zinc-600">
                                <IconSearch />
                            </div>
                            <input
                                className="w-80 border rounded-lg pl-12 py-0.5 bg-[#ebebf08d]"
                                type="search"
                                placeholder="Search for an organization" />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}