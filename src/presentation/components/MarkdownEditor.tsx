import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  Separator,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  readOnly?: boolean;
}

function MarkdownEditor({ value, onChange, readOnly = false }: MarkdownEditorProps) {
  return (
    <MDXEditor
      className="markdown-editor"
      markdown={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder="Describe la tarea con formato..."
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <BlockTypeSelect />
              <ListsToggle />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  );
}

export default MarkdownEditor;