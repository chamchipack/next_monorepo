import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

pb.autoCancellation(false);

export default pb;

// import PocketBase from "pocketbase";

// const primaryUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
// const fallbackUrl = process.env.NEXT_PUBLIC_API_FALLBACK_URL as string;

// let pb = new PocketBase(primaryUrl);

// async function connectToDatabase(url: string): Promise<boolean> {
//   try {
//     pb = new PocketBase(url);
//     // Sample request to check the connection
//     await pb.collection("members").getList();
//     console.log(`Connected to PocketBase at ${url}`);
//     return true;
//   } catch (error) {
//     console.error(`Failed to connect to PocketBase at ${url}:`, error);
//     return false;
//   }
// }

// async function initializePocketBase(): Promise<void> {
//   let isConnected = await connectToDatabase(primaryUrl);
//   console.log("@@@@@@@@@@@@@@@@@@@@@@@@@22");
//   console.log(isConnected);
//   console.log("@@@@@@@@@@@@@@@@@@@@@@@@@22");
//   if (!isConnected) {
//     isConnected = await connectToDatabase(fallbackUrl);
//     if (!isConnected) {
//       console.error(
//         "Failed to connect to both primary and fallback PocketBase URLs."
//       );
//     }
//   }
// }

// initializePocketBase();

// export default pb;
