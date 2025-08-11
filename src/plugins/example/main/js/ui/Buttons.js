const register = (editor) => {
  const onAction = () => editor.execCommand("mceExample");

  editor.ui.registry.addButton("example", {
    text: "example",
    onAction,
  });

  editor.ui.registry.addMenuItem("example", {
    text: "example",
    onAction,
  });
};

export { register };
