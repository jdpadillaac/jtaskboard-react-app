import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface MarkdownEditorProps {
  initialValue: string;
  onChange: (markdown: string) => void;
  readOnly?: boolean;
}

function MarkdownEditor({ initialValue, onChange, readOnly = false }: MarkdownEditorProps) {
  return (
    <MDXEditor
      className="markdown-editor"
      markdown={initialValue}
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