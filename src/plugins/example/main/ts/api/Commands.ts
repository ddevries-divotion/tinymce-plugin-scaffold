import type { Editor } from "tinymce";

const register = (editor: Editor) => {
  editor.addCommand("mceExample", () => {
    console.log("example command");
  });
};

export { register };
