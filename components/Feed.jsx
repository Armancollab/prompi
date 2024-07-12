"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <motion.div
      className="mt-16 prompt_layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {data.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <PromptCard post={post} handleTagClick={handleTagClick} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = useCallback(
    (searchtext) => {
      const regex = new RegExp(searchtext, "i");
      return allPosts.filter(
        (item) =>
          regex.test(item.creator.username) ||
          item.tag.split(/\s+/).some((tag) => regex.test(tag)) ||
          regex.test(item.prompt)
      );
    },
    [allPosts]
  );

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setActiveTag(null);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 300)
    );
  };

  const handleTagClick = (clickedTag) => {
    setSearchText("");
    setActiveTag(clickedTag);
    const searchResult = allPosts.filter((post) =>
      post.tag
        .split(/\s+/)
        .some((tag) => tag.toLowerCase() === clickedTag.toLowerCase())
    );
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {activeTag && (
        <div className="mt-4 text-center">
          <motion.span
            className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {activeTag}
          </motion.span>
          <motion.button
            onClick={() => {
              setActiveTag(null);
              setSearchedResults([]);
            }}
            className="text-red-500 text-xs"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Clear filter
          </motion.button>
        </div>
      )}

      <PromptCardList
        data={searchText || activeTag ? searchedResults : allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
