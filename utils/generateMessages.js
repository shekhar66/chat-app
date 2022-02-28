const generateMessages = (text) => {
  return {
    message: text,
    createdAt: new Date(),
  };
};

const generateLocationMessages = (url) => {
  return {
    url,
    createdAt: new Date(),
  };
};

module.exports = { generateMessages, generateLocationMessages };
