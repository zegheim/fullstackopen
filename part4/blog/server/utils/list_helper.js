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

const getMaxAuthor = (attr) => (maxAuthor, author) =>
  maxAuthor[attr] > author[attr] ? maxAuthor : author;

const mostBlogs = (blogs) => {
  const authorCountObj = _.countBy(blogs, (blog) => blog.author);
  const authorCountArr = Object.entries(
    authorCountObj
  ).map(([author, blogs]) => ({ author, blogs }));

  return authorCountArr.reduce(getMaxAuthor("blogs"), {});
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blogs) => blogs.author);
  const likesByAuthor = Object.entries(blogsByAuthor).map(
    ([author, blogs]) => ({
      author,
      likes: blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0),
    })
  );

  return likesByAuthor.reduce(getMaxAuthor("likes"), {});
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
