"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const handleProfileClick = useCallback(() => {
    if (post.creator._id === session?.user.id) {
      router.push("/profile");
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
    }
  }, [post.creator._id, post.creator.username, router, session?.user.id]);

  const handleCopy = useCallback(() => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }, [post.prompt]);

  const handleTagClicks = useCallback(
    (tag) => {
      if (handleTagClick) handleTagClick(tag);
    },
    [handleTagClick]
  );

  return (
    <motion.div
      className="prompt_card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start gap-5">
        <motion.div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="copy_btn"
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </motion.div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <div className="flex flex-wrap gap-2">
        {post.tag.split(/\s+/).map((tag, index) => (
          <motion.span
            key={index}
            className="font-inter text-sm blue_gradient cursor-pointer bg-blue-100 px-2 py-1 rounded-full"
            onClick={() => handleTagClicks(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <motion.div
          className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.p>
          <motion.p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PromptCard;
