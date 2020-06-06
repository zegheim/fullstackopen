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

  return formattedBlogs.length
    ? formattedBlogs.reduce(getMostLikedBlog, {})
    : null;
};

module.exports = { dummy, totalLikes, favouriteBlog };
