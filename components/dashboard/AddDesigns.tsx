"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing"; 
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AddDesignPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("clothing");
  const [imageUrl, setImageUrl] = useState(""); // 👈 We store the UploadThing URL here
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);

  // 1. Submit to Express Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null); // Reset feedback on new submission

    if (!imageUrl) {
      setFeedback({ type: "error", message: "Please upload an image first!" });
      return;
    }

    setIsSubmitting(true);

    try {
      // 🚀 Send the Data to your Express Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/designs/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          category,
          imageUrl, // The link we got from UploadThing
        }),
        credentials: "include", // Send the auth cookie
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "Design Published Successfully!" });
        router.push("/dashboard");
      } else {
        setFeedback({ type: "error", message: "Failed to publish design." });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFeedback({ type: "error", message: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-linear-to-br from-gray-50 to-gray-200 shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600">
        Add New Design
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {feedback && (
          <div
            className={`p-3 rounded-md text-sm ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Price */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Category */}
          <div className="flex-1 mt-6 md:mt-0">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="home-goods">Home Goods</option>
            </select>
          </div>
        </div>

        {/* IMAGE UPLOAD FIELD */}
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50/50">
          <label className="block text-sm font-medium mb-4 text-gray-700">Design Image</label>
          
          {imageUrl ? (
            <div className="relative inline-block">
              <Image
                src={imageUrl}
                alt="Preview"
                width={192}
                height={192}
                className="h-48 w-auto mx-auto rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline transition"
              >
                Remove & Upload Different Image
              </button>
            </div>
          ) : (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // 👇 THIS IS THE MAGIC PART
                // UploadThing returns the array of uploaded files. 
                // We take the URL and save it to React State.
                if (res && res[0]) {
                  console.log("Upload Completed! URL:", res[0].url);
                  setImageUrl(res[0].url); 
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Upload Failed: ${error.message}`);
              }}
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!imageUrl || isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all duration-300
            ${!imageUrl || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
        >
          {isSubmitting ? "Publishing..." : "Publish Design"}
        </button>

      </form>
    </div>
  );
}
