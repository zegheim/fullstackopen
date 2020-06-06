const _ = require("lodash");

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favouriteBlog = (blogs) => {
  const formattedBlogs = blogs.map((blog) => {
    delete blog._id;
    delete blog.__v;
    return blog;
  });
  const getMostLikedBlog = (mostLikedBlog, blog) =>
    mostLikedBlog.likes > blog.likes ? mostLikedBlog : blog;

  return formattedBlogs.reduce(getMostLikedBlog, {});
};

const mostBlogs = (blogs) => {
  const authorCountObj = _.countBy(blogs, (blog) => blog.author);
  const authorCountArr = Object.entries(
    authorCountObj
  ).map(([author, blogs]) => ({ author, blogs }));

  const getMaxAuthor = (maxAuthor, author) =>
    maxAuthor.blogs > author.blogs ? maxAuthor : author;

  return authorCountArr.reduce(getMaxAuthor, {});
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs };
