import { IconBoxes, IconSearch } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/hooks/organizationContex";
import { Link } from "react-router-dom";

export default function Organizations() {
    const organizations = useOrganizations() || [];
    return (
        <>
            <div className="flex flex-col lg:mx-56 sm:mx-20 mx-6 h-auto">
                <section className="flex flex-col sm:mt-10 mt-4 sm:gap-y-10 gap-y-6">
                    <h1 className="sm:text-3xl text-2xl font-medium">
                        Your Organizations
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4 ">
                        <Button className="text-white">
                            New Organization
                        </Button>
                        <div className="flex items-center relative">
                            <div className="absolute pl-4 text-zinc-600 dark:text-zinc-200">
                                <IconSearch />
                            </div>
                            <input
                                className="w-full sm:w-80 border rounded-lg pl-12 py-0.5 bg-[var(--input-soft)]"
                                type="search"
                                placeholder="Search for an organization" />
                        </div>
                    </div>
                </section>
                <div className="flex gap-x-5 mt-10 ">
                    {
                        organizations.map((organization) =>(
                            <Link 
                                to={`/dashboard/org/${organization.name.replace(/\s+/g, '-').toLowerCase()}`}
                                key={organization.id} 
                                className="flex w-full sm:w-[450px] border rounded-2xl px-5 py-4 gap-4
                                    items-center bg-secondary">
                                <div className="bg-black rounded-4xl p-1.5">
                                    <IconBoxes/>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">{organization.name}</h2>
                                    <h3 className="text-sm">{organization.subscriptions[0].plan.name}</h3>
                                </div>
                            </Link>
                        ))
                    }
                </div>
                <div>

                </div>
            </div>
        </>
    )
}