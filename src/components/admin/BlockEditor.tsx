/**
 * BlockEditor.tsx
 *
 * Editor de blocos usando BlockNote.
 * Versão estável e simples - sem customizações que causam crash.
 */

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useEffect, useRef } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function BlockEditor({ value, onChange, placeholder = 'Comece a escrever...' }: Props) {
    const initialContentRef = useRef(value);

    const editor = useCreateBlockNote({
        initialContent: undefined,
    });

    // Carregar conteúdo inicial uma única vez
    useEffect(() => {
        if (!editor || !initialContentRef.current) return;

        const loadContent = async () => {
            try {
                const blocks = await editor.tryParseHTMLToBlocks(initialContentRef.current);
                if (blocks && blocks.length > 0) {
                    editor.replaceBlocks(editor.document, blocks);
                }
            } catch {
                // ignorar erro silently
            }
        };

        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Sincronizar mudanças do editor com o pai
    useEffect(() => {
        if (!editor) return;

        const unsubscribe = editor.onChange(async () => {
            try {
                const html = await editor.blocksToHTMLLossy(editor.document);
                onChange(html);
            } catch {
                // ignorar erro silently
            }
        });

        return unsubscribe;
    }, [editor, onChange]);

    return (
        <div style={{
            height: '100%',
            width: '100%',
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            overflow: 'auto',
        }}>
            <BlockNoteView
                editor={editor}
                theme="dark"
            />
        </div>
    );
}
