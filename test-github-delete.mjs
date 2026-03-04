import fetch from 'node-fetch';
import fs from 'node:fs';

const TOKEN = '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'; // From earlier conversation
const OWNER = 'zelmdhs-eng';
const REPO = 'paulafranco01';
const BRANCH = 'main';

async function testDel() {
    const path = 'public/images/posts/1772559374902-leandro.webp';
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;

    console.log(`Buscando SHA em: ${url}`);

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Cache-Control': 'no-cache' // Forcing no cache
        }
    });

    console.log('Status HTTP GET:', res.status);
    if (res.status !== 200) {
        console.log('Error Body:', await res.text());
        return;
    }
    const data = await res.json();
    console.log('SHA:', data.sha);

    // Now try DELETE
    /*
    const delRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
            message: 'test manual delete',
            sha: data.sha,
            branch: BRANCH
        })
    });
    console.log('Status HTTP DELETE:', delRes.status);
    console.log('Del Body:', await delRes.text());
    */
}

testDel();
