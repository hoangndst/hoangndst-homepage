import { writeFileSync } from "fs";
import { slug } from "github-slugger";

async function fetchAllBlogs() {
  const response = await fetch("http://localhost:3000/api/blogs");
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return response.json();
}

export const omit = (obj, keys) => {
  const result = JSON.parse(JSON.stringify(obj));
  result.forEach((file) => {
    keys.forEach((key) => {
      delete file[key];
    });
  });
  return result;
};

function createTagCount(allBlogs) {
  const tagCount = {};
  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });
  writeFileSync("../tag-data.json", JSON.stringify(tagCount, null, 2));
  console.log("tag-data.json has been generated successfully...");
}

function createSearchIndex(allBlogs) {
  const contents = omit(allBlogs, ["body", "_id"]);
  writeFileSync("../search.json", JSON.stringify(contents, null, 2));
  console.log("Local search index generated successfully...");
}

async function main() {
  try {
    const allBlogs = await fetchAllBlogs();
    createTagCount(allBlogs);
    createSearchIndex(allBlogs);
  } catch (error) {
    console.error("Error generating tag data and search index", error);
  }
}

main();
