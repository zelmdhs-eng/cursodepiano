import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

async function testWrite() {
    try {
        const slug = 'test-post';
        const POSTS_DIR = path.resolve('./src/content/posts');
        const filename = `${slug}.mdoc`;

        const data = {
            title: "Test Post",
            slug: "test-post",
            author: "Paula Franco"
        };

        const cleanData = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value !== undefined && value !== null && value !== '') {
                cleanData[key] = value;
            }
        });

        const frontmatter = yaml.dump(cleanData, {
            lineWidth: -1, noRefs: true, quotingType: '"',
        });
        const content = "Test content";
        const fileContent = `---\n${frontmatter}---\n\n${content}`;

        const filePath = path.join(POSTS_DIR, filename);
        console.log('Writing to:', filePath);

        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log('Success!');
    } catch (e) {
        console.error('Error:', e);
    }
}

testWrite();
