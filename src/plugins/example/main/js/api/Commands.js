const register = (editor) => {
  editor.addCommand("mceExample", () => {
    console.log("example command");
  });
};

export { register };
