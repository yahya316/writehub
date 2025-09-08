// components/RichTextEditor.js
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const Tiptap = ({ content, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false, // This is the fix
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose min-h-[200px] border border-gray-300 rounded-md p-4 focus:outline-none focus:border-blue-500',
      },
    },
  });
  useEffect(() => {
    if (editor && content) {
      // This will set the editor's content when the 'content' prop changes.
      // The 'emitUpdate: false' option prevents this from triggering a new onUpdate event.
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;





        // immediatelyRender: false, 