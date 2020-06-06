const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favouriteBlog = (blogs) => {
  const getMostLikedBlog = (mostLikedBlog, blog) =>
    mostLikedBlog.likes > blog.likes ? mostLikedBlog : blog;

  return blogs.length ? blogs.reduce(getMostLikedBlog, {}) : null;
};

module.exports = { dummy, totalLikes, favouriteBlog };
