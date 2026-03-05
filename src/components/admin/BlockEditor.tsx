/**
 * BlockEditor.tsx
 *
 * Editor de blocos usando BlockNote com Mantine.
 * Inclui blocos customizados: ExpertScore (review) e Features (lista de benefícios).
 */

import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import {
    useCreateBlockNote,
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useEffect, useRef } from 'react';

// Importar blocos customizados
import { ExpertScoreBlock } from './blocks/ExpertScoreBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';

// Schema estendido com os blocos customizados
// IMPORTANTE: ExpertScoreBlock e FeaturesBlock são objetos (não funções) retornados por createReactBlockSpec
const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        expertScore: ExpertScoreBlock,
        features: FeaturesBlock,
    },
});

type EditorType = typeof schema.BlockNoteEditor;

// Itens do Slash Menu para os blocos customizados
const getCustomSlashMenuItems = (editor: EditorType) => [
    {
        title: '⭐ Resenha / Expert Score',
        onItemClick: () => {
            editor.insertBlocks(
                [{ type: 'expertScore' as const }],
                editor.getTextCursorPosition().block,
                'after'
            );
        },
        aliases: ['score', 'resenha', 'review', 'produto', 'afiliado', 'avaliacao', 'pros', 'contras'],
        group: 'Plugins',
    },
    {
        title: '✅ Caixa de Benefícios / Features',
        onItemClick: () => {
            editor.insertBlocks(
                [{ type: 'features' as const }],
                editor.getTextCursorPosition().block,
                'after'
            );
        },
        aliases: ['features', 'caracteristicas', 'beneficios', 'lista', 'pros'],
        group: 'Plugins',
    },
];

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function BlockEditor({ value, onChange }: Props) {
    const initialContentRef = useRef(value);

    const editor = useCreateBlockNote({ schema });

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
                // ignorar silently
            }
        };

        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Sincronizar mudanças com o componente pai
    useEffect(() => {
        if (!editor) return;

        const unsubscribe = editor.onChange(async () => {
            try {
                const html = await editor.blocksToHTMLLossy(editor.document);
                onChange(html);
            } catch {
                // ignorar silently
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
                slashMenu={false}
            >
                <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) => {
                        const customItems = getCustomSlashMenuItems(editor);
                        const defaultItems = getDefaultReactSlashMenuItems(editor);
                        const allItems = [...customItems, ...defaultItems];

                        if (!query) return allItems;

                        return allItems.filter(item =>
                            item.title.toLowerCase().includes(query.toLowerCase()) ||
                            item.aliases?.some(a => a.toLowerCase().includes(query.toLowerCase()))
                        );
                    }}
                />
            </BlockNoteView>
        </div>
    );
}
