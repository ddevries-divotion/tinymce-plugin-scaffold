import type { Editor } from "tinymce";
import * as Commands from "./api/Commands";
import * as Utils from "./core/Utils";
import * as Buttons from "./ui/Buttons";

export default () => {
  tinymce.PluginManager.add("example", (editor: Editor, _url: string) => {
    Commands.register(editor);
    Utils.register(editor);
    Buttons.register(editor);

    return {
      getMetadata: () => ({
        name: "example",
        url: "https://example.com/docs/example",
      }),
    };
  });
};
