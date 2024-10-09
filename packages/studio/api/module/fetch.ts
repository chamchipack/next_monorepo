import { getServerSession } from "next-auth";
import PocketbaseFinder from "../server/db/convert";
import pb from "../server/db/pocketbase";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Collection =
    | "student"
    | "session"
    | "class"
    | "attendance"
    | "payment"
    | "instructor";

type Constructor = {
    collection: Collection;
};

type SortOption = { key: string; method: "asc" | "desc" }

interface SearchOptions {
    pagination?: { page: number; perPage: number };
    options?: any;
    target: Collection;
    sort: SortOption;
}

function removeEmptyValues(obj: any) {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([key, value]) => value !== "" && value !== null
        )
    );
}

export const getData = async ({ target, type, options, sort }) => {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id || "";

    if (!userId)
        return {
            message: "unauthorized",
            status: 401,
        }

    const setOptions = removeEmptyValues(options);

    const finder = new PocketbaseFinder({ collection: target });
    const controller = (finder as any)[type];

    const data = {
        target,
        pagination: { page: 1, perPage: 10 },
        options: setOptions,
        sort: {}
    }

    const result = await controller(data);
    return result
}